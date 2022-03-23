import { filter, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { CesiumEvent } from '../map-events-mananger/consts/cesium-event.enum';
import { PickOptions } from '../map-events-mananger/consts/pickOptions.enum';
import * as i0 from "@angular/core";
import * as i1 from "../maps-manager/maps-manager.service";
/**
 * Manages entity selection service for any given mouse event and modifier
 * the service will manage the list of selected items.
 * check out the example
 * you must provide the service yourself
 *
 *  __Usage :__
 * ```
 * // provide the service in some component
 * @Component({
 * //...
 *  providers: [SelectionManagerService]
 * }
 *
 * // Usage example:
 * // init selection
 * const selectedIndicator = ture; // optional default true, if true a boolean "selected" property will be added to the selected entity
 * selectionManagerService.initSelection({ event: CesiumEvent.LEFT_CLICK,
 * 																			modifier: CesiumEventModifier.CTRL
 * 																		},selectedIndicator);
 * // Get selected
 * const selected = selectionManagerService.selected();
 *
 * // Or as observer
 * const selected$ = selectionManagerService.selected$();
 *
 * ```
 *
 */
export class SelectionManagerService {
    constructor(mapsManager) {
        this.mapsManager = mapsManager;
        this.selectedEntitiesItems$ = new BehaviorSubject([]);
        this.selectedEntitySubject$ = new Subject();
    }
    selectedEntities$() {
        return this.selectedEntitiesItems$.asObservable();
    }
    selectedEntities() {
        return this.selectedEntitiesItems$.getValue();
    }
    selectedEntity$() {
        return this.selectedEntitySubject$;
    }
    toggleSelection(entity, addSelectedIndicator) {
        const current = this.selectedEntities();
        if (current.indexOf(entity) === -1) {
            this.addToSelected(entity, addSelectedIndicator);
        }
        else {
            this.removeSelected(entity, addSelectedIndicator);
        }
    }
    addToSelected(entity, addSelectedIndicator) {
        if (addSelectedIndicator) {
            entity['selected'] = true;
        }
        const current = this.selectedEntities();
        this.selectedEntitySubject$.next(entity);
        this.selectedEntitiesItems$.next([...current, entity]);
    }
    removeSelected(entity, addSelectedIndicator) {
        if (addSelectedIndicator) {
            entity['selected'] = false;
        }
        const current = this.selectedEntities();
        const entityIndex = current.indexOf(entity);
        if (entityIndex !== -1) {
            current.splice(entityIndex, 1);
            this.selectedEntitiesItems$.next(current);
            this.selectedEntitySubject$.next(entity);
        }
    }
    initSelection(selectionOptions, addSelectedIndicator = true, eventPriority, mapId) {
        const mapComponent = this.mapsManager.getMap(mapId);
        if (!mapComponent) {
            return;
        }
        this.mapEventsManagerService = mapComponent.getMapEventsManager();
        if (!selectionOptions) {
            Object.assign(selectionOptions, { event: CesiumEvent.LEFT_CLICK });
        }
        const eventSubscription = this.mapEventsManagerService.register({
            event: selectionOptions.event,
            pick: PickOptions.PICK_ONE,
            modifier: selectionOptions.modifier,
            entityType: selectionOptions.entityType,
            priority: eventPriority,
        });
        eventSubscription.pipe(map(result => result.entities), filter(entities => entities && entities.length > 0))
            .subscribe(entities => {
            const entity = entities[0];
            this.toggleSelection(entity, addSelectedIndicator);
        });
    }
}
SelectionManagerService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: SelectionManagerService, deps: [{ token: i1.MapsManagerService }], target: i0.ɵɵFactoryTarget.Injectable });
SelectionManagerService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: SelectionManagerService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: SelectionManagerService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.MapsManagerService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0aW9uLW1hbmFnZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9saWIvYW5ndWxhci1jZXNpdW0vc2VydmljZXMvc2VsZWN0aW9uLW1hbmFnZXIvc2VsZWN0aW9uLW1hbmFnZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzdDLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLGVBQWUsRUFBYyxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFFNUQsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGlEQUFpRCxDQUFDO0FBRTlFLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxnREFBZ0QsQ0FBQzs7O0FBVzdFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBNEJHO0FBRUgsTUFBTSxPQUFPLHVCQUF1QjtJQUtsQyxZQUFvQixXQUErQjtRQUEvQixnQkFBVyxHQUFYLFdBQVcsQ0FBb0I7UUFKbkQsMkJBQXNCLEdBQWdDLElBQUksZUFBZSxDQUFhLEVBQUUsQ0FBQyxDQUFDO1FBQzFGLDJCQUFzQixHQUFzQixJQUFJLE9BQU8sRUFBWSxDQUFDO0lBSXBFLENBQUM7SUFFRCxpQkFBaUI7UUFDZixPQUFPLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUNwRCxDQUFDO0lBRUQsZ0JBQWdCO1FBQ2QsT0FBTyxJQUFJLENBQUMsc0JBQXNCLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDaEQsQ0FBQztJQUVELGVBQWU7UUFDYixPQUFPLElBQUksQ0FBQyxzQkFBc0IsQ0FBQztJQUNyQyxDQUFDO0lBRUQsZUFBZSxDQUFDLE1BQWdCLEVBQUUsb0JBQTZCO1FBQzdELE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxnQkFB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SEFoRlUsdUJBQXVCO3dIQUF2Qix1QkFBdUI7MkZBQXZCLHVCQUF1QjtrQkFEbkMsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGZpbHRlciwgbWFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEJlaGF2aW9yU3ViamVjdCwgT2JzZXJ2YWJsZSwgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBBY0VudGl0eSB9IGZyb20gJy4uLy4uL21vZGVscy9hYy1lbnRpdHknO1xyXG5pbXBvcnQgeyBDZXNpdW1FdmVudCB9IGZyb20gJy4uL21hcC1ldmVudHMtbWFuYW5nZXIvY29uc3RzL2Nlc2l1bS1ldmVudC5lbnVtJztcclxuaW1wb3J0IHsgTWFwRXZlbnRzTWFuYWdlclNlcnZpY2UgfSBmcm9tICcuLi9tYXAtZXZlbnRzLW1hbmFuZ2VyL21hcC1ldmVudHMtbWFuYWdlcic7XHJcbmltcG9ydCB7IFBpY2tPcHRpb25zIH0gZnJvbSAnLi4vbWFwLWV2ZW50cy1tYW5hbmdlci9jb25zdHMvcGlja09wdGlvbnMuZW51bSc7XHJcbmltcG9ydCB7IENlc2l1bUV2ZW50TW9kaWZpZXIgfSBmcm9tICcuLi9tYXAtZXZlbnRzLW1hbmFuZ2VyL2NvbnN0cy9jZXNpdW0tZXZlbnQtbW9kaWZpZXIuZW51bSc7XHJcbmltcG9ydCB7IE1hcHNNYW5hZ2VyU2VydmljZSB9IGZyb20gJy4uL21hcHMtbWFuYWdlci9tYXBzLW1hbmFnZXIuc2VydmljZSc7XHJcblxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBTZWxlY3Rpb25PcHRpb25zIHtcclxuICBldmVudD86IENlc2l1bUV2ZW50O1xyXG4gIG1vZGlmaWVyPzogQ2VzaXVtRXZlbnRNb2RpZmllcjtcclxuICBlbnRpdHlUeXBlPzogYW55O1xyXG59XHJcblxyXG4vKipcclxuICogTWFuYWdlcyBlbnRpdHkgc2VsZWN0aW9uIHNlcnZpY2UgZm9yIGFueSBnaXZlbiBtb3VzZSBldmVudCBhbmQgbW9kaWZpZXJcclxuICogdGhlIHNlcnZpY2Ugd2lsbCBtYW5hZ2UgdGhlIGxpc3Qgb2Ygc2VsZWN0ZWQgaXRlbXMuXHJcbiAqIGNoZWNrIG91dCB0aGUgZXhhbXBsZVxyXG4gKiB5b3UgbXVzdCBwcm92aWRlIHRoZSBzZXJ2aWNlIHlvdXJzZWxmXHJcbiAqXHJcbiAqICBfX1VzYWdlIDpfX1xyXG4gKiBgYGBcclxuICogLy8gcHJvdmlkZSB0aGUgc2VydmljZSBpbiBzb21lIGNvbXBvbmVudFxyXG4gKiBAQ29tcG9uZW50KHtcclxuICogLy8uLi5cclxuICogIHByb3ZpZGVyczogW1NlbGVjdGlvbk1hbmFnZXJTZXJ2aWNlXVxyXG4gKiB9XHJcbiAqXHJcbiAqIC8vIFVzYWdlIGV4YW1wbGU6XHJcbiAqIC8vIGluaXQgc2VsZWN0aW9uXHJcbiAqIGNvbnN0IHNlbGVjdGVkSW5kaWNhdG9yID0gdHVyZTsgLy8gb3B0aW9uYWwgZGVmYXVsdCB0cnVlLCBpZiB0cnVlIGEgYm9vbGVhbiBcInNlbGVjdGVkXCIgcHJvcGVydHkgd2lsbCBiZSBhZGRlZCB0byB0aGUgc2VsZWN0ZWQgZW50aXR5XHJcbiAqIHNlbGVjdGlvbk1hbmFnZXJTZXJ2aWNlLmluaXRTZWxlY3Rpb24oeyBldmVudDogQ2VzaXVtRXZlbnQuTEVGVF9DTElDSyxcclxuICogXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtb2RpZmllcjogQ2VzaXVtRXZlbnRNb2RpZmllci5DVFJMXHJcbiAqIFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH0sc2VsZWN0ZWRJbmRpY2F0b3IpO1xyXG4gKiAvLyBHZXQgc2VsZWN0ZWRcclxuICogY29uc3Qgc2VsZWN0ZWQgPSBzZWxlY3Rpb25NYW5hZ2VyU2VydmljZS5zZWxlY3RlZCgpO1xyXG4gKlxyXG4gKiAvLyBPciBhcyBvYnNlcnZlclxyXG4gKiBjb25zdCBzZWxlY3RlZCQgPSBzZWxlY3Rpb25NYW5hZ2VyU2VydmljZS5zZWxlY3RlZCQoKTtcclxuICpcclxuICogYGBgXHJcbiAqXHJcbiAqL1xyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBTZWxlY3Rpb25NYW5hZ2VyU2VydmljZSB7XHJcbiAgc2VsZWN0ZWRFbnRpdGllc0l0ZW1zJDogQmVoYXZpb3JTdWJqZWN0PEFjRW50aXR5W10+ID0gbmV3IEJlaGF2aW9yU3ViamVjdDxBY0VudGl0eVtdPihbXSk7XHJcbiAgc2VsZWN0ZWRFbnRpdHlTdWJqZWN0JDogU3ViamVjdDxBY0VudGl0eT4gPSBuZXcgU3ViamVjdDxBY0VudGl0eT4oKTtcclxuICBwcml2YXRlIG1hcEV2ZW50c01hbmFnZXJTZXJ2aWNlOiBNYXBFdmVudHNNYW5hZ2VyU2VydmljZTtcclxuXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBtYXBzTWFuYWdlcjogTWFwc01hbmFnZXJTZXJ2aWNlKSB7XHJcbiAgfVxyXG5cclxuICBzZWxlY3RlZEVudGl0aWVzJCgpOiBPYnNlcnZhYmxlPEFjRW50aXR5W10+IHtcclxuICAgIHJldHVybiB0aGlzLnNlbGVjdGVkRW50aXRpZXNJdGVtcyQuYXNPYnNlcnZhYmxlKCk7XHJcbiAgfVxyXG5cclxuICBzZWxlY3RlZEVudGl0aWVzKCk6IEFjRW50aXR5W10ge1xyXG4gICAgcmV0dXJuIHRoaXMuc2VsZWN0ZWRFbnRpdGllc0l0ZW1zJC5nZXRWYWx1ZSgpO1xyXG4gIH1cclxuXHJcbiAgc2VsZWN0ZWRFbnRpdHkkKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuc2VsZWN0ZWRFbnRpdHlTdWJqZWN0JDtcclxuICB9XHJcblxyXG4gIHRvZ2dsZVNlbGVjdGlvbihlbnRpdHk6IEFjRW50aXR5LCBhZGRTZWxlY3RlZEluZGljYXRvcjogYm9vbGVhbikge1xyXG4gICAgY29uc3QgY3VycmVudCA9IHRoaXMuc2VsZWN0ZWRFbnRpdGllcygpO1xyXG4gICAgaWYgKGN1cnJlbnQuaW5kZXhPZihlbnRpdHkpID09PSAtMSkge1xyXG4gICAgICB0aGlzLmFkZFRvU2VsZWN0ZWQoZW50aXR5LCBhZGRTZWxlY3RlZEluZGljYXRvcik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnJlbW92ZVNlbGVjdGVkKGVudGl0eSwgYWRkU2VsZWN0ZWRJbmRpY2F0b3IpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBhZGRUb1NlbGVjdGVkKGVudGl0eTogQWNFbnRpdHksIGFkZFNlbGVjdGVkSW5kaWNhdG9yOiBib29sZWFuKSB7XHJcbiAgICBpZiAoYWRkU2VsZWN0ZWRJbmRpY2F0b3IpIHtcclxuICAgICAgZW50aXR5WydzZWxlY3RlZCddID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBjdXJyZW50ID0gdGhpcy5zZWxlY3RlZEVudGl0aWVzKCk7XHJcbiAgICB0aGlzLnNlbGVjdGVkRW50aXR5U3ViamVjdCQubmV4dChlbnRpdHkpO1xyXG4gICAgdGhpcy5zZWxlY3RlZEVudGl0aWVzSXRlbXMkLm5leHQoWy4uLmN1cnJlbnQsIGVudGl0eV0pO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSByZW1vdmVTZWxlY3RlZChlbnRpdHk6IEFjRW50aXR5LCBhZGRTZWxlY3RlZEluZGljYXRvcjogYm9vbGVhbikge1xyXG4gICAgaWYgKGFkZFNlbGVjdGVkSW5kaWNhdG9yKSB7XHJcbiAgICAgIGVudGl0eVsnc2VsZWN0ZWQnXSA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGN1cnJlbnQgPSB0aGlzLnNlbGVjdGVkRW50aXRpZXMoKTtcclxuICAgIGNvbnN0IGVudGl0eUluZGV4ID0gY3VycmVudC5pbmRleE9mKGVudGl0eSk7XHJcbiAgICBpZiAoZW50aXR5SW5kZXggIT09IC0xKSB7XHJcbiAgICAgIGN1cnJlbnQuc3BsaWNlKGVudGl0eUluZGV4LCAxKTtcclxuICAgICAgdGhpcy5zZWxlY3RlZEVudGl0aWVzSXRlbXMkLm5leHQoY3VycmVudCk7XHJcbiAgICAgIHRoaXMuc2VsZWN0ZWRFbnRpdHlTdWJqZWN0JC5uZXh0KGVudGl0eSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBpbml0U2VsZWN0aW9uKHNlbGVjdGlvbk9wdGlvbnM/OiBTZWxlY3Rpb25PcHRpb25zLCBhZGRTZWxlY3RlZEluZGljYXRvciA9IHRydWUsIGV2ZW50UHJpb3JpdHk/OiBudW1iZXIsIG1hcElkPzogc3RyaW5nKSB7XHJcbiAgICBjb25zdCBtYXBDb21wb25lbnQgPSB0aGlzLm1hcHNNYW5hZ2VyLmdldE1hcChtYXBJZCk7XHJcbiAgICBpZiAoIW1hcENvbXBvbmVudCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5tYXBFdmVudHNNYW5hZ2VyU2VydmljZSA9IG1hcENvbXBvbmVudC5nZXRNYXBFdmVudHNNYW5hZ2VyKCk7XHJcblxyXG4gICAgaWYgKCFzZWxlY3Rpb25PcHRpb25zKSB7XHJcbiAgICAgIE9iamVjdC5hc3NpZ24oc2VsZWN0aW9uT3B0aW9ucywge2V2ZW50OiBDZXNpdW1FdmVudC5MRUZUX0NMSUNLfSk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgZXZlbnRTdWJzY3JpcHRpb24gPSB0aGlzLm1hcEV2ZW50c01hbmFnZXJTZXJ2aWNlLnJlZ2lzdGVyKHtcclxuICAgICAgZXZlbnQ6IHNlbGVjdGlvbk9wdGlvbnMuZXZlbnQsXHJcbiAgICAgIHBpY2s6IFBpY2tPcHRpb25zLlBJQ0tfT05FLFxyXG4gICAgICBtb2RpZmllcjogc2VsZWN0aW9uT3B0aW9ucy5tb2RpZmllcixcclxuICAgICAgZW50aXR5VHlwZTogc2VsZWN0aW9uT3B0aW9ucy5lbnRpdHlUeXBlLFxyXG4gICAgICBwcmlvcml0eTogZXZlbnRQcmlvcml0eSxcclxuICAgIH0pO1xyXG5cclxuICAgIGV2ZW50U3Vic2NyaXB0aW9uLnBpcGUoXHJcbiAgICAgIG1hcChyZXN1bHQgPT4gcmVzdWx0LmVudGl0aWVzKSxcclxuICAgICAgZmlsdGVyKGVudGl0aWVzID0+IGVudGl0aWVzICYmIGVudGl0aWVzLmxlbmd0aCA+IDApKVxyXG4gICAgICAuc3Vic2NyaWJlKGVudGl0aWVzID0+IHtcclxuICAgICAgICBjb25zdCBlbnRpdHkgPSBlbnRpdGllc1swXTtcclxuICAgICAgICB0aGlzLnRvZ2dsZVNlbGVjdGlvbihlbnRpdHksIGFkZFNlbGVjdGVkSW5kaWNhdG9yKTtcclxuICAgICAgfSk7XHJcbiAgfVxyXG59XHJcbiJdfQ==