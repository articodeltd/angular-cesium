import {Injectable} from "@angular/core";
import {JsonMapper} from "../json-mapper/json-mapper.service";
import {Parse} from "../../../angular2-parse/src/services/parse/parse.service";
import {ComputationCache} from "../computation-cache/computation-cache.service";

export class CesiumProperty {
    private _get: Function;

    constructor(
        private _name: string,
        private _expression: string,
        private _parser: Parse
    ){
        this._get = this._parser.$evalParse(this._expression);
    }

    get name(): string {
        return this._name;
    }

    get expression(): string {
        return this._expression;
    }

    get(context: Object): any {
        return this._get(context);
    }
}

@Injectable()
export class CesiumProperties {

    constructor(
        private _parser: Parse,
        private _jsonMapper: JsonMapper
    ) {}

    createPropsMap(propsAttr: string): Map<string, CesiumProperty> {
        const propsMap = new Map<string, CesiumProperty>();
        const resultMap = this._jsonMapper.map(propsAttr);

        for (let [prop, expression] of resultMap) {
            propsMap.set(prop, new CesiumProperty(prop, expression, this._parser));
        }

        return propsMap;
    }

    createPropsArray(propsAttr: string): CesiumProperty[] {
        const propsMap = [];
        const resultMap = this._jsonMapper.map(propsAttr);

        for (let [prop, expression] of resultMap) {
            propsMap.push(new CesiumProperty(prop, expression, this._parser));
        }

        return propsMap;
    }

    createCesiumPropsFromMap(propsMap: Map<string, CesiumProperty>, cache: ComputationCache, context: Object): Object {
        const cesiumDesc = {};

        for (let [propName, cesiumProp] of propsMap){
            cesiumDesc[propName] = cache.get(cesiumProp.expression, () => cesiumProp.get(context));
        }

        return cesiumDesc;
    }

    createCesiumPropsFromArry(propsArr: CesiumProperty[], cache: ComputationCache, context: Object): Object {
        const cesiumDesc = {};

        for (let i = 0, length = propsArr.length; i < length; i++) {
            cesiumDesc[propsArr[i].name] = cache.get(propsArr[i].expression, () => propsArr[i].get(context));
        }

        return cesiumDesc;
    }

    compileCesiumProps(propsMap: Map<string, CesiumProperty>): Function {
        const cesiumDesc = {};

        for (let [propName, cesiumProp] of propsMap){
            cesiumDesc[propName ? propName : 'undefined'] = `cache.get('${cesiumProp.expression}', () => propsMap.get('${propName}').get(context))`;
        }

        const fnBody = JSON.stringify(cesiumDesc).replace(/"/g, '');

        return eval(`(function parseProps(cache, context) { return ${fnBody}; })`);
    }
}