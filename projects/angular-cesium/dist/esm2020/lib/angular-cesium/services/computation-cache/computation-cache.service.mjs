import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
export class ComputationCache {
    constructor() {
        this._cache = new Map();
    }
    get(expression, insertFn) {
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
ComputationCache.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: ComputationCache, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
ComputationCache.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: ComputationCache });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: ComputationCache, decorators: [{
            type: Injectable
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcHV0YXRpb24tY2FjaGUuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9saWIvYW5ndWxhci1jZXNpdW0vc2VydmljZXMvY29tcHV0YXRpb24tY2FjaGUvY29tcHV0YXRpb24tY2FjaGUuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDOztBQUczQyxNQUFNLE9BQU8sZ0JBQWdCO0lBRDdCO1FBRVUsV0FBTSxHQUFHLElBQUksR0FBRyxFQUFlLENBQUM7S0FlekM7SUFiQyxHQUFHLENBQUMsVUFBa0IsRUFBRSxRQUFxQjtRQUMzQyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxFQUFFO1lBQy9CLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7U0FDcEM7UUFFRCxNQUFNLEtBQUssR0FBRyxRQUFRLEVBQUUsQ0FBQztRQUN6QixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDbkMsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDO0lBRUQsS0FBSztRQUNILElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDdEIsQ0FBQzs7NkdBZlUsZ0JBQWdCO2lIQUFoQixnQkFBZ0I7MkZBQWhCLGdCQUFnQjtrQkFENUIsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIENvbXB1dGF0aW9uQ2FjaGUge1xyXG4gIHByaXZhdGUgX2NhY2hlID0gbmV3IE1hcDxzdHJpbmcsIGFueT4oKTtcclxuXHJcbiAgZ2V0KGV4cHJlc3Npb246IHN0cmluZywgaW5zZXJ0Rm46ICgoKSA9PiBhbnkpKTogYW55IHtcclxuICAgIGlmICh0aGlzLl9jYWNoZS5oYXMoZXhwcmVzc2lvbikpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuX2NhY2hlLmdldChleHByZXNzaW9uKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCB2YWx1ZSA9IGluc2VydEZuKCk7XHJcbiAgICB0aGlzLl9jYWNoZS5zZXQoZXhwcmVzc2lvbiwgdmFsdWUpO1xyXG4gICAgcmV0dXJuIHZhbHVlO1xyXG4gIH1cclxuXHJcbiAgY2xlYXIoKSB7XHJcbiAgICB0aGlzLl9jYWNoZS5jbGVhcigpO1xyXG4gIH1cclxufVxyXG4iXX0=