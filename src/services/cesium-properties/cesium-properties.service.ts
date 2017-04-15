import { Injectable } from '@angular/core';
import { JsonMapper } from '../json-mapper/json-mapper.service';
import { Parse } from 'angular2parse';
import { SmartAssigner } from '../smart-assigner/smart-assigner.service';
import { ComputationCache } from '../computation-cache/computation-cache.service';

@Injectable()
export class CesiumProperties {
	private _assignersCache = new Map<string, (oldVal: Object, newVal: Object) => Object>();
	private _evaluatorsCache = new Map<string, (cache: ComputationCache, context: Object) => Object>();

	constructor(private _parser: Parse,
	            private _jsonMapper: JsonMapper) {}

	_compile(expression: string): (cache: ComputationCache, context: Object) => Object {
		const cesiumDesc = {};
		const propsMap = new Map<string, {expression: string, get: Function}>();

		const resultMap = this._jsonMapper.map(expression);

		resultMap.forEach((resultExpression, prop) => propsMap.set(prop, {
			expression: resultExpression,
			get: this._parser.eval(resultExpression)
		}));

		propsMap.forEach((value, prop) => {
			cesiumDesc[prop || 'undefined'] = `cache.get(\`${value.expression}\`, () => propsMap.get('${prop}').get(context))`;
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

	createEvaluator(expression: string): (cache: ComputationCache, context: Object) => Object {
		if (this._evaluatorsCache.has(expression)) {
			return this._evaluatorsCache.get(expression);
		}

		const evaluatorFn = this._compile(expression);
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
