import { EventEmitter, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as i0 from "@angular/core";
/**
 * Service for solving plonter.
 * Used by map-event-manager and plonter context component
 */
export class PlonterService {
    constructor() {
        this._entitesToPlonter = [];
        this._plonterChangeNotifier = new EventEmitter();
        this._plonterObserver = new Subject();
    }
    get plonterChangeNotifier() {
        return this._plonterChangeNotifier;
    }
    get plonterShown() {
        return this._plonterShown;
    }
    get entitesToPlonter() {
        return this._entitesToPlonter;
    }
    get plonterClickPosition() {
        return this._eventResult.movement;
    }
    plonterIt(eventResult) {
        this._eventResult = eventResult;
        this._entitesToPlonter = eventResult.entities;
        this._plonterShown = true;
        this._plonterChangeNotifier.emit();
        return this._plonterObserver;
    }
    resolvePlonter(entity) {
        this._plonterShown = false;
        this._eventResult.entities = [entity];
        this._plonterChangeNotifier.emit();
        this._plonterObserver.next(this._eventResult);
    }
}
PlonterService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: PlonterService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
PlonterService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: PlonterService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: PlonterService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return []; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxvbnRlci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2xpYi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9wbG9udGVyL3Bsb250ZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUV6RCxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDOztBQUcvQjs7O0dBR0c7QUFFSCxNQUFNLE9BQU8sY0FBYztJQU96QjtRQUxRLHNCQUFpQixHQUFlLEVBQUUsQ0FBQztRQUduQywyQkFBc0IsR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUdyRSxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxPQUFPLEVBQWUsQ0FBQztJQUNyRCxDQUFDO0lBRUQsSUFBSSxxQkFBcUI7UUFDdkIsT0FBTyxJQUFJLENBQUMsc0JBQXNCLENBQUM7SUFDckMsQ0FBQztJQUVELElBQUksWUFBWTtRQUNkLE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQztJQUM1QixDQUFDO0lBRUQsSUFBSSxnQkFBZ0I7UUFDbEIsT0FBTyxJQUFJLENBQUMsaUJBQWlCLENBQUM7SUFDaEMsQ0FBQztJQUVELElBQUksb0JBQW9CO1FBQ3RCLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUM7SUFDcEMsQ0FBQztJQUVELFNBQVMsQ0FBQyxXQUF3QjtRQUNoQyxJQUFJLENBQUMsWUFBWSxHQUFHLFdBQVcsQ0FBQztRQUNoQyxJQUFJLENBQUMsaUJBQWlCLEdBQUcsV0FBVyxDQUFDLFFBQVEsQ0FBQztRQUM5QyxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztRQUUxQixJQUFJLENBQUMsc0JBQXNCLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDbkMsT0FBTyxJQUFJLENBQUMsZ0JBQWdCLENBQUM7SUFDL0IsQ0FBQztJQUVELGNBQWMsQ0FBQyxNQUFnQjtRQUM3QixJQUFJLENBQUMsYUFBYSxHQUFHLEtBQUssQ0FBQztRQUMzQixJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRXRDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNuQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUNoRCxDQUFDOzsyR0ExQ1UsY0FBYzsrR0FBZCxjQUFjOzJGQUFkLGNBQWM7a0JBRDFCLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFdmVudEVtaXR0ZXIsIEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgQWNFbnRpdHkgfSBmcm9tICcuLi8uLi9tb2RlbHMvYWMtZW50aXR5JztcclxuaW1wb3J0IHsgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBFdmVudFJlc3VsdCwgTW92ZW1lbnQgfSBmcm9tICcuLi9tYXAtZXZlbnRzLW1hbmFuZ2VyL21hcC1ldmVudHMtbWFuYWdlcic7XHJcblxyXG4vKipcclxuICogU2VydmljZSBmb3Igc29sdmluZyBwbG9udGVyLlxyXG4gKiBVc2VkIGJ5IG1hcC1ldmVudC1tYW5hZ2VyIGFuZCBwbG9udGVyIGNvbnRleHQgY29tcG9uZW50XHJcbiAqL1xyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBQbG9udGVyU2VydmljZSB7XHJcbiAgcHJpdmF0ZSBfcGxvbnRlclNob3duOiBib29sZWFuO1xyXG4gIHByaXZhdGUgX2VudGl0ZXNUb1Bsb250ZXI6IEFjRW50aXR5W10gPSBbXTtcclxuICBwcml2YXRlIF9wbG9udGVyT2JzZXJ2ZXI6IFN1YmplY3Q8RXZlbnRSZXN1bHQ+O1xyXG4gIHByaXZhdGUgX2V2ZW50UmVzdWx0OiBFdmVudFJlc3VsdDtcclxuICBwcml2YXRlIF9wbG9udGVyQ2hhbmdlTm90aWZpZXI6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMuX3Bsb250ZXJPYnNlcnZlciA9IG5ldyBTdWJqZWN0PEV2ZW50UmVzdWx0PigpO1xyXG4gIH1cclxuXHJcbiAgZ2V0IHBsb250ZXJDaGFuZ2VOb3RpZmllcigpOiBFdmVudEVtaXR0ZXI8YW55PiB7XHJcbiAgICByZXR1cm4gdGhpcy5fcGxvbnRlckNoYW5nZU5vdGlmaWVyO1xyXG4gIH1cclxuXHJcbiAgZ2V0IHBsb250ZXJTaG93bigpOiBib29sZWFuIHtcclxuICAgIHJldHVybiB0aGlzLl9wbG9udGVyU2hvd247XHJcbiAgfVxyXG5cclxuICBnZXQgZW50aXRlc1RvUGxvbnRlcigpOiBBY0VudGl0eVtdIHtcclxuICAgIHJldHVybiB0aGlzLl9lbnRpdGVzVG9QbG9udGVyO1xyXG4gIH1cclxuXHJcbiAgZ2V0IHBsb250ZXJDbGlja1Bvc2l0aW9uKCk6IE1vdmVtZW50IHtcclxuICAgIHJldHVybiB0aGlzLl9ldmVudFJlc3VsdC5tb3ZlbWVudDtcclxuICB9XHJcblxyXG4gIHBsb250ZXJJdChldmVudFJlc3VsdDogRXZlbnRSZXN1bHQpIHtcclxuICAgIHRoaXMuX2V2ZW50UmVzdWx0ID0gZXZlbnRSZXN1bHQ7XHJcbiAgICB0aGlzLl9lbnRpdGVzVG9QbG9udGVyID0gZXZlbnRSZXN1bHQuZW50aXRpZXM7XHJcbiAgICB0aGlzLl9wbG9udGVyU2hvd24gPSB0cnVlO1xyXG5cclxuICAgIHRoaXMuX3Bsb250ZXJDaGFuZ2VOb3RpZmllci5lbWl0KCk7XHJcbiAgICByZXR1cm4gdGhpcy5fcGxvbnRlck9ic2VydmVyO1xyXG4gIH1cclxuXHJcbiAgcmVzb2x2ZVBsb250ZXIoZW50aXR5OiBBY0VudGl0eSkge1xyXG4gICAgdGhpcy5fcGxvbnRlclNob3duID0gZmFsc2U7XHJcbiAgICB0aGlzLl9ldmVudFJlc3VsdC5lbnRpdGllcyA9IFtlbnRpdHldO1xyXG5cclxuICAgIHRoaXMuX3Bsb250ZXJDaGFuZ2VOb3RpZmllci5lbWl0KCk7XHJcbiAgICB0aGlzLl9wbG9udGVyT2JzZXJ2ZXIubmV4dCh0aGlzLl9ldmVudFJlc3VsdCk7XHJcbiAgfVxyXG59XHJcbiJdfQ==