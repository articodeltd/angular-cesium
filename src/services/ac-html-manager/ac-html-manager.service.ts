import { Injectable } from '@angular/core';

@Injectable()
export class AcHtmlManager {
    private _entities: Map<any, any>;

    constructor() {
        this._entities = new Map<any, any>();
    }

    has(id): boolean {
        return this._entities.has(id);
    }

    get(id): {entity, primitive} {
        return this._entities.get(id);
    }

    addOrUpdate(id: any, info: {entity, primitive}) {
        this._entities.set(id, info);
    }

    remove(id) {
        this._entities.delete(id);
    }

    forEach(callback) {
        this._entities.forEach(callback);
    }
}
