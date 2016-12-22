import {Injectable} from "@angular/core";
import {JsonMapper} from "../json-mapper/json-mapper.service";

@Injectable()
export class CesiumProperties {

    constructor(
        private _jsonMapper: JsonMapper
    ) {}

    create(attrs) {

    }
}