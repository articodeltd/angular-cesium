import { Injectable } from '@angular/core';

@Injectable()
export class AcHtmlManager {
  private _entities: Map<any, any>;

  constructor() {
    this._entities = new Map<any, any>();
  }

  has(id: string): boolean {
    return this._entities.has(id);
  }

  get(id: string): { entity: any, primitive: any } {
    return this._entities.get(id);
  }

  addOrUpdate(id: any, info: { entity: any, primitive: any }) {
    this._entities.set(id, info);
  }

  remove(id: string) {
    this._entities.delete(id);
  }

  forEach(callback: any) {
    this._entities.forEach(callback);
  }
}
