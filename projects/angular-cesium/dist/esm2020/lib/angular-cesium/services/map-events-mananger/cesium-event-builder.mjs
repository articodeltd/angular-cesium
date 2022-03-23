import { publish } from 'rxjs/operators';
import { CesiumEvent } from './consts/cesium-event.enum';
import { Injectable } from '@angular/core';
import { CesiumPureEventObserver } from './event-observers/cesium-pure-event-observer';
import { CesiumLongPressObserver } from './event-observers/cesium-long-press-observer';
import * as i0 from "@angular/core";
import * as i1 from "../cesium/cesium.service";
export class CesiumEventBuilder {
    constructor(cesiumService) {
        this.cesiumService = cesiumService;
        this.cesiumEventsObservables = new Map();
    }
    static getEventFullName(event, modifier) {
        if (modifier) {
            return `${event}_${modifier}`;
        }
        else {
            return event.toString();
        }
    }
    init() {
        this.eventsHandler = this.cesiumService.getViewer().screenSpaceEventHandler;
    }
    get(event, modifier) {
        const eventName = CesiumEventBuilder.getEventFullName(event, modifier);
        if (this.cesiumEventsObservables.has(eventName)) {
            return this.cesiumEventsObservables.get(eventName);
        }
        else {
            const eventObserver = this.createCesiumEventObservable(event, modifier);
            this.cesiumEventsObservables.set(eventName, eventObserver);
            return eventObserver;
        }
    }
    createCesiumEventObservable(event, modifier) {
        let cesiumEventObservable;
        if (CesiumEventBuilder.longPressEvents.has(event)) {
            cesiumEventObservable = this.createSpecialCesiumEventObservable(event, modifier);
        }
        else {
            cesiumEventObservable = publish()(new CesiumPureEventObserver(event, modifier).init(this.eventsHandler));
        }
        cesiumEventObservable.connect();
        return cesiumEventObservable;
    }
    createSpecialCesiumEventObservable(event, modifier) {
        // could support more events if needed
        return new CesiumLongPressObserver(event, modifier, this).init();
    }
}
CesiumEventBuilder.longPressEvents = new Set([
    CesiumEvent.LONG_LEFT_PRESS,
    CesiumEvent.LONG_RIGHT_PRESS,
    CesiumEvent.LONG_MIDDLE_PRESS
]);
CesiumEventBuilder.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CesiumEventBuilder, deps: [{ token: i1.CesiumService }], target: i0.ɵɵFactoryTarget.Injectable });
CesiumEventBuilder.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CesiumEventBuilder });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CesiumEventBuilder, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.CesiumService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2VzaXVtLWV2ZW50LWJ1aWxkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbGliL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL21hcC1ldmVudHMtbWFuYW5nZXIvY2VzaXVtLWV2ZW50LWJ1aWxkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRXpDLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUV6RCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLDhDQUE4QyxDQUFDO0FBQ3ZGLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLDhDQUE4QyxDQUFDOzs7QUFJdkYsTUFBTSxPQUFPLGtCQUFrQjtJQUU3QixZQUFvQixhQUE0QjtRQUE1QixrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQVV4Qyw0QkFBdUIsR0FBRyxJQUFJLEdBQUcsRUFBc0MsQ0FBQztJQVRoRixDQUFDO0lBV00sTUFBTSxDQUFDLGdCQUFnQixDQUFDLEtBQWtCLEVBQUUsUUFBOEI7UUFDL0UsSUFBSSxRQUFRLEVBQUU7WUFDWixPQUFPLEdBQUcsS0FBSyxJQUFJLFFBQVEsRUFBRSxDQUFDO1NBQy9CO2FBQU07WUFDTCxPQUFPLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQztTQUN6QjtJQUNILENBQUM7SUFFRCxJQUFJO1FBQ0YsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsRUFBRSxDQUFDLHVCQUF1QixDQUFDO0lBQzlFLENBQUM7SUFFRCxHQUFHLENBQUMsS0FBa0IsRUFBRSxRQUE4QjtRQUNwRCxNQUFNLFNBQVMsR0FBRyxrQkFBa0IsQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDdkUsSUFBSSxJQUFJLENBQUMsdUJBQXVCLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxFQUFFO1lBQy9DLE9BQU8sSUFBSSxDQUFDLHVCQUF1QixDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztTQUNwRDthQUFNO1lBQ0wsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLDJCQUEyQixDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztZQUN4RSxJQUFJLENBQUMsdUJBQXVCLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxhQUFhLENBQUMsQ0FBQztZQUMzRCxPQUFPLGFBQWEsQ0FBQztTQUN0QjtJQUNILENBQUM7SUFFTywyQkFBMkIsQ0FBQyxLQUFrQixFQUFFLFFBQThCO1FBQ3BGLElBQUkscUJBQWlELENBQUM7UUFDdEQsSUFBSSxrQkFBa0IsQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ2pELHFCQUFxQixHQUFHLElBQUksQ0FBQyxrQ0FBa0MsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7U0FDbEY7YUFBTTtZQUNMLHFCQUFxQixHQUFHLE9BQU8sRUFBRSxDQUFDLElBQUksdUJBQXVCLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztTQUMxRztRQUNELHFCQUFxQixDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ2hDLE9BQU8scUJBQXFCLENBQUM7SUFDL0IsQ0FBQztJQUVPLGtDQUFrQyxDQUFDLEtBQWtCLEVBQUUsUUFBNkI7UUFDMUYsc0NBQXNDO1FBQ3RDLE9BQU8sSUFBSSx1QkFBdUIsQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ25FLENBQUM7O0FBOUNhLGtDQUFlLEdBQXFCLElBQUksR0FBRyxDQUFDO0lBQ3hELFdBQVcsQ0FBQyxlQUFlO0lBQzNCLFdBQVcsQ0FBQyxnQkFBZ0I7SUFDNUIsV0FBVyxDQUFDLGlCQUFpQjtDQUM5QixDQUFFLENBQUE7K0dBVFEsa0JBQWtCO21IQUFsQixrQkFBa0I7MkZBQWxCLGtCQUFrQjtrQkFEOUIsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHB1Ymxpc2ggfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XHJcbmltcG9ydCB7IENlc2l1bVNlcnZpY2UgfSBmcm9tICcuLi9jZXNpdW0vY2VzaXVtLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBDZXNpdW1FdmVudCB9IGZyb20gJy4vY29uc3RzL2Nlc2l1bS1ldmVudC5lbnVtJztcclxuaW1wb3J0IHsgQ2VzaXVtRXZlbnRNb2RpZmllciB9IGZyb20gJy4vY29uc3RzL2Nlc2l1bS1ldmVudC1tb2RpZmllci5lbnVtJztcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBDZXNpdW1QdXJlRXZlbnRPYnNlcnZlciB9IGZyb20gJy4vZXZlbnQtb2JzZXJ2ZXJzL2Nlc2l1bS1wdXJlLWV2ZW50LW9ic2VydmVyJztcclxuaW1wb3J0IHsgQ2VzaXVtTG9uZ1ByZXNzT2JzZXJ2ZXIgfSBmcm9tICcuL2V2ZW50LW9ic2VydmVycy9jZXNpdW0tbG9uZy1wcmVzcy1vYnNlcnZlcic7XHJcbmltcG9ydCB7IENvbm5lY3RhYmxlT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgQ2VzaXVtRXZlbnRCdWlsZGVyIHtcclxuXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBjZXNpdW1TZXJ2aWNlOiBDZXNpdW1TZXJ2aWNlKSB7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgc3RhdGljIGxvbmdQcmVzc0V2ZW50czogU2V0PENlc2l1bUV2ZW50PiA9IG5ldyBTZXQoW1xyXG4gICAgQ2VzaXVtRXZlbnQuTE9OR19MRUZUX1BSRVNTLFxyXG4gICAgQ2VzaXVtRXZlbnQuTE9OR19SSUdIVF9QUkVTUyxcclxuICAgIENlc2l1bUV2ZW50LkxPTkdfTUlERExFX1BSRVNTXHJcbiAgXSk7XHJcblxyXG4gIHByaXZhdGUgZXZlbnRzSGFuZGxlcjogYW55O1xyXG4gIHByaXZhdGUgY2VzaXVtRXZlbnRzT2JzZXJ2YWJsZXMgPSBuZXcgTWFwPHN0cmluZywgQ29ubmVjdGFibGVPYnNlcnZhYmxlPGFueT4+KCk7XHJcblxyXG4gIHB1YmxpYyBzdGF0aWMgZ2V0RXZlbnRGdWxsTmFtZShldmVudDogQ2VzaXVtRXZlbnQsIG1vZGlmaWVyPzogQ2VzaXVtRXZlbnRNb2RpZmllcik6IHN0cmluZyB7XHJcbiAgICBpZiAobW9kaWZpZXIpIHtcclxuICAgICAgcmV0dXJuIGAke2V2ZW50fV8ke21vZGlmaWVyfWA7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gZXZlbnQudG9TdHJpbmcoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGluaXQoKSB7XHJcbiAgICB0aGlzLmV2ZW50c0hhbmRsZXIgPSB0aGlzLmNlc2l1bVNlcnZpY2UuZ2V0Vmlld2VyKCkuc2NyZWVuU3BhY2VFdmVudEhhbmRsZXI7XHJcbiAgfVxyXG5cclxuICBnZXQoZXZlbnQ6IENlc2l1bUV2ZW50LCBtb2RpZmllcj86IENlc2l1bUV2ZW50TW9kaWZpZXIpOiBDb25uZWN0YWJsZU9ic2VydmFibGU8YW55PiB7XHJcbiAgICBjb25zdCBldmVudE5hbWUgPSBDZXNpdW1FdmVudEJ1aWxkZXIuZ2V0RXZlbnRGdWxsTmFtZShldmVudCwgbW9kaWZpZXIpO1xyXG4gICAgaWYgKHRoaXMuY2VzaXVtRXZlbnRzT2JzZXJ2YWJsZXMuaGFzKGV2ZW50TmFtZSkpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuY2VzaXVtRXZlbnRzT2JzZXJ2YWJsZXMuZ2V0KGV2ZW50TmFtZSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjb25zdCBldmVudE9ic2VydmVyID0gdGhpcy5jcmVhdGVDZXNpdW1FdmVudE9ic2VydmFibGUoZXZlbnQsIG1vZGlmaWVyKTtcclxuICAgICAgdGhpcy5jZXNpdW1FdmVudHNPYnNlcnZhYmxlcy5zZXQoZXZlbnROYW1lLCBldmVudE9ic2VydmVyKTtcclxuICAgICAgcmV0dXJuIGV2ZW50T2JzZXJ2ZXI7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGNyZWF0ZUNlc2l1bUV2ZW50T2JzZXJ2YWJsZShldmVudDogQ2VzaXVtRXZlbnQsIG1vZGlmaWVyPzogQ2VzaXVtRXZlbnRNb2RpZmllcik6IENvbm5lY3RhYmxlT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIGxldCBjZXNpdW1FdmVudE9ic2VydmFibGU6IENvbm5lY3RhYmxlT2JzZXJ2YWJsZTxhbnk+O1xyXG4gICAgaWYgKENlc2l1bUV2ZW50QnVpbGRlci5sb25nUHJlc3NFdmVudHMuaGFzKGV2ZW50KSkge1xyXG4gICAgICBjZXNpdW1FdmVudE9ic2VydmFibGUgPSB0aGlzLmNyZWF0ZVNwZWNpYWxDZXNpdW1FdmVudE9ic2VydmFibGUoZXZlbnQsIG1vZGlmaWVyKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNlc2l1bUV2ZW50T2JzZXJ2YWJsZSA9IHB1Ymxpc2goKShuZXcgQ2VzaXVtUHVyZUV2ZW50T2JzZXJ2ZXIoZXZlbnQsIG1vZGlmaWVyKS5pbml0KHRoaXMuZXZlbnRzSGFuZGxlcikpO1xyXG4gICAgfVxyXG4gICAgY2VzaXVtRXZlbnRPYnNlcnZhYmxlLmNvbm5lY3QoKTtcclxuICAgIHJldHVybiBjZXNpdW1FdmVudE9ic2VydmFibGU7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGNyZWF0ZVNwZWNpYWxDZXNpdW1FdmVudE9ic2VydmFibGUoZXZlbnQ6IENlc2l1bUV2ZW50LCBtb2RpZmllcjogQ2VzaXVtRXZlbnRNb2RpZmllcik6IENvbm5lY3RhYmxlT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIC8vIGNvdWxkIHN1cHBvcnQgbW9yZSBldmVudHMgaWYgbmVlZGVkXHJcbiAgICByZXR1cm4gbmV3IENlc2l1bUxvbmdQcmVzc09ic2VydmVyKGV2ZW50LCBtb2RpZmllciwgdGhpcykuaW5pdCgpO1xyXG4gIH1cclxufVxyXG5cclxuIl19