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

    createCesiumProps(propsMap: Map<string, CesiumProperty>, cache: ComputationCache, context: Object): Object {
        const cesiumDesc = {};

        for (let [propName, cesiumProp] of propsMap){
            cesiumDesc[propName] = cache.get(cesiumProp.expression, () => cesiumProp.get(context));
        }

        return cesiumDesc;
    }
}