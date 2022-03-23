import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
export class AcHtmlManager {
    constructor() {
        this._entities = new Map();
    }
    has(id) {
        return this._entities.has(id);
    }
    get(id) {
        return this._entities.get(id);
    }
    addOrUpdate(id, info) {
        this._entities.set(id, info);
    }
    remove(id) {
        this._entities.delete(id);
    }
    forEach(callback) {
        this._entities.forEach(callback);
    }
}
AcHtmlManager.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcHtmlManager, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
AcHtmlManager.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcHtmlManager });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcHtmlManager, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return []; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtaHRtbC1tYW5hZ2VyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbGliL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2FjLWh0bWwtbWFuYWdlci9hYy1odG1sLW1hbmFnZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDOztBQUczQyxNQUFNLE9BQU8sYUFBYTtJQUd4QjtRQUNFLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxHQUFHLEVBQVksQ0FBQztJQUN2QyxDQUFDO0lBRUQsR0FBRyxDQUFDLEVBQVU7UUFDWixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ2hDLENBQUM7SUFFRCxHQUFHLENBQUMsRUFBVTtRQUNaLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDaEMsQ0FBQztJQUVELFdBQVcsQ0FBQyxFQUFPLEVBQUUsSUFBcUM7UUFDeEQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFFRCxNQUFNLENBQUMsRUFBVTtRQUNmLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzVCLENBQUM7SUFFRCxPQUFPLENBQUMsUUFBYTtRQUNuQixJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNuQyxDQUFDOzswR0F6QlUsYUFBYTs4R0FBYixhQUFhOzJGQUFiLGFBQWE7a0JBRHpCLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBBY0h0bWxNYW5hZ2VyIHtcclxuICBwcml2YXRlIF9lbnRpdGllczogTWFwPGFueSwgYW55PjtcclxuXHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLl9lbnRpdGllcyA9IG5ldyBNYXA8YW55LCBhbnk+KCk7XHJcbiAgfVxyXG5cclxuICBoYXMoaWQ6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRoaXMuX2VudGl0aWVzLmhhcyhpZCk7XHJcbiAgfVxyXG5cclxuICBnZXQoaWQ6IHN0cmluZyk6IHsgZW50aXR5OiBhbnksIHByaW1pdGl2ZTogYW55IH0ge1xyXG4gICAgcmV0dXJuIHRoaXMuX2VudGl0aWVzLmdldChpZCk7XHJcbiAgfVxyXG5cclxuICBhZGRPclVwZGF0ZShpZDogYW55LCBpbmZvOiB7IGVudGl0eTogYW55LCBwcmltaXRpdmU6IGFueSB9KSB7XHJcbiAgICB0aGlzLl9lbnRpdGllcy5zZXQoaWQsIGluZm8pO1xyXG4gIH1cclxuXHJcbiAgcmVtb3ZlKGlkOiBzdHJpbmcpIHtcclxuICAgIHRoaXMuX2VudGl0aWVzLmRlbGV0ZShpZCk7XHJcbiAgfVxyXG5cclxuICBmb3JFYWNoKGNhbGxiYWNrOiBhbnkpIHtcclxuICAgIHRoaXMuX2VudGl0aWVzLmZvckVhY2goY2FsbGJhY2spO1xyXG4gIH1cclxufVxyXG4iXX0=