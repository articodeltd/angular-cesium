import { Injectable } from '@angular/core';
import { ASTWithSource, Lexer, Parser } from '../../../angular-parse/angular';
import { ParseVisitorCompiler } from '../../../angular-parse/visitors';
import { PixelOffsetPipe } from '../../pipes/pixel-offset/pixel-offset.pipe';
import { RadiansToDegreesPipe } from '../../pipes/radians-to-degrees/radians-to-degrees.pipe';
import { ComputationCache } from '../computation-cache/computation-cache.service';
import { JsonMapper } from '../json-mapper/json-mapper.service';
import { SmartAssigner } from '../smart-assigner/smart-assigner.service';





@Injectable()
export class CesiumProperties {
  private _assignersCache = new Map<string, (oldVal: Object, newVal: Object) => Object>();
  private _evaluatorsCache = new Map<string, (cache: ComputationCache, context: Object) => Object>();

  private _evalCache: Map<string, Function> = new Map<string, Function>();
  private _pipesCache: Map<string, any> = new Map<string, any>();
  private _parser: Parser = new Parser(new Lexer());


  constructor(
    private _jsonMapper: JsonMapper
  ) {

    // TODO: Check if other pipes are needed for parsing or 
    // find a way to get all pipes injected to this module
    this._pipesCache.set('pixelOffset', new PixelOffsetPipe())
    this._pipesCache.set('radiansToDegrees', new RadiansToDegreesPipe())
  }


  _eval(expression: string): Function {
    if (this._evalCache.has(expression)) {
      return this._evalCache.get(expression);
    }

    const visitor = new ParseVisitorCompiler();

    let ast: ASTWithSource = this._parser.parseInterpolation(expression, 'Parse');

    if (!ast) {
      ast = this._parser.parseBinding(expression, 'Parse');
    }

    const fnBody = ast.visit(visitor);

    const pipesCache = this._pipesCache;
    const getFn = new Function('context', 'pipesCache', `return ${fnBody};`);

    const evalParseFn = function evalParse(context: any): any {
      return getFn(context, pipesCache);
    };

    this._evalCache.set(expression, evalParseFn);

    return evalParseFn;
  }

  _compile(expression: string, withCache = true): (cache: ComputationCache, context: Object) => Object {
    const cesiumDesc = {};
    const propsMap = new Map<string, { expression: string, get: Function }>();

    const resultMap = this._jsonMapper.map(expression);



    resultMap.forEach((resultExpression, prop) => propsMap.set(prop, {
      expression: resultExpression,
      get: this._eval(resultExpression) // changed code
      // get: this._parser.eval(resultExpression) // changed code
    }));

    propsMap.forEach((value, prop) => {
      if (withCache) {
        cesiumDesc[prop || 'undefined'] = `cache.get(\`${value.expression}\`, () => propsMap.get('${prop}').get(context))`;
      }
      else {
        cesiumDesc[prop || 'undefined'] = `propsMap.get('${prop}').get(context)`;
      }
    });

    const fnBody = `return ${JSON.stringify(cesiumDesc).replace(/"/g, '')};`;
    const getFn = new Function('propsMap', 'cache', 'context', fnBody);

    return function evaluateCesiumProps(cache: ComputationCache, context: Object): Object {
      return getFn(propsMap, cache, context);
    };
  }

  _build(expression: string): (oldVal: Object, newVal: Object) => Object {
    const props = Array.from(this._jsonMapper.map(expression).keys());
    const smartAssigner = SmartAssigner.create(props);

    return function assignCesiumProps(oldVal: Object, newVal: Object) {
      return smartAssigner(oldVal, newVal);
    };
  }

  createEvaluator(expression: string, withCache = true, newEvaluator = false): (cache: ComputationCache, context: Object) => Object {
    if (!newEvaluator && this._evaluatorsCache.has(expression)) {
      return this._evaluatorsCache.get(expression);
    }

    const evaluatorFn = this._compile(expression, withCache);
    this._evaluatorsCache.set(expression, evaluatorFn);

    return evaluatorFn;
  }

  createAssigner(expression: string): (oldVal: Object, newVal: Object) => Object {
    if (this._assignersCache.has(expression)) {
      return this._assignersCache.get(expression);
    }

    const assignFn = this._build(expression);
    this._assignersCache.set(expression, assignFn);

    return assignFn;
  }
}
