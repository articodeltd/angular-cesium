import { fromEvent as observableFromEvent, Subject } from 'rxjs';
import { map, merge, takeUntil, tap } from 'rxjs/operators';
import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import * as i0 from "@angular/core";
import * as i1 from "../../angular-cesium/services/maps-manager/maps-manager.service";
/**
 * The Service is used to preform, handle and subscribe to icon dragging when using the `DraggableToMapDirective`.
 * For more info check `DraggableToMapDirective` docs.
 */
export class DraggableToMapService {
    constructor(document, mapsManager) {
        this.document = document;
        this.mapsManager = mapsManager;
        this.mainSubject = new Subject();
    }
    setCoordinateConverter(coordinateConverter) {
        this.coordinateConverter = coordinateConverter;
    }
    drag(imageSrc, style) {
        if (!this.coordinateConverter) {
            const mapComponent = this.mapsManager.getMap();
            if (mapComponent) {
                this.coordinateConverter = mapComponent.getCoordinateConverter();
            }
        }
        this.cancel();
        const imgElement = document.createElement('img');
        imgElement.src = imageSrc;
        imgElement.style.position = 'fixed';
        imgElement.style.visibility = 'hidden';
        imgElement.style.width = '30px';
        imgElement.style.height = '30px';
        imgElement.style['user-drag'] = 'none';
        imgElement.style['user-select'] = 'none';
        imgElement.style['-moz-user-select'] = 'none';
        imgElement.style['-webkit-user-drag'] = 'none';
        imgElement.style['-webkit-user-select'] = 'none';
        imgElement.style['-ms-user-select'] = 'none';
        Object.assign(imgElement.style, style);
        document.body.appendChild(imgElement);
        this.createDragObservable();
        this.dragObservable.subscribe((e) => {
            imgElement.style.visibility = 'visible';
            imgElement.style.left = e.screenPosition.x - imgElement.clientWidth / 2 + 'px';
            imgElement.style.top = e.screenPosition.y - imgElement.clientHeight / 2 + 'px';
            this.mainSubject.next(e);
            if (e.drop) {
                imgElement.remove();
            }
        }, (e) => {
            imgElement.remove();
        }, () => {
            imgElement.remove();
        });
    }
    dragUpdates() {
        return this.mainSubject;
    }
    cancel() {
        if (this.stopper) {
            this.stopper.next(true);
            this.stopper = undefined;
            this.dragObservable = undefined;
        }
    }
    createDragObservable() {
        const stopper = new Subject();
        const dropSubject = new Subject();
        const pointerUp = observableFromEvent(document, 'pointerup');
        const pointerMove = observableFromEvent(document, 'pointermove');
        let dragStartPositionX;
        let dragStartPositionY;
        let lastMove;
        const moveObservable = pointerMove.pipe(map((e) => {
            dragStartPositionX = dragStartPositionX ? dragStartPositionX : e.x;
            dragStartPositionY = dragStartPositionY ? dragStartPositionY : e.y;
            lastMove = {
                drop: false,
                initialScreenPosition: {
                    x: dragStartPositionX,
                    y: dragStartPositionY,
                },
                screenPosition: {
                    x: e.x,
                    y: e.y,
                },
                mapPosition: this.coordinateConverter ?
                    this.coordinateConverter.screenToCartesian3({ x: e.x, y: e.y }) : undefined,
            };
            return lastMove;
        }), takeUntil(pointerUp), tap(undefined, undefined, () => {
            if (lastMove) {
                const dropEvent = Object.assign({}, lastMove);
                dropEvent.drop = true;
                dropSubject.next(dropEvent);
            }
        }));
        this.dragObservable = moveObservable.pipe(merge(dropSubject), takeUntil(stopper));
        this.stopper = stopper;
    }
}
DraggableToMapService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: DraggableToMapService, deps: [{ token: DOCUMENT }, { token: i1.MapsManagerService }], target: i0.ɵɵFactoryTarget.Injectable });
DraggableToMapService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: DraggableToMapService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: DraggableToMapService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: i1.MapsManagerService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJhZ2dhYmxlLXRvLW1hcC5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2xpYi9hbmd1bGFyLWNlc2l1bS13aWRnZXRzL3NlcnZpY2VzL2RyYWdnYWJsZS10by1tYXAuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxJQUFJLG1CQUFtQixFQUFjLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUU3RSxPQUFPLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsR0FBRyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDNUQsT0FBTyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDbkQsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGlCQUFpQixDQUFDOzs7QUFhM0M7OztHQUdHO0FBR0gsTUFBTSxPQUFPLHFCQUFxQjtJQU9oQyxZQUFzQyxRQUFhLEVBQVUsV0FBK0I7UUFBdEQsYUFBUSxHQUFSLFFBQVEsQ0FBSztRQUFVLGdCQUFXLEdBQVgsV0FBVyxDQUFvQjtRQUZwRixnQkFBVyxHQUFHLElBQUksT0FBTyxFQUFpQixDQUFDO0lBR25ELENBQUM7SUFFRCxzQkFBc0IsQ0FBQyxtQkFBd0M7UUFDN0QsSUFBSSxDQUFDLG1CQUFtQixHQUFHLG1CQUFtQixDQUFDO0lBQ2pELENBQUM7SUFFRCxJQUFJLENBQUMsUUFBZ0IsRUFBRSxLQUFXO1FBQ2hDLElBQUksQ0FBQyxJQUFJLENBQUMsbUJBQW1CLEVBQUU7WUFDN0IsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUMvQyxJQUFJLFlBQVksRUFBRTtnQkFDaEIsSUFBSSxDQUFDLG1CQUFtQixHQUFHLFlBQVksQ0FBQyxzQkFBc0IsRUFBRSxDQUFDO2FBQ2xFO1NBQ0Y7UUFDRCxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7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QVMsQ0FBQyxDQUFDO2FBQzdCO1FBQ0gsQ0FBQyxDQUFDLENBQUcsQ0FBQztRQUVSLElBQUksQ0FBQyxjQUFjLEdBQUcsY0FBYyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLEVBQUUsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFHLENBQUM7UUFDcEYsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7SUFDekIsQ0FBQzs7a0hBM0dVLHFCQUFxQixrQkFPWixRQUFRO3NIQVBqQixxQkFBcUI7MkZBQXJCLHFCQUFxQjtrQkFEakMsVUFBVTs7MEJBUUksTUFBTTsyQkFBQyxRQUFRIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZnJvbUV2ZW50IGFzIG9ic2VydmFibGVGcm9tRXZlbnQsIE9ic2VydmFibGUsIFN1YmplY3QgfSBmcm9tICdyeGpzJztcclxuXHJcbmltcG9ydCB7IG1hcCwgbWVyZ2UsIHRha2VVbnRpbCwgdGFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xyXG5pbXBvcnQgeyBJbmplY3QsIEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgRE9DVU1FTlQgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xyXG5pbXBvcnQgeyBDYXJ0ZXNpYW4zIH0gZnJvbSAnY2VzaXVtJztcclxuaW1wb3J0IHsgVmVjMiB9IGZyb20gJy4uLy4uL2FuZ3VsYXItY2VzaXVtL21vZGVscy92ZWMyJztcclxuaW1wb3J0IHsgQ29vcmRpbmF0ZUNvbnZlcnRlciB9IGZyb20gJy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2Nvb3JkaW5hdGUtY29udmVydGVyL2Nvb3JkaW5hdGUtY29udmVydGVyLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBNYXBzTWFuYWdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9tYXBzLW1hbmFnZXIvbWFwcy1tYW5hZ2VyLnNlcnZpY2UnO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJY29uRHJhZ0V2ZW50IHtcclxuICBpbml0aWFsU2NyZWVuUG9zaXRpb246IFZlYzI7XHJcbiAgc2NyZWVuUG9zaXRpb246IFZlYzI7XHJcbiAgbWFwUG9zaXRpb246IENhcnRlc2lhbjM7XHJcbiAgZHJvcDogYm9vbGVhbjtcclxufVxyXG5cclxuLyoqXHJcbiAqIFRoZSBTZXJ2aWNlIGlzIHVzZWQgdG8gcHJlZm9ybSwgaGFuZGxlIGFuZCBzdWJzY3JpYmUgdG8gaWNvbiBkcmFnZ2luZyB3aGVuIHVzaW5nIHRoZSBgRHJhZ2dhYmxlVG9NYXBEaXJlY3RpdmVgLlxyXG4gKiBGb3IgbW9yZSBpbmZvIGNoZWNrIGBEcmFnZ2FibGVUb01hcERpcmVjdGl2ZWAgZG9jcy5cclxuICovXHJcblxyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBEcmFnZ2FibGVUb01hcFNlcnZpY2Uge1xyXG5cclxuICBwcml2YXRlIGNvb3JkaW5hdGVDb252ZXJ0ZXI6IENvb3JkaW5hdGVDb252ZXJ0ZXI7XHJcbiAgcHJpdmF0ZSBkcmFnT2JzZXJ2YWJsZTogT2JzZXJ2YWJsZTxJY29uRHJhZ0V2ZW50PjtcclxuICBwcml2YXRlIHN0b3BwZXI6IFN1YmplY3Q8YW55PjtcclxuICBwcml2YXRlIG1haW5TdWJqZWN0ID0gbmV3IFN1YmplY3Q8SWNvbkRyYWdFdmVudD4oKTtcclxuXHJcbiAgY29uc3RydWN0b3IoQEluamVjdChET0NVTUVOVCkgcHJpdmF0ZSBkb2N1bWVudDogYW55LCBwcml2YXRlIG1hcHNNYW5hZ2VyOiBNYXBzTWFuYWdlclNlcnZpY2UpIHtcclxuICB9XHJcblxyXG4gIHNldENvb3JkaW5hdGVDb252ZXJ0ZXIoY29vcmRpbmF0ZUNvbnZlcnRlcjogQ29vcmRpbmF0ZUNvbnZlcnRlcikge1xyXG4gICAgdGhpcy5jb29yZGluYXRlQ29udmVydGVyID0gY29vcmRpbmF0ZUNvbnZlcnRlcjtcclxuICB9XHJcblxyXG4gIGRyYWcoaW1hZ2VTcmM6IHN0cmluZywgc3R5bGU/OiBhbnkpIHtcclxuICAgIGlmICghdGhpcy5jb29yZGluYXRlQ29udmVydGVyKSB7XHJcbiAgICAgIGNvbnN0IG1hcENvbXBvbmVudCA9IHRoaXMubWFwc01hbmFnZXIuZ2V0TWFwKCk7XHJcbiAgICAgIGlmIChtYXBDb21wb25lbnQpIHtcclxuICAgICAgICB0aGlzLmNvb3JkaW5hdGVDb252ZXJ0ZXIgPSBtYXBDb21wb25lbnQuZ2V0Q29vcmRpbmF0ZUNvbnZlcnRlcigpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICB0aGlzLmNhbmNlbCgpO1xyXG4gICAgY29uc3QgaW1nRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xyXG4gICAgaW1nRWxlbWVudC5zcmMgPSBpbWFnZVNyYztcclxuICAgIGltZ0VsZW1lbnQuc3R5bGUucG9zaXRpb24gPSAnZml4ZWQnO1xyXG4gICAgaW1nRWxlbWVudC5zdHlsZS52aXNpYmlsaXR5ID0gJ2hpZGRlbic7XHJcbiAgICBpbWdFbGVtZW50LnN0eWxlLndpZHRoID0gJzMwcHgnO1xyXG4gICAgaW1nRWxlbWVudC5zdHlsZS5oZWlnaHQgPSAnMzBweCc7XHJcbiAgICBpbWdFbGVtZW50LnN0eWxlWyd1c2VyLWRyYWcnXSA9ICdub25lJztcclxuICAgIGltZ0VsZW1lbnQuc3R5bGVbJ3VzZXItc2VsZWN0J10gPSAnbm9uZSc7XHJcbiAgICBpbWdFbGVtZW50LnN0eWxlWyctbW96LXVzZXItc2VsZWN0J10gPSAnbm9uZSc7XHJcbiAgICBpbWdFbGVtZW50LnN0eWxlWyctd2Via2l0LXVzZXItZHJhZyddID0gJ25vbmUnO1xyXG4gICAgaW1nRWxlbWVudC5zdHlsZVsnLXdlYmtpdC11c2VyLXNlbGVjdCddID0gJ25vbmUnO1xyXG4gICAgaW1nRWxlbWVudC5zdHlsZVsnLW1zLXVzZXItc2VsZWN0J10gPSAnbm9uZSc7XHJcbiAgICBPYmplY3QuYXNzaWduKGltZ0VsZW1lbnQuc3R5bGUsIHN0eWxlKTtcclxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaW1nRWxlbWVudCk7XHJcblxyXG4gICAgdGhpcy5jcmVhdGVEcmFnT2JzZXJ2YWJsZSgpO1xyXG4gICAgdGhpcy5kcmFnT2JzZXJ2YWJsZS5zdWJzY3JpYmUoXHJcbiAgICAgIChlKSA9PiB7XHJcbiAgICAgICAgaW1nRWxlbWVudC5zdHlsZS52aXNpYmlsaXR5ID0gJ3Zpc2libGUnO1xyXG4gICAgICAgIGltZ0VsZW1lbnQuc3R5bGUubGVmdCA9IGUuc2NyZWVuUG9zaXRpb24ueCAtIGltZ0VsZW1lbnQuY2xpZW50V2lkdGggLyAyICsgJ3B4JztcclxuICAgICAgICBpbWdFbGVtZW50LnN0eWxlLnRvcCA9IGUuc2NyZWVuUG9zaXRpb24ueSAtIGltZ0VsZW1lbnQuY2xpZW50SGVpZ2h0IC8gMiArICdweCc7XHJcbiAgICAgICAgdGhpcy5tYWluU3ViamVjdC5uZXh0KGUpO1xyXG4gICAgICAgIGlmIChlLmRyb3ApIHtcclxuICAgICAgICAgIGltZ0VsZW1lbnQucmVtb3ZlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICAoZTogYW55KSA9PiB7XHJcbiAgICAgICAgaW1nRWxlbWVudC5yZW1vdmUoKTtcclxuICAgICAgfSxcclxuICAgICAgKCkgPT4ge1xyXG4gICAgICAgIGltZ0VsZW1lbnQucmVtb3ZlKCk7XHJcbiAgICAgIH1cclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBkcmFnVXBkYXRlcygpOiBPYnNlcnZhYmxlPEljb25EcmFnRXZlbnQ+IHtcclxuICAgIHJldHVybiB0aGlzLm1haW5TdWJqZWN0O1xyXG4gIH1cclxuXHJcbiAgY2FuY2VsKCkge1xyXG4gICAgaWYgKHRoaXMuc3RvcHBlcikge1xyXG4gICAgICB0aGlzLnN0b3BwZXIubmV4dCh0cnVlKTtcclxuICAgICAgdGhpcy5zdG9wcGVyID0gdW5kZWZpbmVkO1xyXG4gICAgICB0aGlzLmRyYWdPYnNlcnZhYmxlID0gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBjcmVhdGVEcmFnT2JzZXJ2YWJsZSgpIHtcclxuICAgIGNvbnN0IHN0b3BwZXIgPSBuZXcgU3ViamVjdCgpO1xyXG4gICAgY29uc3QgZHJvcFN1YmplY3QgPSBuZXcgU3ViamVjdDxhbnk+KCk7XHJcbiAgICBjb25zdCBwb2ludGVyVXAgPSBvYnNlcnZhYmxlRnJvbUV2ZW50KGRvY3VtZW50LCAncG9pbnRlcnVwJyk7XHJcbiAgICBjb25zdCBwb2ludGVyTW92ZSA9IG9ic2VydmFibGVGcm9tRXZlbnQoZG9jdW1lbnQsICdwb2ludGVybW92ZScpO1xyXG5cclxuICAgIGxldCBkcmFnU3RhcnRQb3NpdGlvblg6IG51bWJlcjtcclxuICAgIGxldCBkcmFnU3RhcnRQb3NpdGlvblk6IG51bWJlcjtcclxuICAgIGxldCBsYXN0TW92ZTogYW55O1xyXG4gICAgY29uc3QgbW92ZU9ic2VydmFibGUgPSBwb2ludGVyTW92ZS5waXBlKG1hcCgoZTogYW55KSA9PiB7XHJcbiAgICAgICAgZHJhZ1N0YXJ0UG9zaXRpb25YID0gZHJhZ1N0YXJ0UG9zaXRpb25YID8gZHJhZ1N0YXJ0UG9zaXRpb25YIDogZS54O1xyXG4gICAgICAgIGRyYWdTdGFydFBvc2l0aW9uWSA9IGRyYWdTdGFydFBvc2l0aW9uWSA/IGRyYWdTdGFydFBvc2l0aW9uWSA6IGUueTtcclxuICAgICAgICBsYXN0TW92ZSA9IHtcclxuICAgICAgICAgIGRyb3A6IGZhbHNlLFxyXG4gICAgICAgICAgaW5pdGlhbFNjcmVlblBvc2l0aW9uOiB7XHJcbiAgICAgICAgICAgIHg6IGRyYWdTdGFydFBvc2l0aW9uWCxcclxuICAgICAgICAgICAgeTogZHJhZ1N0YXJ0UG9zaXRpb25ZLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHNjcmVlblBvc2l0aW9uOiB7XHJcbiAgICAgICAgICAgIHg6IGUueCxcclxuICAgICAgICAgICAgeTogZS55LFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIG1hcFBvc2l0aW9uOiB0aGlzLmNvb3JkaW5hdGVDb252ZXJ0ZXIgP1xyXG4gICAgICAgICAgICB0aGlzLmNvb3JkaW5hdGVDb252ZXJ0ZXIuc2NyZWVuVG9DYXJ0ZXNpYW4zKHt4OiBlLngsIHk6IGUueX0pIDogdW5kZWZpbmVkLFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIGxhc3RNb3ZlO1xyXG4gICAgICB9KSxcclxuICAgICAgdGFrZVVudGlsKHBvaW50ZXJVcCksXHJcbiAgICAgIHRhcCh1bmRlZmluZWQsIHVuZGVmaW5lZCwgKCkgPT4ge1xyXG4gICAgICAgIGlmIChsYXN0TW92ZSkge1xyXG4gICAgICAgICAgY29uc3QgZHJvcEV2ZW50ID0gT2JqZWN0LmFzc2lnbih7fSwgbGFzdE1vdmUpO1xyXG4gICAgICAgICAgZHJvcEV2ZW50LmRyb3AgPSB0cnVlO1xyXG4gICAgICAgICAgZHJvcFN1YmplY3QubmV4dChkcm9wRXZlbnQpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSksICk7XHJcblxyXG4gICAgdGhpcy5kcmFnT2JzZXJ2YWJsZSA9IG1vdmVPYnNlcnZhYmxlLnBpcGUobWVyZ2UoZHJvcFN1YmplY3QpLCB0YWtlVW50aWwoc3RvcHBlciksICk7XHJcbiAgICB0aGlzLnN0b3BwZXIgPSBzdG9wcGVyO1xyXG4gIH1cclxufVxyXG4iXX0=