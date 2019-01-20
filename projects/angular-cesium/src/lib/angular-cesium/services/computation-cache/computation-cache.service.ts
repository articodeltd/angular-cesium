import { Injectable } from '@angular/core';

@Injectable()
export class ComputationCache {
  private _cache = new Map<string, any>();

  get(expression: string, insertFn: (() => any)): any {
    if (this._cache.has(expression)) {
      return this._cache.get(expression);
    }

    const value = insertFn();
    this._cache.set(expression, value);
    return value;
  }

  clear() {
    this._cache.clear();
  }
}
