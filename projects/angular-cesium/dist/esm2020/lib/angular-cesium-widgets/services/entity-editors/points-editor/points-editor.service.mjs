import { publish, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Color } from 'cesium';
import { BehaviorSubject, Subject } from 'rxjs';
import { CesiumEvent } from '../../../../angular-cesium/services/map-events-mananger/consts/cesium-event.enum';
import { PickOptions } from '../../../../angular-cesium/services/map-events-mananger/consts/pickOptions.enum';
import { EditModes } from '../../../models/edit-mode.enum';
import { EditActions } from '../../../models/edit-actions.enum';
import { EditPoint } from '../../../models/edit-point';
import { generateKey } from '../../utils';
import * as i0 from "@angular/core";
export const DEFAULT_POINT_OPTIONS = {
    addLastPointEvent: CesiumEvent.LEFT_CLICK,
    removePointEvent: CesiumEvent.RIGHT_CLICK,
    dragPointEvent: CesiumEvent.LEFT_CLICK_DRAG,
    allowDrag: true,
    pointProps: {
        color: Color.WHITE.withAlpha(0.95),
        outlineColor: Color.BLACK.withAlpha(0.5),
        outlineWidth: 1,
        pixelSize: 10,
        show: true,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
    },
};
/**
 * Service for creating editable point
 *
 *  * You must provide `PointsEditorService` yourself.
 * PolygonsEditorService works together with `<points-editor>` component. Therefor you need to create `<points-editor>`
 * for each `PointsEditorService`, And of course somewhere under `<ac-map>`/
 *
 * + `create` for starting a creation of the shape over the map. Returns a extension of `PointEditorObservable`.
 * + `edit` for editing shape over the map starting from a given positions. Returns an extension of `PointEditorObservable`.
 * + To stop editing call `dsipose()` from the `PointEditorObservable` you get back from `create()` \ `edit()`.
 *
 * **Labels over editted shapes**
 * Angular Cesium allows you to draw labels over a shape that is being edited with one of the editors.
 * To add label drawing logic to your editor use the function `setLabelsRenderFn()` that is defined on the
 * `PointEditorObservable` that is returned from calling `create()` \ `edit()` of one of the editor services.
 * `setLabelsRenderFn()` - receives a callback that is called every time the shape is redrawn
 * (except when the shape is being dragged). The callback is called with the last shape state and with an array of the current labels.
 * The callback should return type `LabelProps[]`.
 * You can also use `updateLabels()` to pass an array of labels of type `LabelProps[]` to be drawn.
 *
 * usage:
 * ```typescript
 *  // Start creating point
 *  const editing$ = pointEditorService.create();
 *  this.editing$.subscribe(editResult => {
 *				console.log(editResult.positions);
 *		});
 *
 *  // Or edit point from existing point cartesian3 positions
 *  const editing$ = this.pointEditor.edit(initialPos);
 *
 * ```
 */
export class PointsEditorService {
    constructor() {
        this.updateSubject = new Subject();
        this.updatePublisher = publish()(this.updateSubject); // TODO maybe not needed
        this.observablesMap = new Map();
    }
    init(mapEventsManager, coordinateConverter, cameraService, pointManager, cesiumViewer) {
        this.mapEventsManager = mapEventsManager;
        this.coordinateConverter = coordinateConverter;
        this.cameraService = cameraService;
        this.pointManager = pointManager;
        this.updatePublisher.connect();
        this.cesiumScene = cesiumViewer.getScene();
    }
    onUpdate() {
        return this.updatePublisher;
    }
    screenToPosition(cartesian2) {
        const cartesian3 = this.coordinateConverter.screenToCartesian3(cartesian2);
        // If cartesian3 is undefined then the point inst on the globe
        if (cartesian3) {
            const ray = this.cameraService.getCamera().getPickRay(cartesian2);
            return this.cesiumScene.globe.pick(ray, this.cesiumScene);
        }
        return cartesian3;
    }
    create(options = DEFAULT_POINT_OPTIONS, eventPriority = 100) {
        const id = generateKey();
        const pointOptions = this.setOptions(options);
        const clientEditSubject = new BehaviorSubject({
            id,
            editAction: null,
            editMode: EditModes.CREATE
        });
        let finishedCreate = false;
        this.updateSubject.next({
            id,
            editMode: EditModes.CREATE,
            editAction: EditActions.INIT,
            pointOptions: pointOptions,
        });
        const finishCreation = (position) => {
            return this.switchToEditMode(id, clientEditSubject, position, eventPriority, pointOptions, editorObservable, true);
        };
        const mouseMoveRegistration = this.mapEventsManager.register({
            event: CesiumEvent.MOUSE_MOVE,
            pick: PickOptions.NO_PICK,
            priority: eventPriority,
            pickConfig: options.pickConfiguration,
        });
        const addLastPointRegistration = this.mapEventsManager.register({
            event: pointOptions.addLastPointEvent,
            modifier: pointOptions.addLastPointModifier,
            pick: PickOptions.NO_PICK,
            priority: eventPriority,
            pickConfig: options.pickConfiguration,
        });
        this.observablesMap.set(id, [mouseMoveRegistration, addLastPointRegistration]);
        const editorObservable = this.createEditorObservable(clientEditSubject, id, finishCreation);
        mouseMoveRegistration.subscribe(({ movement: { endPosition } }) => {
            const position = this.screenToPosition(endPosition);
            if (position) {
                this.updateSubject.next({
                    id,
                    position,
                    editMode: EditModes.CREATE,
                    updatedPosition: position,
                    editAction: EditActions.MOUSE_MOVE,
                });
            }
        });
        addLastPointRegistration.subscribe(({ movement: { endPosition } }) => {
            const position = this.screenToPosition(endPosition);
            finishedCreate = finishCreation(position);
        });
        return editorObservable;
    }
    switchToEditMode(id, clientEditSubject, position, eventPriority, pointOptions, editorObservable, finishedCreate) {
        const update = {
            id,
            position: position,
            editMode: EditModes.CREATE_OR_EDIT,
            updatedPosition: position,
            editAction: EditActions.ADD_LAST_POINT,
        };
        this.updateSubject.next(update);
        clientEditSubject.next({
            ...update,
            position: position,
            point: this.getPoint(id),
        });
        const changeMode = {
            id,
            editMode: EditModes.CREATE,
            editAction: EditActions.CHANGE_TO_EDIT,
        };
        this.updateSubject.next(changeMode);
        clientEditSubject.next(changeMode);
        if (this.observablesMap.has(id)) {
            this.observablesMap.get(id).forEach(registration => registration.dispose());
        }
        this.observablesMap.delete(id);
        this.editPoint(id, position, eventPriority, clientEditSubject, pointOptions, editorObservable);
        finishedCreate = true;
        return finishedCreate;
    }
    edit(position, options = DEFAULT_POINT_OPTIONS, priority = 100) {
        const id = generateKey();
        const pointOptions = this.setOptions(options);
        const editSubject = new BehaviorSubject({
            id,
            editAction: null,
            editMode: EditModes.EDIT
        });
        const update = {
            id,
            position: position,
            editMode: EditModes.EDIT,
            editAction: EditActions.INIT,
            pointOptions: pointOptions,
        };
        this.updateSubject.next(update);
        editSubject.next({
            ...update,
            position: position,
            point: this.getPoint(id),
        });
        return this.editPoint(id, position, priority, editSubject, pointOptions);
    }
    editPoint(id, position, priority, editSubject, options, editObservable) {
        const pointDragRegistration = this.mapEventsManager.register({
            event: options.dragPointEvent,
            entityType: EditPoint,
            pick: PickOptions.PICK_FIRST,
            pickConfig: options.pickConfiguration,
            priority,
            pickFilter: entity => id === entity.editedEntityId,
        });
        const pointRemoveRegistration = this.mapEventsManager.register({
            event: options.removePointEvent,
            modifier: options.removePointModifier,
            entityType: EditPoint,
            pick: PickOptions.PICK_FIRST,
            pickConfig: options.pickConfiguration,
            priority,
            pickFilter: entity => id === entity.editedEntityId,
        });
        pointDragRegistration.pipe(tap(({ movement: { drop } }) => this.cameraService.enableInputs(drop)))
            .subscribe(({ movement: { endPosition, drop }, entities }) => {
            const updatedPosition = this.screenToPosition(endPosition);
            if (!updatedPosition) {
                return;
            }
            const update = {
                id,
                editMode: EditModes.EDIT,
                updatedPosition,
                editAction: drop ? EditActions.DRAG_POINT_FINISH : EditActions.DRAG_POINT,
            };
            this.updateSubject.next(update);
            editSubject.next({
                ...update,
                position: updatedPosition,
                point: this.getPoint(id),
            });
        });
        const observables = [pointDragRegistration, pointRemoveRegistration];
        this.observablesMap.set(id, observables);
        return this.createEditorObservable(editSubject, id);
    }
    setOptions(options) {
        const defaultClone = JSON.parse(JSON.stringify(DEFAULT_POINT_OPTIONS));
        const pointOptions = Object.assign(defaultClone, options);
        pointOptions.pointProps = { ...DEFAULT_POINT_OPTIONS.pointProps, ...options.pointProps };
        pointOptions.pointProps = { ...DEFAULT_POINT_OPTIONS.pointProps, ...options.pointProps };
        return pointOptions;
    }
    createEditorObservable(observableToExtend, id, finishCreation) {
        observableToExtend.dispose = () => {
            const observables = this.observablesMap.get(id);
            if (observables) {
                observables.forEach(obs => obs.dispose());
            }
            this.observablesMap.delete(id);
            this.updateSubject.next({
                id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.DISPOSE,
            });
        };
        observableToExtend.enable = () => {
            this.updateSubject.next({
                id,
                position: this.getPosition(id),
                editMode: EditModes.EDIT,
                editAction: EditActions.ENABLE,
            });
        };
        observableToExtend.disable = () => {
            this.updateSubject.next({
                id,
                position: this.getPosition(id),
                editMode: EditModes.EDIT,
                editAction: EditActions.DISABLE,
            });
        };
        observableToExtend.setManually = (point, pointProps) => {
            const newPoint = this.pointManager.get(id);
            newPoint.setManually(point, pointProps);
            this.updateSubject.next({
                id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.SET_MANUALLY,
            });
        };
        observableToExtend.setLabelsRenderFn = (callback) => {
            this.updateSubject.next({
                id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.SET_EDIT_LABELS_RENDER_CALLBACK,
                labelsRenderFn: callback,
            });
        };
        observableToExtend.updateLabels = (labels) => {
            this.updateSubject.next({
                id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.UPDATE_EDIT_LABELS,
                updateLabels: labels,
            });
        };
        observableToExtend.finishCreation = () => {
            if (!finishCreation) {
                throw new Error('Points editor error edit(): cannot call finishCreation() on edit');
            }
            return finishCreation(null);
        };
        observableToExtend.getCurrentPoint = () => this.getPoint(id);
        observableToExtend.getEditValue = () => observableToExtend.getValue();
        observableToExtend.getLabels = () => this.pointManager.get(id).labels;
        return observableToExtend;
    }
    getPosition(id) {
        const point = this.pointManager.get(id);
        return point.getPosition();
    }
    getPoint(id) {
        const point = this.pointManager.get(id);
        if (point) {
            return point.getCurrentPoint();
        }
    }
}
PointsEditorService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: PointsEditorService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
PointsEditorService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: PointsEditorService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: PointsEditorService, decorators: [{
            type: Injectable
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9pbnRzLWVkaXRvci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2xpYi9hbmd1bGFyLWNlc2l1bS13aWRnZXRzL3NlcnZpY2VzL2VudGl0eS1lZGl0b3JzL3BvaW50cy1lZGl0b3IvcG9pbnRzLWVkaXRvci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDOUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUUsS0FBSyxFQUFjLE1BQU0sUUFBUSxDQUFDO0FBRTNDLE9BQU8sRUFBRSxlQUFlLEVBQWMsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQzVELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxrRkFBa0YsQ0FBQztBQUMvRyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0saUZBQWlGLENBQUM7QUFDOUcsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBQzNELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxtQ0FBbUMsQ0FBQztBQUdoRSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFJdkQsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGFBQWEsQ0FBQzs7QUFNMUMsTUFBTSxDQUFDLE1BQU0scUJBQXFCLEdBQXFCO0lBQ3JELGlCQUFpQixFQUFFLFdBQVcsQ0FBQyxVQUFVO0lBQ3pDLGdCQUFnQixFQUFFLFdBQVcsQ0FBQyxXQUFXO0lBQ3pDLGNBQWMsRUFBRSxXQUFXLENBQUMsZUFBZTtJQUMzQyxTQUFTLEVBQUUsSUFBSTtJQUNmLFVBQVUsRUFBRTtRQUNWLEtBQUssRUFBRSxLQUFLLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUM7UUFDbEMsWUFBWSxFQUFFLEtBQUss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QUFJLEtBQUssQ0FBQyxrRUFBa0UsQ0FBQyxDQUFDO2FBQ3JGO1lBRUQsT0FBTyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDOUIsQ0FBQyxDQUFDO1FBRUYsa0JBQWtCLENBQUMsZUFBZSxHQUFHLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7UUFFN0Qsa0JBQWtCLENBQUMsWUFBWSxHQUFHLEdBQUcsRUFBRSxDQUFDLGtCQUFrQixDQUFDLFFBQVEsRUFBRSxDQUFDO1FBRXRFLGtCQUFrQixDQUFDLFNBQVMsR0FBRyxHQUFpQixFQUFFLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDO1FBRXBGLE9BQU8sa0JBQTJDLENBQUM7SUFDckQsQ0FBQztJQUVPLFdBQVcsQ0FBQyxFQUFVO1FBQzVCLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3hDLE9BQU8sS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQzdCLENBQUM7SUFFTyxRQUFRLENBQUMsRUFBVTtRQUN6QixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN4QyxJQUFJLEtBQUssRUFBRTtZQUNULE9BQU8sS0FBSyxDQUFDLGVBQWUsRUFBRSxDQUFDO1NBQ2hDO0lBQ0gsQ0FBQzs7Z0hBclVVLG1CQUFtQjtvSEFBbkIsbUJBQW1COzJGQUFuQixtQkFBbUI7a0JBRC9CLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBwdWJsaXNoLCB0YXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XHJcbmltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgQ29sb3IsIENhcnRlc2lhbjMgfSBmcm9tICdjZXNpdW0nO1xyXG5pbXBvcnQgeyBNYXBFdmVudHNNYW5hZ2VyU2VydmljZSB9IGZyb20gJy4uLy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL21hcC1ldmVudHMtbWFuYW5nZXIvbWFwLWV2ZW50cy1tYW5hZ2VyJztcclxuaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0LCBPYnNlcnZhYmxlLCBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IENlc2l1bUV2ZW50IH0gZnJvbSAnLi4vLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvbWFwLWV2ZW50cy1tYW5hbmdlci9jb25zdHMvY2VzaXVtLWV2ZW50LmVudW0nO1xyXG5pbXBvcnQgeyBQaWNrT3B0aW9ucyB9IGZyb20gJy4uLy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL21hcC1ldmVudHMtbWFuYW5nZXIvY29uc3RzL3BpY2tPcHRpb25zLmVudW0nO1xyXG5pbXBvcnQgeyBFZGl0TW9kZXMgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvZWRpdC1tb2RlLmVudW0nO1xyXG5pbXBvcnQgeyBFZGl0QWN0aW9ucyB9IGZyb20gJy4uLy4uLy4uL21vZGVscy9lZGl0LWFjdGlvbnMuZW51bSc7XHJcbmltcG9ydCB7IERpc3Bvc2FibGVPYnNlcnZhYmxlIH0gZnJvbSAnLi4vLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvbWFwLWV2ZW50cy1tYW5hbmdlci9kaXNwb3NhYmxlLW9ic2VydmFibGUnO1xyXG5pbXBvcnQgeyBDb29yZGluYXRlQ29udmVydGVyIH0gZnJvbSAnLi4vLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvY29vcmRpbmF0ZS1jb252ZXJ0ZXIvY29vcmRpbmF0ZS1jb252ZXJ0ZXIuc2VydmljZSc7XHJcbmltcG9ydCB7IEVkaXRQb2ludCB9IGZyb20gJy4uLy4uLy4uL21vZGVscy9lZGl0LXBvaW50JztcclxuaW1wb3J0IHsgQ2FtZXJhU2VydmljZSB9IGZyb20gJy4uLy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2NhbWVyYS9jYW1lcmEuc2VydmljZSc7XHJcbmltcG9ydCB7IFBvaW50c01hbmFnZXJTZXJ2aWNlIH0gZnJvbSAnLi9wb2ludHMtbWFuYWdlci5zZXJ2aWNlJztcclxuaW1wb3J0IHsgTGFiZWxQcm9wcyB9IGZyb20gJy4uLy4uLy4uL21vZGVscy9sYWJlbC1wcm9wcyc7XHJcbmltcG9ydCB7IGdlbmVyYXRlS2V5IH0gZnJvbSAnLi4vLi4vdXRpbHMnO1xyXG5pbXBvcnQgeyBDZXNpdW1TZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0nO1xyXG5pbXBvcnQgeyBQb2ludEVkaXRPcHRpb25zLCBQb2ludFByb3BzIH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL3BvaW50LWVkaXQtb3B0aW9ucyc7XHJcbmltcG9ydCB7IFBvaW50RWRpdFVwZGF0ZSB9IGZyb20gJy4uLy4uLy4uL21vZGVscy9wb2ludC1lZGl0LXVwZGF0ZSc7XHJcbmltcG9ydCB7IFBvaW50RWRpdG9yT2JzZXJ2YWJsZSB9IGZyb20gJy4uLy4uLy4uL21vZGVscy9wb2ludC1lZGl0b3Itb2JzZXJ2YWJsZSc7XHJcblxyXG5leHBvcnQgY29uc3QgREVGQVVMVF9QT0lOVF9PUFRJT05TOiBQb2ludEVkaXRPcHRpb25zID0ge1xyXG4gIGFkZExhc3RQb2ludEV2ZW50OiBDZXNpdW1FdmVudC5MRUZUX0NMSUNLLFxyXG4gIHJlbW92ZVBvaW50RXZlbnQ6IENlc2l1bUV2ZW50LlJJR0hUX0NMSUNLLFxyXG4gIGRyYWdQb2ludEV2ZW50OiBDZXNpdW1FdmVudC5MRUZUX0NMSUNLX0RSQUcsXHJcbiAgYWxsb3dEcmFnOiB0cnVlLFxyXG4gIHBvaW50UHJvcHM6IHtcclxuICAgIGNvbG9yOiBDb2xvci5XSElURS53aXRoQWxwaGEoMC45NSksXHJcbiAgICBvdXRsaW5lQ29sb3I6IENvbG9yLkJMQUNLLndpdGhBbHBoYSgwLjUpLFxyXG4gICAgb3V0bGluZVdpZHRoOiAxLFxyXG4gICAgcGl4ZWxTaXplOiAxMCxcclxuICAgIHNob3c6IHRydWUsXHJcbiAgICBkaXNhYmxlRGVwdGhUZXN0RGlzdGFuY2U6IE51bWJlci5QT1NJVElWRV9JTkZJTklUWSxcclxuICB9LFxyXG59O1xyXG5cclxuLyoqXHJcbiAqIFNlcnZpY2UgZm9yIGNyZWF0aW5nIGVkaXRhYmxlIHBvaW50XHJcbiAqXHJcbiAqICAqIFlvdSBtdXN0IHByb3ZpZGUgYFBvaW50c0VkaXRvclNlcnZpY2VgIHlvdXJzZWxmLlxyXG4gKiBQb2x5Z29uc0VkaXRvclNlcnZpY2Ugd29ya3MgdG9nZXRoZXIgd2l0aCBgPHBvaW50cy1lZGl0b3I+YCBjb21wb25lbnQuIFRoZXJlZm9yIHlvdSBuZWVkIHRvIGNyZWF0ZSBgPHBvaW50cy1lZGl0b3I+YFxyXG4gKiBmb3IgZWFjaCBgUG9pbnRzRWRpdG9yU2VydmljZWAsIEFuZCBvZiBjb3Vyc2Ugc29tZXdoZXJlIHVuZGVyIGA8YWMtbWFwPmAvXHJcbiAqXHJcbiAqICsgYGNyZWF0ZWAgZm9yIHN0YXJ0aW5nIGEgY3JlYXRpb24gb2YgdGhlIHNoYXBlIG92ZXIgdGhlIG1hcC4gUmV0dXJucyBhIGV4dGVuc2lvbiBvZiBgUG9pbnRFZGl0b3JPYnNlcnZhYmxlYC5cclxuICogKyBgZWRpdGAgZm9yIGVkaXRpbmcgc2hhcGUgb3ZlciB0aGUgbWFwIHN0YXJ0aW5nIGZyb20gYSBnaXZlbiBwb3NpdGlvbnMuIFJldHVybnMgYW4gZXh0ZW5zaW9uIG9mIGBQb2ludEVkaXRvck9ic2VydmFibGVgLlxyXG4gKiArIFRvIHN0b3AgZWRpdGluZyBjYWxsIGBkc2lwb3NlKClgIGZyb20gdGhlIGBQb2ludEVkaXRvck9ic2VydmFibGVgIHlvdSBnZXQgYmFjayBmcm9tIGBjcmVhdGUoKWAgXFwgYGVkaXQoKWAuXHJcbiAqXHJcbiAqICoqTGFiZWxzIG92ZXIgZWRpdHRlZCBzaGFwZXMqKlxyXG4gKiBBbmd1bGFyIENlc2l1bSBhbGxvd3MgeW91IHRvIGRyYXcgbGFiZWxzIG92ZXIgYSBzaGFwZSB0aGF0IGlzIGJlaW5nIGVkaXRlZCB3aXRoIG9uZSBvZiB0aGUgZWRpdG9ycy5cclxuICogVG8gYWRkIGxhYmVsIGRyYXdpbmcgbG9naWMgdG8geW91ciBlZGl0b3IgdXNlIHRoZSBmdW5jdGlvbiBgc2V0TGFiZWxzUmVuZGVyRm4oKWAgdGhhdCBpcyBkZWZpbmVkIG9uIHRoZVxyXG4gKiBgUG9pbnRFZGl0b3JPYnNlcnZhYmxlYCB0aGF0IGlzIHJldHVybmVkIGZyb20gY2FsbGluZyBgY3JlYXRlKClgIFxcIGBlZGl0KClgIG9mIG9uZSBvZiB0aGUgZWRpdG9yIHNlcnZpY2VzLlxyXG4gKiBgc2V0TGFiZWxzUmVuZGVyRm4oKWAgLSByZWNlaXZlcyBhIGNhbGxiYWNrIHRoYXQgaXMgY2FsbGVkIGV2ZXJ5IHRpbWUgdGhlIHNoYXBlIGlzIHJlZHJhd25cclxuICogKGV4Y2VwdCB3aGVuIHRoZSBzaGFwZSBpcyBiZWluZyBkcmFnZ2VkKS4gVGhlIGNhbGxiYWNrIGlzIGNhbGxlZCB3aXRoIHRoZSBsYXN0IHNoYXBlIHN0YXRlIGFuZCB3aXRoIGFuIGFycmF5IG9mIHRoZSBjdXJyZW50IGxhYmVscy5cclxuICogVGhlIGNhbGxiYWNrIHNob3VsZCByZXR1cm4gdHlwZSBgTGFiZWxQcm9wc1tdYC5cclxuICogWW91IGNhbiBhbHNvIHVzZSBgdXBkYXRlTGFiZWxzKClgIHRvIHBhc3MgYW4gYXJyYXkgb2YgbGFiZWxzIG9mIHR5cGUgYExhYmVsUHJvcHNbXWAgdG8gYmUgZHJhd24uXHJcbiAqXHJcbiAqIHVzYWdlOlxyXG4gKiBgYGB0eXBlc2NyaXB0XHJcbiAqICAvLyBTdGFydCBjcmVhdGluZyBwb2ludFxyXG4gKiAgY29uc3QgZWRpdGluZyQgPSBwb2ludEVkaXRvclNlcnZpY2UuY3JlYXRlKCk7XHJcbiAqICB0aGlzLmVkaXRpbmckLnN1YnNjcmliZShlZGl0UmVzdWx0ID0+IHtcclxuICpcdFx0XHRcdGNvbnNvbGUubG9nKGVkaXRSZXN1bHQucG9zaXRpb25zKTtcclxuICpcdFx0fSk7XHJcbiAqXHJcbiAqICAvLyBPciBlZGl0IHBvaW50IGZyb20gZXhpc3RpbmcgcG9pbnQgY2FydGVzaWFuMyBwb3NpdGlvbnNcclxuICogIGNvbnN0IGVkaXRpbmckID0gdGhpcy5wb2ludEVkaXRvci5lZGl0KGluaXRpYWxQb3MpO1xyXG4gKlxyXG4gKiBgYGBcclxuICovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIFBvaW50c0VkaXRvclNlcnZpY2Uge1xyXG4gIHByaXZhdGUgbWFwRXZlbnRzTWFuYWdlcjogTWFwRXZlbnRzTWFuYWdlclNlcnZpY2U7XHJcbiAgcHJpdmF0ZSB1cGRhdGVTdWJqZWN0ID0gbmV3IFN1YmplY3Q8UG9pbnRFZGl0VXBkYXRlPigpO1xyXG4gIHByaXZhdGUgdXBkYXRlUHVibGlzaGVyID0gcHVibGlzaDxQb2ludEVkaXRVcGRhdGU+KCkodGhpcy51cGRhdGVTdWJqZWN0KTsgLy8gVE9ETyBtYXliZSBub3QgbmVlZGVkXHJcbiAgcHJpdmF0ZSBjb29yZGluYXRlQ29udmVydGVyOiBDb29yZGluYXRlQ29udmVydGVyO1xyXG4gIHByaXZhdGUgY2FtZXJhU2VydmljZTogQ2FtZXJhU2VydmljZTtcclxuICBwcml2YXRlIHBvaW50TWFuYWdlcjogUG9pbnRzTWFuYWdlclNlcnZpY2U7XHJcbiAgcHJpdmF0ZSBvYnNlcnZhYmxlc01hcCA9IG5ldyBNYXA8c3RyaW5nLCBEaXNwb3NhYmxlT2JzZXJ2YWJsZTxhbnk+W10+KCk7XHJcbiAgcHJpdmF0ZSBjZXNpdW1TY2VuZTtcclxuXHJcbiAgaW5pdChtYXBFdmVudHNNYW5hZ2VyOiBNYXBFdmVudHNNYW5hZ2VyU2VydmljZSxcclxuICAgICAgIGNvb3JkaW5hdGVDb252ZXJ0ZXI6IENvb3JkaW5hdGVDb252ZXJ0ZXIsXHJcbiAgICAgICBjYW1lcmFTZXJ2aWNlOiBDYW1lcmFTZXJ2aWNlLFxyXG4gICAgICAgcG9pbnRNYW5hZ2VyOiBQb2ludHNNYW5hZ2VyU2VydmljZSxcclxuICAgICAgIGNlc2l1bVZpZXdlcjogQ2VzaXVtU2VydmljZSkge1xyXG4gICAgdGhpcy5tYXBFdmVudHNNYW5hZ2VyID0gbWFwRXZlbnRzTWFuYWdlcjtcclxuICAgIHRoaXMuY29vcmRpbmF0ZUNvbnZlcnRlciA9IGNvb3JkaW5hdGVDb252ZXJ0ZXI7XHJcbiAgICB0aGlzLmNhbWVyYVNlcnZpY2UgPSBjYW1lcmFTZXJ2aWNlO1xyXG4gICAgdGhpcy5wb2ludE1hbmFnZXIgPSBwb2ludE1hbmFnZXI7XHJcbiAgICB0aGlzLnVwZGF0ZVB1Ymxpc2hlci5jb25uZWN0KCk7XHJcblxyXG4gICAgdGhpcy5jZXNpdW1TY2VuZSA9IGNlc2l1bVZpZXdlci5nZXRTY2VuZSgpO1xyXG4gIH1cclxuXHJcbiAgb25VcGRhdGUoKTogT2JzZXJ2YWJsZTxQb2ludEVkaXRVcGRhdGU+IHtcclxuICAgIHJldHVybiB0aGlzLnVwZGF0ZVB1Ymxpc2hlcjtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgc2NyZWVuVG9Qb3NpdGlvbihjYXJ0ZXNpYW4yKSB7XHJcbiAgICBjb25zdCBjYXJ0ZXNpYW4zID0gdGhpcy5jb29yZGluYXRlQ29udmVydGVyLnNjcmVlblRvQ2FydGVzaWFuMyhjYXJ0ZXNpYW4yKTtcclxuXHJcbiAgICAvLyBJZiBjYXJ0ZXNpYW4zIGlzIHVuZGVmaW5lZCB0aGVuIHRoZSBwb2ludCBpbnN0IG9uIHRoZSBnbG9iZVxyXG4gICAgaWYgKGNhcnRlc2lhbjMpIHtcclxuICAgICAgY29uc3QgcmF5ID0gdGhpcy5jYW1lcmFTZXJ2aWNlLmdldENhbWVyYSgpLmdldFBpY2tSYXkoY2FydGVzaWFuMik7XHJcbiAgICAgIHJldHVybiB0aGlzLmNlc2l1bVNjZW5lLmdsb2JlLnBpY2socmF5LCB0aGlzLmNlc2l1bVNjZW5lKTtcclxuICAgIH1cclxuICAgIHJldHVybiBjYXJ0ZXNpYW4zO1xyXG4gIH1cclxuXHJcbiAgY3JlYXRlKG9wdGlvbnMgPSBERUZBVUxUX1BPSU5UX09QVElPTlMsIGV2ZW50UHJpb3JpdHkgPSAxMDApOiBQb2ludEVkaXRvck9ic2VydmFibGUge1xyXG4gICAgY29uc3QgaWQgPSBnZW5lcmF0ZUtleSgpO1xyXG4gICAgY29uc3QgcG9pbnRPcHRpb25zID0gdGhpcy5zZXRPcHRpb25zKG9wdGlvbnMpO1xyXG5cclxuICAgIGNvbnN0IGNsaWVudEVkaXRTdWJqZWN0ID0gbmV3IEJlaGF2aW9yU3ViamVjdDxQb2ludEVkaXRVcGRhdGU+KHtcclxuICAgICAgaWQsXHJcbiAgICAgIGVkaXRBY3Rpb246IG51bGwsXHJcbiAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuQ1JFQVRFXHJcbiAgICB9KTtcclxuICAgIGxldCBmaW5pc2hlZENyZWF0ZSA9IGZhbHNlO1xyXG5cclxuICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHtcclxuICAgICAgaWQsXHJcbiAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuQ1JFQVRFLFxyXG4gICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5JTklULFxyXG4gICAgICBwb2ludE9wdGlvbnM6IHBvaW50T3B0aW9ucyxcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnN0IGZpbmlzaENyZWF0aW9uID0gKHBvc2l0aW9uOiBDYXJ0ZXNpYW4zKSA9PiB7XHJcbiAgICAgIHJldHVybiB0aGlzLnN3aXRjaFRvRWRpdE1vZGUoXHJcbiAgICAgICAgaWQsXHJcbiAgICAgICAgY2xpZW50RWRpdFN1YmplY3QsXHJcbiAgICAgICAgcG9zaXRpb24sXHJcbiAgICAgICAgZXZlbnRQcmlvcml0eSxcclxuICAgICAgICBwb2ludE9wdGlvbnMsXHJcbiAgICAgICAgZWRpdG9yT2JzZXJ2YWJsZSxcclxuICAgICAgICB0cnVlXHJcbiAgICAgICk7XHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IG1vdXNlTW92ZVJlZ2lzdHJhdGlvbiA9IHRoaXMubWFwRXZlbnRzTWFuYWdlci5yZWdpc3Rlcih7XHJcbiAgICAgIGV2ZW50OiBDZXNpdW1FdmVudC5NT1VTRV9NT1ZFLFxyXG4gICAgICBwaWNrOiBQaWNrT3B0aW9ucy5OT19QSUNLLFxyXG4gICAgICBwcmlvcml0eTogZXZlbnRQcmlvcml0eSxcclxuICAgICAgcGlja0NvbmZpZzogb3B0aW9ucy5waWNrQ29uZmlndXJhdGlvbixcclxuICAgIH0pO1xyXG4gICAgY29uc3QgYWRkTGFzdFBvaW50UmVnaXN0cmF0aW9uID0gdGhpcy5tYXBFdmVudHNNYW5hZ2VyLnJlZ2lzdGVyKHtcclxuICAgICAgZXZlbnQ6IHBvaW50T3B0aW9ucy5hZGRMYXN0UG9pbnRFdmVudCxcclxuICAgICAgbW9kaWZpZXI6IHBvaW50T3B0aW9ucy5hZGRMYXN0UG9pbnRNb2RpZmllcixcclxuICAgICAgcGljazogUGlja09wdGlvbnMuTk9fUElDSyxcclxuICAgICAgcHJpb3JpdHk6IGV2ZW50UHJpb3JpdHksXHJcbiAgICAgIHBpY2tDb25maWc6IG9wdGlvbnMucGlja0NvbmZpZ3VyYXRpb24sXHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLm9ic2VydmFibGVzTWFwLnNldChpZCwgW21vdXNlTW92ZVJlZ2lzdHJhdGlvbiwgYWRkTGFzdFBvaW50UmVnaXN0cmF0aW9uXSk7XHJcbiAgICBjb25zdCBlZGl0b3JPYnNlcnZhYmxlID0gdGhpcy5jcmVhdGVFZGl0b3JPYnNlcnZhYmxlKGNsaWVudEVkaXRTdWJqZWN0LCBpZCwgZmluaXNoQ3JlYXRpb24pO1xyXG5cclxuICAgIG1vdXNlTW92ZVJlZ2lzdHJhdGlvbi5zdWJzY3JpYmUoKHsgbW92ZW1lbnQ6IHsgZW5kUG9zaXRpb24gfSB9KSA9PiB7XHJcbiAgICAgIGNvbnN0IHBvc2l0aW9uID0gdGhpcy5zY3JlZW5Ub1Bvc2l0aW9uKGVuZFBvc2l0aW9uKTtcclxuICAgICAgaWYgKHBvc2l0aW9uKSB7XHJcblxyXG4gICAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHtcclxuICAgICAgICAgIGlkLFxyXG4gICAgICAgICAgcG9zaXRpb24sXHJcbiAgICAgICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkNSRUFURSxcclxuICAgICAgICAgIHVwZGF0ZWRQb3NpdGlvbjogcG9zaXRpb24sXHJcbiAgICAgICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5NT1VTRV9NT1ZFLFxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgIGFkZExhc3RQb2ludFJlZ2lzdHJhdGlvbi5zdWJzY3JpYmUoKHsgbW92ZW1lbnQ6IHsgZW5kUG9zaXRpb24gfSB9KSA9PiB7XHJcbiAgICAgIGNvbnN0IHBvc2l0aW9uID0gdGhpcy5zY3JlZW5Ub1Bvc2l0aW9uKGVuZFBvc2l0aW9uKTtcclxuICAgICAgZmluaXNoZWRDcmVhdGUgPSBmaW5pc2hDcmVhdGlvbihwb3NpdGlvbik7XHJcbiAgICB9KTtcclxuICAgIHJldHVybiBlZGl0b3JPYnNlcnZhYmxlO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBzd2l0Y2hUb0VkaXRNb2RlKGlkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBjbGllbnRFZGl0U3ViamVjdCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IENhcnRlc2lhbjMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50UHJpb3JpdHksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50T3B0aW9ucyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgZWRpdG9yT2JzZXJ2YWJsZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgZmluaXNoZWRDcmVhdGU6IGJvb2xlYW4pIHtcclxuICAgIGNvbnN0IHVwZGF0ZSA9IHtcclxuICAgICAgaWQsXHJcbiAgICAgIHBvc2l0aW9uOiBwb3NpdGlvbixcclxuICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5DUkVBVEVfT1JfRURJVCxcclxuICAgICAgdXBkYXRlZFBvc2l0aW9uOiBwb3NpdGlvbixcclxuICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuQUREX0xBU1RfUE9JTlQsXHJcbiAgICB9O1xyXG4gICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQodXBkYXRlKTtcclxuICAgIGNsaWVudEVkaXRTdWJqZWN0Lm5leHQoe1xyXG4gICAgICAuLi51cGRhdGUsXHJcbiAgICAgIHBvc2l0aW9uOiBwb3NpdGlvbixcclxuICAgICAgcG9pbnQ6IHRoaXMuZ2V0UG9pbnQoaWQpLFxyXG4gICAgfSk7XHJcblxyXG4gICAgY29uc3QgY2hhbmdlTW9kZSA9IHtcclxuICAgICAgaWQsXHJcbiAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuQ1JFQVRFLFxyXG4gICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5DSEFOR0VfVE9fRURJVCxcclxuICAgIH07XHJcbiAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dChjaGFuZ2VNb2RlKTtcclxuICAgIGNsaWVudEVkaXRTdWJqZWN0Lm5leHQoY2hhbmdlTW9kZSk7XHJcbiAgICBpZiAodGhpcy5vYnNlcnZhYmxlc01hcC5oYXMoaWQpKSB7XHJcbiAgICAgIHRoaXMub2JzZXJ2YWJsZXNNYXAuZ2V0KGlkKS5mb3JFYWNoKHJlZ2lzdHJhdGlvbiA9PiByZWdpc3RyYXRpb24uZGlzcG9zZSgpKTtcclxuICAgIH1cclxuICAgIHRoaXMub2JzZXJ2YWJsZXNNYXAuZGVsZXRlKGlkKTtcclxuICAgIHRoaXMuZWRpdFBvaW50KGlkLCBwb3NpdGlvbiwgZXZlbnRQcmlvcml0eSwgY2xpZW50RWRpdFN1YmplY3QsIHBvaW50T3B0aW9ucywgZWRpdG9yT2JzZXJ2YWJsZSk7XHJcbiAgICBmaW5pc2hlZENyZWF0ZSA9IHRydWU7XHJcbiAgICByZXR1cm4gZmluaXNoZWRDcmVhdGU7XHJcbiAgfVxyXG5cclxuICBlZGl0KHBvc2l0aW9uOiBDYXJ0ZXNpYW4zLCBvcHRpb25zID0gREVGQVVMVF9QT0lOVF9PUFRJT05TLCBwcmlvcml0eSA9IDEwMCk6IFBvaW50RWRpdG9yT2JzZXJ2YWJsZSB7XHJcbiAgICBjb25zdCBpZCA9IGdlbmVyYXRlS2V5KCk7XHJcbiAgICBjb25zdCBwb2ludE9wdGlvbnMgPSB0aGlzLnNldE9wdGlvbnMob3B0aW9ucyk7XHJcbiAgICBjb25zdCBlZGl0U3ViamVjdCA9IG5ldyBCZWhhdmlvclN1YmplY3Q8UG9pbnRFZGl0VXBkYXRlPih7XHJcbiAgICAgIGlkLFxyXG4gICAgICBlZGl0QWN0aW9uOiBudWxsLFxyXG4gICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkVESVRcclxuICAgIH0pO1xyXG4gICAgY29uc3QgdXBkYXRlID0ge1xyXG4gICAgICBpZCxcclxuICAgICAgcG9zaXRpb246IHBvc2l0aW9uLFxyXG4gICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkVESVQsXHJcbiAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLklOSVQsXHJcbiAgICAgIHBvaW50T3B0aW9uczogcG9pbnRPcHRpb25zLFxyXG4gICAgfTtcclxuICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHVwZGF0ZSk7XHJcbiAgICBlZGl0U3ViamVjdC5uZXh0KHtcclxuICAgICAgLi4udXBkYXRlLFxyXG4gICAgICBwb3NpdGlvbjogcG9zaXRpb24sXHJcbiAgICAgIHBvaW50OiB0aGlzLmdldFBvaW50KGlkKSxcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIHRoaXMuZWRpdFBvaW50KFxyXG4gICAgICBpZCxcclxuICAgICAgcG9zaXRpb24sXHJcbiAgICAgIHByaW9yaXR5LFxyXG4gICAgICBlZGl0U3ViamVjdCxcclxuICAgICAgcG9pbnRPcHRpb25zXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBlZGl0UG9pbnQoaWQ6IHN0cmluZyxcclxuICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogQ2FydGVzaWFuMyxcclxuICAgICAgICAgICAgICAgICAgICAgICBwcmlvcml0eTogbnVtYmVyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgIGVkaXRTdWJqZWN0OiBTdWJqZWN0PFBvaW50RWRpdFVwZGF0ZT4sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9uczogUG9pbnRFZGl0T3B0aW9ucyxcclxuICAgICAgICAgICAgICAgICAgICAgICBlZGl0T2JzZXJ2YWJsZT86IFBvaW50RWRpdG9yT2JzZXJ2YWJsZSkge1xyXG4gICAgY29uc3QgcG9pbnREcmFnUmVnaXN0cmF0aW9uID0gdGhpcy5tYXBFdmVudHNNYW5hZ2VyLnJlZ2lzdGVyKHtcclxuICAgICAgZXZlbnQ6IG9wdGlvbnMuZHJhZ1BvaW50RXZlbnQsXHJcbiAgICAgIGVudGl0eVR5cGU6IEVkaXRQb2ludCxcclxuICAgICAgcGljazogUGlja09wdGlvbnMuUElDS19GSVJTVCxcclxuICAgICAgcGlja0NvbmZpZzogb3B0aW9ucy5waWNrQ29uZmlndXJhdGlvbixcclxuICAgICAgcHJpb3JpdHksXHJcbiAgICAgIHBpY2tGaWx0ZXI6IGVudGl0eSA9PiBpZCA9PT0gZW50aXR5LmVkaXRlZEVudGl0eUlkLFxyXG4gICAgfSk7XHJcblxyXG4gICAgY29uc3QgcG9pbnRSZW1vdmVSZWdpc3RyYXRpb24gPSB0aGlzLm1hcEV2ZW50c01hbmFnZXIucmVnaXN0ZXIoe1xyXG4gICAgICBldmVudDogb3B0aW9ucy5yZW1vdmVQb2ludEV2ZW50LFxyXG4gICAgICBtb2RpZmllcjogb3B0aW9ucy5yZW1vdmVQb2ludE1vZGlmaWVyLFxyXG4gICAgICBlbnRpdHlUeXBlOiBFZGl0UG9pbnQsXHJcbiAgICAgIHBpY2s6IFBpY2tPcHRpb25zLlBJQ0tfRklSU1QsXHJcbiAgICAgIHBpY2tDb25maWc6IG9wdGlvbnMucGlja0NvbmZpZ3VyYXRpb24sXHJcbiAgICAgIHByaW9yaXR5LFxyXG4gICAgICBwaWNrRmlsdGVyOiBlbnRpdHkgPT4gaWQgPT09IGVudGl0eS5lZGl0ZWRFbnRpdHlJZCxcclxuICAgIH0pO1xyXG5cclxuICAgIHBvaW50RHJhZ1JlZ2lzdHJhdGlvbi5waXBlKFxyXG4gICAgICB0YXAoKHsgbW92ZW1lbnQ6IHsgZHJvcCB9IH0pID0+IHRoaXMuY2FtZXJhU2VydmljZS5lbmFibGVJbnB1dHMoZHJvcCkpKVxyXG4gICAgICAuc3Vic2NyaWJlKCh7IG1vdmVtZW50OiB7IGVuZFBvc2l0aW9uLCBkcm9wIH0sIGVudGl0aWVzIH0pID0+IHtcclxuICAgICAgICBjb25zdCB1cGRhdGVkUG9zaXRpb24gPSB0aGlzLnNjcmVlblRvUG9zaXRpb24oZW5kUG9zaXRpb24pO1xyXG4gICAgICAgIGlmICghdXBkYXRlZFBvc2l0aW9uKSB7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IHVwZGF0ZSA9IHtcclxuICAgICAgICAgIGlkLFxyXG4gICAgICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5FRElULFxyXG4gICAgICAgICAgdXBkYXRlZFBvc2l0aW9uLFxyXG4gICAgICAgICAgZWRpdEFjdGlvbjogZHJvcCA/IEVkaXRBY3Rpb25zLkRSQUdfUE9JTlRfRklOSVNIIDogRWRpdEFjdGlvbnMuRFJBR19QT0lOVCxcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHVwZGF0ZSk7XHJcbiAgICAgICAgZWRpdFN1YmplY3QubmV4dCh7XHJcbiAgICAgICAgICAuLi51cGRhdGUsXHJcbiAgICAgICAgICBwb3NpdGlvbjogdXBkYXRlZFBvc2l0aW9uLFxyXG4gICAgICAgICAgcG9pbnQ6IHRoaXMuZ2V0UG9pbnQoaWQpLFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgfSk7XHJcblxyXG4gICAgY29uc3Qgb2JzZXJ2YWJsZXMgPSBbcG9pbnREcmFnUmVnaXN0cmF0aW9uLCBwb2ludFJlbW92ZVJlZ2lzdHJhdGlvbl07XHJcbiAgICB0aGlzLm9ic2VydmFibGVzTWFwLnNldChpZCwgb2JzZXJ2YWJsZXMpO1xyXG4gICAgcmV0dXJuIHRoaXMuY3JlYXRlRWRpdG9yT2JzZXJ2YWJsZShlZGl0U3ViamVjdCwgaWQpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBzZXRPcHRpb25zKG9wdGlvbnM6IFBvaW50RWRpdE9wdGlvbnMpIHtcclxuICAgIGNvbnN0IGRlZmF1bHRDbG9uZSA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoREVGQVVMVF9QT0lOVF9PUFRJT05TKSk7XHJcbiAgICBjb25zdCBwb2ludE9wdGlvbnM6IFBvaW50RWRpdE9wdGlvbnMgPSBPYmplY3QuYXNzaWduKGRlZmF1bHRDbG9uZSwgb3B0aW9ucyk7XHJcbiAgICBwb2ludE9wdGlvbnMucG9pbnRQcm9wcyA9IHsuLi5ERUZBVUxUX1BPSU5UX09QVElPTlMucG9pbnRQcm9wcywgLi4ub3B0aW9ucy5wb2ludFByb3BzfTtcclxuICAgIHBvaW50T3B0aW9ucy5wb2ludFByb3BzID0gey4uLkRFRkFVTFRfUE9JTlRfT1BUSU9OUy5wb2ludFByb3BzLCAuLi5vcHRpb25zLnBvaW50UHJvcHN9O1xyXG4gICAgcmV0dXJuIHBvaW50T3B0aW9ucztcclxuICB9XHJcblxyXG5cclxuICBwcml2YXRlIGNyZWF0ZUVkaXRvck9ic2VydmFibGUob2JzZXJ2YWJsZVRvRXh0ZW5kOiBhbnksIGlkOiBzdHJpbmcsIGZpbmlzaENyZWF0aW9uPzogKHBvc2l0aW9uOiBDYXJ0ZXNpYW4zKSA9PiBib29sZWFuKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBQb2ludEVkaXRvck9ic2VydmFibGUge1xyXG4gICAgb2JzZXJ2YWJsZVRvRXh0ZW5kLmRpc3Bvc2UgPSAoKSA9PiB7XHJcbiAgICAgIGNvbnN0IG9ic2VydmFibGVzID0gdGhpcy5vYnNlcnZhYmxlc01hcC5nZXQoaWQpO1xyXG4gICAgICBpZiAob2JzZXJ2YWJsZXMpIHtcclxuICAgICAgICBvYnNlcnZhYmxlcy5mb3JFYWNoKG9icyA9PiBvYnMuZGlzcG9zZSgpKTtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLm9ic2VydmFibGVzTWFwLmRlbGV0ZShpZCk7XHJcbiAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHtcclxuICAgICAgICBpZCxcclxuICAgICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkNSRUFURV9PUl9FRElULFxyXG4gICAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLkRJU1BPU0UsXHJcbiAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICBvYnNlcnZhYmxlVG9FeHRlbmQuZW5hYmxlID0gKCkgPT4ge1xyXG4gICAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dCh7XHJcbiAgICAgICAgaWQsXHJcbiAgICAgICAgcG9zaXRpb246IHRoaXMuZ2V0UG9zaXRpb24oaWQpLFxyXG4gICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuRURJVCxcclxuICAgICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5FTkFCTEUsXHJcbiAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICBvYnNlcnZhYmxlVG9FeHRlbmQuZGlzYWJsZSA9ICgpID0+IHtcclxuICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQoe1xyXG4gICAgICAgIGlkLFxyXG4gICAgICAgIHBvc2l0aW9uOiB0aGlzLmdldFBvc2l0aW9uKGlkKSxcclxuICAgICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkVESVQsXHJcbiAgICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuRElTQUJMRSxcclxuICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIG9ic2VydmFibGVUb0V4dGVuZC5zZXRNYW51YWxseSA9IChwb2ludDoge1xyXG4gICAgICBwb3NpdGlvbjogQ2FydGVzaWFuMyxcclxuICAgICAgcG9pbnRQcm9wPzogUG9pbnRQcm9wc1xyXG4gICAgfSB8IENhcnRlc2lhbjMsIHBvaW50UHJvcHM/OiBQb2ludFByb3BzKSA9PiB7XHJcbiAgICAgIGNvbnN0IG5ld1BvaW50ID0gdGhpcy5wb2ludE1hbmFnZXIuZ2V0KGlkKTtcclxuICAgICAgbmV3UG9pbnQuc2V0TWFudWFsbHkocG9pbnQsIHBvaW50UHJvcHMpO1xyXG4gICAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dCh7XHJcbiAgICAgICAgaWQsXHJcbiAgICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5DUkVBVEVfT1JfRURJVCxcclxuICAgICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5TRVRfTUFOVUFMTFksXHJcbiAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICBvYnNlcnZhYmxlVG9FeHRlbmQuc2V0TGFiZWxzUmVuZGVyRm4gPSAoY2FsbGJhY2s6IGFueSkgPT4ge1xyXG4gICAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dCh7XHJcbiAgICAgICAgaWQsXHJcbiAgICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5DUkVBVEVfT1JfRURJVCxcclxuICAgICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5TRVRfRURJVF9MQUJFTFNfUkVOREVSX0NBTExCQUNLLFxyXG4gICAgICAgIGxhYmVsc1JlbmRlckZuOiBjYWxsYmFjayxcclxuICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIG9ic2VydmFibGVUb0V4dGVuZC51cGRhdGVMYWJlbHMgPSAobGFiZWxzOiBMYWJlbFByb3BzW10pID0+IHtcclxuICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQoe1xyXG4gICAgICAgIGlkLFxyXG4gICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuQ1JFQVRFX09SX0VESVQsXHJcbiAgICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuVVBEQVRFX0VESVRfTEFCRUxTLFxyXG4gICAgICAgIHVwZGF0ZUxhYmVsczogbGFiZWxzLFxyXG4gICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgb2JzZXJ2YWJsZVRvRXh0ZW5kLmZpbmlzaENyZWF0aW9uID0gKCkgPT4ge1xyXG4gICAgICBpZiAoIWZpbmlzaENyZWF0aW9uKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdQb2ludHMgZWRpdG9yIGVycm9yIGVkaXQoKTogY2Fubm90IGNhbGwgZmluaXNoQ3JlYXRpb24oKSBvbiBlZGl0Jyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBmaW5pc2hDcmVhdGlvbihudWxsKTtcclxuICAgIH07XHJcblxyXG4gICAgb2JzZXJ2YWJsZVRvRXh0ZW5kLmdldEN1cnJlbnRQb2ludCA9ICgpID0+IHRoaXMuZ2V0UG9pbnQoaWQpO1xyXG5cclxuICAgIG9ic2VydmFibGVUb0V4dGVuZC5nZXRFZGl0VmFsdWUgPSAoKSA9PiBvYnNlcnZhYmxlVG9FeHRlbmQuZ2V0VmFsdWUoKTtcclxuXHJcbiAgICBvYnNlcnZhYmxlVG9FeHRlbmQuZ2V0TGFiZWxzID0gKCk6IExhYmVsUHJvcHNbXSA9PiB0aGlzLnBvaW50TWFuYWdlci5nZXQoaWQpLmxhYmVscztcclxuXHJcbiAgICByZXR1cm4gb2JzZXJ2YWJsZVRvRXh0ZW5kIGFzIFBvaW50RWRpdG9yT2JzZXJ2YWJsZTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZ2V0UG9zaXRpb24oaWQ6IHN0cmluZykge1xyXG4gICAgY29uc3QgcG9pbnQgPSB0aGlzLnBvaW50TWFuYWdlci5nZXQoaWQpO1xyXG4gICAgcmV0dXJuIHBvaW50LmdldFBvc2l0aW9uKCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGdldFBvaW50KGlkOiBzdHJpbmcpIHtcclxuICAgIGNvbnN0IHBvaW50ID0gdGhpcy5wb2ludE1hbmFnZXIuZ2V0KGlkKTtcclxuICAgIGlmIChwb2ludCkge1xyXG4gICAgICByZXR1cm4gcG9pbnQuZ2V0Q3VycmVudFBvaW50KCk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiJdfQ==