import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { publish, tap } from 'rxjs/operators';
import { Color, ClassificationType, ShadowMode } from 'cesium';
import { GeoUtilsService } from '../../../../angular-cesium/services/geo-utils/geo-utils.service';
import { CesiumEvent } from '../../../../angular-cesium/services/map-events-mananger/consts/cesium-event.enum';
import { PickOptions } from '../../../../angular-cesium/services/map-events-mananger/consts/pickOptions.enum';
import { EditActions } from '../../../models/edit-actions.enum';
import { EditModes } from '../../../models/edit-mode.enum';
import { EditPoint } from '../../../models/edit-point';
import { EditableCircle } from '../../../models/editable-circle';
import { generateKey } from '../../utils';
import * as i0 from "@angular/core";
export const DEFAULT_CIRCLE_OPTIONS = {
    addPointEvent: CesiumEvent.LEFT_CLICK,
    dragPointEvent: CesiumEvent.LEFT_CLICK_DRAG,
    dragShapeEvent: CesiumEvent.LEFT_CLICK_DRAG,
    allowDrag: true,
    circleProps: {
        material: Color.CORNFLOWERBLUE.withAlpha(0.4),
        fill: true,
        outline: false,
        outlineWidth: 1,
        outlineColor: Color.WHITE.withAlpha(0.8),
        classificationType: ClassificationType.BOTH,
        zIndex: 0,
        shadows: ShadowMode.DISABLED,
    },
    pointProps: {
        color: Color.WHITE,
        outlineColor: Color.BLACK.withAlpha(0.2),
        outlineWidth: 1,
        pixelSize: 13,
        virtualPointPixelSize: 8,
        show: true,
        showVirtual: true,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
    },
    polylineProps: {
        width: 1,
        material: () => Color.WHITE.withAlpha(0.8),
    },
};
/**
 * Service for creating editable circles
 *
 * You must provide `CircleEditorService` yourself.
 * PolygonsEditorService works together with `<circle-editor>` component. Therefor you need to create `<circle-editor>`
 * for each `CircleEditorService`, And of course somewhere under `<ac-map>`/
 *
 * + `create` for starting a creation of the shape over the map. Returns a extension of `CircleEditorObservable`.
 * + `edit` for editing shape over the map starting from a given positions. Returns an extension of `CircleEditorObservable`.
 * + To stop editing call `dsipose()` from the `CircleEditorObservable` you get back from `create()` \ `edit()`.
 *
 * **Labels over editted shapes**
 * Angular Cesium allows you to draw labels over a shape that is being edited with one of the editors.
 * To add label drawing logic to your editor use the function `setLabelsRenderFn()` that is defined on the
 * `CircleEditorObservable` that is returned from calling `create()` \ `edit()` of one of the editor services.
 * `setLabelsRenderFn()` - receives a callback that is called every time the shape is redrawn
 * (except when the shape is being dragged). The callback is called with the last shape state and with an array of the current labels.
 * The callback should return type `LabelProps[]`.
 * You can also use `updateLabels()` to pass an array of labels of type `LabelProps[]` to be drawn.
 *
 * usage:
 * ```typescript
 *  // Start creating circle
 *  const editing$ = circlesEditorService.create();
 *  this.editing$.subscribe(editResult => {
 *				console.log(editResult.positions);
 *		});
 *
 *  // Or edit circle from existing center point and radius
 *  const editing$ = this.circlesEditorService.edit(center, radius);
 *
 * ```
 */
export class CirclesEditorService {
    constructor() {
        this.updateSubject = new Subject();
        this.updatePublisher = publish()(this.updateSubject); // TODO maybe not needed
        this.observablesMap = new Map();
    }
    init(mapEventsManager, coordinateConverter, cameraService, circlesManager) {
        this.mapEventsManager = mapEventsManager;
        this.coordinateConverter = coordinateConverter;
        this.cameraService = cameraService;
        this.circlesManager = circlesManager;
        this.updatePublisher.connect();
    }
    onUpdate() {
        return this.updatePublisher;
    }
    create(options = DEFAULT_CIRCLE_OPTIONS, priority = 100) {
        let center;
        const id = generateKey();
        const circleOptions = this.setOptions(options);
        const clientEditSubject = new BehaviorSubject({
            id,
            editAction: null,
            editMode: EditModes.CREATE,
        });
        let finishedCreate = false;
        this.updateSubject.next({
            id,
            editMode: EditModes.CREATE,
            editAction: EditActions.INIT,
            circleOptions,
        });
        const finishCreation = (position) => {
            const update = {
                id,
                center,
                radiusPoint: position,
                editMode: EditModes.CREATE,
                editAction: EditActions.ADD_LAST_POINT,
            };
            this.updateSubject.next(update);
            clientEditSubject.next({
                ...update,
                ...this.getCircleProperties(id),
            });
            const changeMode = {
                id,
                center,
                radiusPoint: position,
                editMode: EditModes.CREATE,
                editAction: EditActions.CHANGE_TO_EDIT,
            };
            this.updateSubject.next(changeMode);
            clientEditSubject.next({
                ...update,
                ...this.getCircleProperties(id),
            });
            if (this.observablesMap.has(id)) {
                this.observablesMap.get(id).forEach(registration => registration.dispose());
            }
            this.observablesMap.delete(id);
            this.editCircle(id, priority, clientEditSubject, circleOptions, editorObservable);
            finishedCreate = true;
            return finishedCreate;
        };
        const mouseMoveRegistration = this.mapEventsManager.register({
            event: CesiumEvent.MOUSE_MOVE,
            pick: PickOptions.NO_PICK,
            pickConfig: options.pickConfiguration,
            priority,
        });
        const addPointRegistration = this.mapEventsManager.register({
            event: CesiumEvent.LEFT_CLICK,
            pick: PickOptions.NO_PICK,
            pickConfig: options.pickConfiguration,
            priority,
        });
        this.observablesMap.set(id, [mouseMoveRegistration, addPointRegistration]);
        const editorObservable = this.createEditorObservable(clientEditSubject, id, finishCreation);
        addPointRegistration.subscribe(({ movement: { endPosition } }) => {
            if (finishedCreate) {
                return;
            }
            const position = this.coordinateConverter.screenToCartesian3(endPosition);
            if (!position) {
                return;
            }
            if (!center) {
                const update = {
                    id,
                    center: position,
                    editMode: EditModes.CREATE,
                    editAction: EditActions.ADD_POINT,
                };
                this.updateSubject.next(update);
                clientEditSubject.next({
                    ...update,
                    ...this.getCircleProperties(id),
                });
                center = position;
            }
            else {
                finishedCreate = finishCreation(position);
            }
        });
        mouseMoveRegistration.subscribe(({ movement: { endPosition } }) => {
            if (!center) {
                return;
            }
            const position = this.coordinateConverter.screenToCartesian3(endPosition);
            if (position) {
                const update = {
                    id,
                    center,
                    radiusPoint: position,
                    editMode: EditModes.CREATE,
                    editAction: EditActions.MOUSE_MOVE,
                };
                this.updateSubject.next(update);
                clientEditSubject.next({
                    ...update,
                    ...this.getCircleProperties(id),
                });
            }
        });
        return editorObservable;
    }
    edit(center, radius, options = DEFAULT_CIRCLE_OPTIONS, priority = 100) {
        const id = generateKey();
        const circleOptions = this.setOptions(options);
        const editSubject = new BehaviorSubject({
            id,
            editAction: null,
            editMode: EditModes.EDIT,
        });
        const radiusPoint = GeoUtilsService.pointByLocationDistanceAndAzimuth(center, radius, Math.PI / 2, true);
        const update = {
            id,
            center,
            radiusPoint,
            editMode: EditModes.EDIT,
            editAction: EditActions.INIT,
            circleOptions,
        };
        this.updateSubject.next(update);
        editSubject.next({
            ...update,
            ...this.getCircleProperties(id),
        });
        return this.editCircle(id, priority, editSubject, circleOptions);
    }
    editCircle(id, priority, editSubject, options, editObservable) {
        const pointDragRegistration = this.mapEventsManager.register({
            event: CesiumEvent.LEFT_CLICK_DRAG,
            entityType: EditPoint,
            pickConfig: options.pickConfiguration,
            pick: PickOptions.PICK_FIRST,
            priority,
            pickFilter: entity => id === entity.editedEntityId,
        });
        let shapeDragRegistration;
        if (options.allowDrag) {
            shapeDragRegistration = this.mapEventsManager.register({
                event: CesiumEvent.LEFT_CLICK_DRAG,
                entityType: EditableCircle,
                pickConfig: options.pickConfiguration,
                pick: PickOptions.PICK_FIRST,
                priority: priority,
                pickFilter: entity => id === entity.id,
            });
        }
        pointDragRegistration
            .pipe(tap(({ movement: { drop } }) => this.cameraService.enableInputs(drop)))
            .subscribe(({ movement: { endPosition, startPosition, drop }, entities }) => {
            const startDragPosition = this.coordinateConverter.screenToCartesian3(startPosition);
            const endDragPosition = this.coordinateConverter.screenToCartesian3(endPosition);
            if (!endDragPosition) {
                return;
            }
            const point = entities[0];
            const pointIsCenter = point === this.getCenterPoint(id);
            let editAction;
            if (drop) {
                editAction = pointIsCenter ? EditActions.DRAG_SHAPE_FINISH : EditActions.DRAG_POINT_FINISH;
            }
            else {
                editAction = pointIsCenter ? EditActions.DRAG_SHAPE : EditActions.DRAG_POINT;
            }
            if (!options.allowDrag && (editAction === EditActions.DRAG_SHAPE || editAction === EditActions.DRAG_SHAPE_FINISH)) {
                this.cameraService.enableInputs(true);
                return;
            }
            const update = {
                id,
                center: this.getCenterPosition(id),
                radiusPoint: this.getRadiusPosition(id),
                startDragPosition,
                endDragPosition,
                editMode: EditModes.EDIT,
                editAction,
            };
            this.updateSubject.next(update);
            editSubject.next({
                ...update,
                ...this.getCircleProperties(id),
            });
        });
        if (shapeDragRegistration) {
            shapeDragRegistration
                .pipe(tap(({ movement: { drop } }) => this.cameraService.enableInputs(drop)))
                .subscribe(({ movement: { startPosition, endPosition, drop } }) => {
                const startDragPosition = this.coordinateConverter.screenToCartesian3(startPosition);
                const endDragPosition = this.coordinateConverter.screenToCartesian3(endPosition);
                if (!endDragPosition || !startDragPosition) {
                    return;
                }
                const update = {
                    id,
                    center: this.getCenterPosition(id),
                    radiusPoint: this.getRadiusPosition(id),
                    startDragPosition,
                    endDragPosition,
                    editMode: EditModes.EDIT,
                    editAction: drop ? EditActions.DRAG_SHAPE_FINISH : EditActions.DRAG_SHAPE,
                };
                this.updateSubject.next(update);
                editSubject.next({
                    ...update,
                    ...this.getCircleProperties(id),
                });
            });
        }
        const observables = [pointDragRegistration];
        if (shapeDragRegistration) {
            observables.push(shapeDragRegistration);
        }
        this.observablesMap.set(id, observables);
        return editObservable || this.createEditorObservable(editSubject, id);
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
                center: this.getCenterPosition(id),
                radiusPoint: this.getRadiusPosition(id),
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.DISPOSE,
            });
        };
        observableToExtend.enable = () => {
            this.updateSubject.next({
                id,
                center: this.getCenterPosition(id),
                radiusPoint: this.getRadiusPosition(id),
                editMode: EditModes.EDIT,
                editAction: EditActions.ENABLE,
            });
        };
        observableToExtend.disable = () => {
            this.updateSubject.next({
                id,
                center: this.getCenterPosition(id),
                radiusPoint: this.getRadiusPosition(id),
                editMode: EditModes.EDIT,
                editAction: EditActions.DISABLE,
            });
        };
        observableToExtend.setManually = (center, radius, centerPointProp, radiusPointProp, circleProp) => {
            const radiusPoint = GeoUtilsService.pointByLocationDistanceAndAzimuth(center, radius, Math.PI / 2, true);
            const circle = this.circlesManager.get(id);
            circle.setManually(center, radiusPoint, centerPointProp, radiusPointProp, circleProp);
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
                throw new Error('Circles editor error edit(): cannot call finishCreation() on edit');
            }
            return finishCreation(null);
        };
        observableToExtend.getEditValue = () => observableToExtend.getValue();
        observableToExtend.getLabels = () => this.circlesManager.get(id).labels;
        observableToExtend.getCenter = () => this.getCenterPosition(id);
        observableToExtend.getRadius = () => this.getRadius(id);
        return observableToExtend;
    }
    setOptions(options) {
        const defaultClone = JSON.parse(JSON.stringify(DEFAULT_CIRCLE_OPTIONS));
        const circleOptions = Object.assign(defaultClone, options);
        circleOptions.pointProps = Object.assign({}, DEFAULT_CIRCLE_OPTIONS.pointProps, options.pointProps);
        circleOptions.circleProps = Object.assign({}, DEFAULT_CIRCLE_OPTIONS.circleProps, options.circleProps);
        circleOptions.polylineProps = Object.assign({}, DEFAULT_CIRCLE_OPTIONS.polylineProps, options.polylineProps);
        return circleOptions;
    }
    getCenterPosition(id) {
        return this.circlesManager.get(id).getCenter();
    }
    getCenterPoint(id) {
        return this.circlesManager.get(id).center;
    }
    getRadiusPosition(id) {
        return this.circlesManager.get(id).getRadiusPoint();
    }
    getRadius(id) {
        return this.circlesManager.get(id).getRadius();
    }
    getCircleProperties(id) {
        const circle = this.circlesManager.get(id);
        return {
            center: circle.getCenter(),
            radiusPoint: circle.getRadiusPoint(),
            radius: circle.getRadius(),
        };
    }
}
CirclesEditorService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CirclesEditorService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
CirclesEditorService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CirclesEditorService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CirclesEditorService, decorators: [{
            type: Injectable
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2lyY2xlcy1lZGl0b3Iuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9saWIvYW5ndWxhci1jZXNpdW0td2lkZ2V0cy9zZXJ2aWNlcy9lbnRpdHktZWRpdG9ycy9jaXJjbGVzLWVkaXRvci9jaXJjbGVzLWVkaXRvci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLGVBQWUsRUFBYyxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDNUQsT0FBTyxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUM5QyxPQUFPLEVBQUUsS0FBSyxFQUFFLGtCQUFrQixFQUFFLFVBQVUsRUFBYyxNQUFNLFFBQVEsQ0FBQztBQUczRSxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0saUVBQWlFLENBQUM7QUFDbEcsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGtGQUFrRixDQUFDO0FBQy9HLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxpRkFBaUYsQ0FBQztBQU85RyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sbUNBQW1DLENBQUM7QUFDaEUsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBQzNELE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUN2RCxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0saUNBQWlDLENBQUM7QUFJakUsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGFBQWEsQ0FBQzs7QUFHMUMsTUFBTSxDQUFDLE1BQU0sc0JBQXNCLEdBQXNCO0lBQ3ZELGFBQWEsRUFBRSxXQUFXLENBQUMsVUFBVTtJQUNyQyxjQUFjLEVBQUUsV0FBVyxDQUFDLGVBQWU7SUFDM0MsY0FBYyxFQUFFLFdBQVcsQ0FBQyxlQUFlO0lBQzND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LENBQUMsU0FBUyxFQUFFLENBQUM7SUFDakQsQ0FBQztJQUVPLG1CQUFtQixDQUFDLEVBQVU7UUFDcEMsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDM0MsT0FBTztZQUNMLE1BQU0sRUFBRSxNQUFNLENBQUMsU0FBUyxFQUFFO1lBQzFCLFdBQVcsRUFBRSxNQUFNLENBQUMsY0FBYyxFQUFFO1lBQ3BDLE1BQU0sRUFBRSxNQUFNLENBQUMsU0FBUyxFQUFFO1NBQzNCLENBQUM7SUFDSixDQUFDOztpSEFoWlUsb0JBQW9CO3FIQUFwQixvQkFBb0I7MkZBQXBCLG9CQUFvQjtrQkFEaEMsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0LCBPYnNlcnZhYmxlLCBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IHB1Ymxpc2gsIHRhcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcclxuaW1wb3J0IHsgQ29sb3IsIENsYXNzaWZpY2F0aW9uVHlwZSwgU2hhZG93TW9kZSwgQ2FydGVzaWFuMyB9IGZyb20gJ2Nlc2l1bSc7XHJcbmltcG9ydCB7IENhbWVyYVNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9jYW1lcmEvY2FtZXJhLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBDb29yZGluYXRlQ29udmVydGVyIH0gZnJvbSAnLi4vLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvY29vcmRpbmF0ZS1jb252ZXJ0ZXIvY29vcmRpbmF0ZS1jb252ZXJ0ZXIuc2VydmljZSc7XHJcbmltcG9ydCB7IEdlb1V0aWxzU2VydmljZSB9IGZyb20gJy4uLy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2dlby11dGlscy9nZW8tdXRpbHMuc2VydmljZSc7XHJcbmltcG9ydCB7IENlc2l1bUV2ZW50IH0gZnJvbSAnLi4vLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvbWFwLWV2ZW50cy1tYW5hbmdlci9jb25zdHMvY2VzaXVtLWV2ZW50LmVudW0nO1xyXG5pbXBvcnQgeyBQaWNrT3B0aW9ucyB9IGZyb20gJy4uLy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL21hcC1ldmVudHMtbWFuYW5nZXIvY29uc3RzL3BpY2tPcHRpb25zLmVudW0nO1xyXG5pbXBvcnQgeyBEaXNwb3NhYmxlT2JzZXJ2YWJsZSB9IGZyb20gJy4uLy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL21hcC1ldmVudHMtbWFuYW5nZXIvZGlzcG9zYWJsZS1vYnNlcnZhYmxlJztcclxuaW1wb3J0IHsgTWFwRXZlbnRzTWFuYWdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9tYXAtZXZlbnRzLW1hbmFuZ2VyL21hcC1ldmVudHMtbWFuYWdlcic7XHJcbmltcG9ydCB7IEJhc2ljRWRpdFVwZGF0ZSB9IGZyb20gJy4uLy4uLy4uL21vZGVscy9iYXNpYy1lZGl0LXVwZGF0ZSc7XHJcbmltcG9ydCB7IENpcmNsZUVkaXRPcHRpb25zIH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL2NpcmNsZS1lZGl0LW9wdGlvbnMnO1xyXG5pbXBvcnQgeyBDaXJjbGVFZGl0VXBkYXRlIH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL2NpcmNsZS1lZGl0LXVwZGF0ZSc7XHJcbmltcG9ydCB7IENpcmNsZUVkaXRvck9ic2VydmFibGUgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvY2lyY2xlLWVkaXRvci1vYnNlcnZhYmxlJztcclxuaW1wb3J0IHsgRWRpdEFjdGlvbnMgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvZWRpdC1hY3Rpb25zLmVudW0nO1xyXG5pbXBvcnQgeyBFZGl0TW9kZXMgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvZWRpdC1tb2RlLmVudW0nO1xyXG5pbXBvcnQgeyBFZGl0UG9pbnQgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvZWRpdC1wb2ludCc7XHJcbmltcG9ydCB7IEVkaXRhYmxlQ2lyY2xlIH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL2VkaXRhYmxlLWNpcmNsZSc7XHJcbmltcG9ydCB7IEVsbGlwc2VQcm9wcyB9IGZyb20gJy4uLy4uLy4uL21vZGVscy9lbGxpcHNlLWVkaXQtb3B0aW9ucyc7XHJcbmltcG9ydCB7IExhYmVsUHJvcHMgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvbGFiZWwtcHJvcHMnO1xyXG5pbXBvcnQgeyBQb2ludFByb3BzIH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL3BvaW50LWVkaXQtb3B0aW9ucyc7XHJcbmltcG9ydCB7IGdlbmVyYXRlS2V5IH0gZnJvbSAnLi4vLi4vdXRpbHMnO1xyXG5pbXBvcnQgeyBDaXJjbGVzTWFuYWdlclNlcnZpY2UgfSBmcm9tICcuL2NpcmNsZXMtbWFuYWdlci5zZXJ2aWNlJztcclxuXHJcbmV4cG9ydCBjb25zdCBERUZBVUxUX0NJUkNMRV9PUFRJT05TOiBDaXJjbGVFZGl0T3B0aW9ucyA9IHtcclxuICBhZGRQb2ludEV2ZW50OiBDZXNpdW1FdmVudC5MRUZUX0NMSUNLLFxyXG4gIGRyYWdQb2ludEV2ZW50OiBDZXNpdW1FdmVudC5MRUZUX0NMSUNLX0RSQUcsXHJcbiAgZHJhZ1NoYXBlRXZlbnQ6IENlc2l1bUV2ZW50LkxFRlRfQ0xJQ0tfRFJBRyxcclxuICBhbGxvd0RyYWc6IHRydWUsXHJcbiAgY2lyY2xlUHJvcHM6IHtcclxuICAgIG1hdGVyaWFsOiBDb2xvci5DT1JORkxPV0VSQkxVRS53aXRoQWxwaGEoMC40KSxcclxuICAgIGZpbGw6IHRydWUsXHJcbiAgICBvdXRsaW5lOiBmYWxzZSxcclxuICAgIG91dGxpbmVXaWR0aDogMSxcclxuICAgIG91dGxpbmVDb2xvcjogQ29sb3IuV0hJVEUud2l0aEFscGhhKDAuOCksXHJcbiAgICBjbGFzc2lmaWNhdGlvblR5cGU6IENsYXNzaWZpY2F0aW9uVHlwZS5CT1RILFxyXG4gICAgekluZGV4OiAwLFxyXG4gICAgc2hhZG93czogU2hhZG93TW9kZS5ESVNBQkxFRCxcclxuICB9LFxyXG4gIHBvaW50UHJvcHM6IHtcclxuICAgIGNvbG9yOiBDb2xvci5XSElURSxcclxuICAgIG91dGxpbmVDb2xvcjogQ29sb3IuQkxBQ0sud2l0aEFscGhhKDAuMiksXHJcbiAgICBvdXRsaW5lV2lkdGg6IDEsXHJcbiAgICBwaXhlbFNpemU6IDEzLFxyXG4gICAgdmlydHVhbFBvaW50UGl4ZWxTaXplOiA4LFxyXG4gICAgc2hvdzogdHJ1ZSxcclxuICAgIHNob3dWaXJ0dWFsOiB0cnVlLFxyXG4gICAgZGlzYWJsZURlcHRoVGVzdERpc3RhbmNlOiBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFksXHJcbiAgfSxcclxuICBwb2x5bGluZVByb3BzOiB7XHJcbiAgICB3aWR0aDogMSxcclxuICAgIG1hdGVyaWFsOiAoKSA9PiBDb2xvci5XSElURS53aXRoQWxwaGEoMC44KSxcclxuICB9LFxyXG59O1xyXG5cclxuLyoqXHJcbiAqIFNlcnZpY2UgZm9yIGNyZWF0aW5nIGVkaXRhYmxlIGNpcmNsZXNcclxuICpcclxuICogWW91IG11c3QgcHJvdmlkZSBgQ2lyY2xlRWRpdG9yU2VydmljZWAgeW91cnNlbGYuXHJcbiAqIFBvbHlnb25zRWRpdG9yU2VydmljZSB3b3JrcyB0b2dldGhlciB3aXRoIGA8Y2lyY2xlLWVkaXRvcj5gIGNvbXBvbmVudC4gVGhlcmVmb3IgeW91IG5lZWQgdG8gY3JlYXRlIGA8Y2lyY2xlLWVkaXRvcj5gXHJcbiAqIGZvciBlYWNoIGBDaXJjbGVFZGl0b3JTZXJ2aWNlYCwgQW5kIG9mIGNvdXJzZSBzb21ld2hlcmUgdW5kZXIgYDxhYy1tYXA+YC9cclxuICpcclxuICogKyBgY3JlYXRlYCBmb3Igc3RhcnRpbmcgYSBjcmVhdGlvbiBvZiB0aGUgc2hhcGUgb3ZlciB0aGUgbWFwLiBSZXR1cm5zIGEgZXh0ZW5zaW9uIG9mIGBDaXJjbGVFZGl0b3JPYnNlcnZhYmxlYC5cclxuICogKyBgZWRpdGAgZm9yIGVkaXRpbmcgc2hhcGUgb3ZlciB0aGUgbWFwIHN0YXJ0aW5nIGZyb20gYSBnaXZlbiBwb3NpdGlvbnMuIFJldHVybnMgYW4gZXh0ZW5zaW9uIG9mIGBDaXJjbGVFZGl0b3JPYnNlcnZhYmxlYC5cclxuICogKyBUbyBzdG9wIGVkaXRpbmcgY2FsbCBgZHNpcG9zZSgpYCBmcm9tIHRoZSBgQ2lyY2xlRWRpdG9yT2JzZXJ2YWJsZWAgeW91IGdldCBiYWNrIGZyb20gYGNyZWF0ZSgpYCBcXCBgZWRpdCgpYC5cclxuICpcclxuICogKipMYWJlbHMgb3ZlciBlZGl0dGVkIHNoYXBlcyoqXHJcbiAqIEFuZ3VsYXIgQ2VzaXVtIGFsbG93cyB5b3UgdG8gZHJhdyBsYWJlbHMgb3ZlciBhIHNoYXBlIHRoYXQgaXMgYmVpbmcgZWRpdGVkIHdpdGggb25lIG9mIHRoZSBlZGl0b3JzLlxyXG4gKiBUbyBhZGQgbGFiZWwgZHJhd2luZyBsb2dpYyB0byB5b3VyIGVkaXRvciB1c2UgdGhlIGZ1bmN0aW9uIGBzZXRMYWJlbHNSZW5kZXJGbigpYCB0aGF0IGlzIGRlZmluZWQgb24gdGhlXHJcbiAqIGBDaXJjbGVFZGl0b3JPYnNlcnZhYmxlYCB0aGF0IGlzIHJldHVybmVkIGZyb20gY2FsbGluZyBgY3JlYXRlKClgIFxcIGBlZGl0KClgIG9mIG9uZSBvZiB0aGUgZWRpdG9yIHNlcnZpY2VzLlxyXG4gKiBgc2V0TGFiZWxzUmVuZGVyRm4oKWAgLSByZWNlaXZlcyBhIGNhbGxiYWNrIHRoYXQgaXMgY2FsbGVkIGV2ZXJ5IHRpbWUgdGhlIHNoYXBlIGlzIHJlZHJhd25cclxuICogKGV4Y2VwdCB3aGVuIHRoZSBzaGFwZSBpcyBiZWluZyBkcmFnZ2VkKS4gVGhlIGNhbGxiYWNrIGlzIGNhbGxlZCB3aXRoIHRoZSBsYXN0IHNoYXBlIHN0YXRlIGFuZCB3aXRoIGFuIGFycmF5IG9mIHRoZSBjdXJyZW50IGxhYmVscy5cclxuICogVGhlIGNhbGxiYWNrIHNob3VsZCByZXR1cm4gdHlwZSBgTGFiZWxQcm9wc1tdYC5cclxuICogWW91IGNhbiBhbHNvIHVzZSBgdXBkYXRlTGFiZWxzKClgIHRvIHBhc3MgYW4gYXJyYXkgb2YgbGFiZWxzIG9mIHR5cGUgYExhYmVsUHJvcHNbXWAgdG8gYmUgZHJhd24uXHJcbiAqXHJcbiAqIHVzYWdlOlxyXG4gKiBgYGB0eXBlc2NyaXB0XHJcbiAqICAvLyBTdGFydCBjcmVhdGluZyBjaXJjbGVcclxuICogIGNvbnN0IGVkaXRpbmckID0gY2lyY2xlc0VkaXRvclNlcnZpY2UuY3JlYXRlKCk7XHJcbiAqICB0aGlzLmVkaXRpbmckLnN1YnNjcmliZShlZGl0UmVzdWx0ID0+IHtcclxuICpcdFx0XHRcdGNvbnNvbGUubG9nKGVkaXRSZXN1bHQucG9zaXRpb25zKTtcclxuICpcdFx0fSk7XHJcbiAqXHJcbiAqICAvLyBPciBlZGl0IGNpcmNsZSBmcm9tIGV4aXN0aW5nIGNlbnRlciBwb2ludCBhbmQgcmFkaXVzXHJcbiAqICBjb25zdCBlZGl0aW5nJCA9IHRoaXMuY2lyY2xlc0VkaXRvclNlcnZpY2UuZWRpdChjZW50ZXIsIHJhZGl1cyk7XHJcbiAqXHJcbiAqIGBgYFxyXG4gKi9cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgQ2lyY2xlc0VkaXRvclNlcnZpY2Uge1xyXG4gIHByaXZhdGUgbWFwRXZlbnRzTWFuYWdlcjogTWFwRXZlbnRzTWFuYWdlclNlcnZpY2U7XHJcbiAgcHJpdmF0ZSB1cGRhdGVTdWJqZWN0ID0gbmV3IFN1YmplY3Q8Q2lyY2xlRWRpdFVwZGF0ZT4oKTtcclxuICBwcml2YXRlIHVwZGF0ZVB1Ymxpc2hlciA9IHB1Ymxpc2g8Q2lyY2xlRWRpdFVwZGF0ZT4oKSh0aGlzLnVwZGF0ZVN1YmplY3QpOyAvLyBUT0RPIG1heWJlIG5vdCBuZWVkZWRcclxuICBwcml2YXRlIGNvb3JkaW5hdGVDb252ZXJ0ZXI6IENvb3JkaW5hdGVDb252ZXJ0ZXI7XHJcbiAgcHJpdmF0ZSBjYW1lcmFTZXJ2aWNlOiBDYW1lcmFTZXJ2aWNlO1xyXG4gIHByaXZhdGUgY2lyY2xlc01hbmFnZXI6IENpcmNsZXNNYW5hZ2VyU2VydmljZTtcclxuICBwcml2YXRlIG9ic2VydmFibGVzTWFwID0gbmV3IE1hcDxzdHJpbmcsIERpc3Bvc2FibGVPYnNlcnZhYmxlPGFueT5bXT4oKTtcclxuXHJcbiAgaW5pdChcclxuICAgIG1hcEV2ZW50c01hbmFnZXI6IE1hcEV2ZW50c01hbmFnZXJTZXJ2aWNlLFxyXG4gICAgY29vcmRpbmF0ZUNvbnZlcnRlcjogQ29vcmRpbmF0ZUNvbnZlcnRlcixcclxuICAgIGNhbWVyYVNlcnZpY2U6IENhbWVyYVNlcnZpY2UsXHJcbiAgICBjaXJjbGVzTWFuYWdlcjogQ2lyY2xlc01hbmFnZXJTZXJ2aWNlLFxyXG4gICkge1xyXG4gICAgdGhpcy5tYXBFdmVudHNNYW5hZ2VyID0gbWFwRXZlbnRzTWFuYWdlcjtcclxuICAgIHRoaXMuY29vcmRpbmF0ZUNvbnZlcnRlciA9IGNvb3JkaW5hdGVDb252ZXJ0ZXI7XHJcbiAgICB0aGlzLmNhbWVyYVNlcnZpY2UgPSBjYW1lcmFTZXJ2aWNlO1xyXG4gICAgdGhpcy5jaXJjbGVzTWFuYWdlciA9IGNpcmNsZXNNYW5hZ2VyO1xyXG4gICAgdGhpcy51cGRhdGVQdWJsaXNoZXIuY29ubmVjdCgpO1xyXG4gIH1cclxuXHJcbiAgb25VcGRhdGUoKTogT2JzZXJ2YWJsZTxDaXJjbGVFZGl0VXBkYXRlPiB7XHJcbiAgICByZXR1cm4gdGhpcy51cGRhdGVQdWJsaXNoZXI7XHJcbiAgfVxyXG5cclxuICBjcmVhdGUob3B0aW9ucyA9IERFRkFVTFRfQ0lSQ0xFX09QVElPTlMsIHByaW9yaXR5ID0gMTAwKTogQ2lyY2xlRWRpdG9yT2JzZXJ2YWJsZSB7XHJcbiAgICBsZXQgY2VudGVyOiBhbnk7XHJcbiAgICBjb25zdCBpZCA9IGdlbmVyYXRlS2V5KCk7XHJcbiAgICBjb25zdCBjaXJjbGVPcHRpb25zID0gdGhpcy5zZXRPcHRpb25zKG9wdGlvbnMpO1xyXG4gICAgY29uc3QgY2xpZW50RWRpdFN1YmplY3QgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PENpcmNsZUVkaXRVcGRhdGU+KHtcclxuICAgICAgaWQsXHJcbiAgICAgIGVkaXRBY3Rpb246IG51bGwsXHJcbiAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuQ1JFQVRFLFxyXG4gICAgfSk7XHJcbiAgICBsZXQgZmluaXNoZWRDcmVhdGUgPSBmYWxzZTtcclxuXHJcbiAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dCh7XHJcbiAgICAgIGlkLFxyXG4gICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkNSRUFURSxcclxuICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuSU5JVCxcclxuICAgICAgY2lyY2xlT3B0aW9ucyxcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnN0IGZpbmlzaENyZWF0aW9uID0gKHBvc2l0aW9uOiBDYXJ0ZXNpYW4zKSA9PiB7XHJcbiAgICAgIGNvbnN0IHVwZGF0ZSA9IHtcclxuICAgICAgICBpZCxcclxuICAgICAgICBjZW50ZXIsXHJcbiAgICAgICAgcmFkaXVzUG9pbnQ6IHBvc2l0aW9uLFxyXG4gICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuQ1JFQVRFLFxyXG4gICAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLkFERF9MQVNUX1BPSU5ULFxyXG4gICAgICB9O1xyXG4gICAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dCh1cGRhdGUpO1xyXG4gICAgICBjbGllbnRFZGl0U3ViamVjdC5uZXh0KHtcclxuICAgICAgICAuLi51cGRhdGUsXHJcbiAgICAgICAgLi4udGhpcy5nZXRDaXJjbGVQcm9wZXJ0aWVzKGlkKSxcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBjb25zdCBjaGFuZ2VNb2RlID0ge1xyXG4gICAgICAgIGlkLFxyXG4gICAgICAgIGNlbnRlcixcclxuICAgICAgICByYWRpdXNQb2ludDogcG9zaXRpb24sXHJcbiAgICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5DUkVBVEUsXHJcbiAgICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuQ0hBTkdFX1RPX0VESVQsXHJcbiAgICAgIH07XHJcblxyXG4gICAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dChjaGFuZ2VNb2RlKTtcclxuICAgICAgY2xpZW50RWRpdFN1YmplY3QubmV4dCh7XHJcbiAgICAgICAgLi4udXBkYXRlLFxyXG4gICAgICAgIC4uLnRoaXMuZ2V0Q2lyY2xlUHJvcGVydGllcyhpZCksXHJcbiAgICAgIH0pO1xyXG4gICAgICBpZiAodGhpcy5vYnNlcnZhYmxlc01hcC5oYXMoaWQpKSB7XHJcbiAgICAgICAgdGhpcy5vYnNlcnZhYmxlc01hcC5nZXQoaWQpLmZvckVhY2gocmVnaXN0cmF0aW9uID0+IHJlZ2lzdHJhdGlvbi5kaXNwb3NlKCkpO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMub2JzZXJ2YWJsZXNNYXAuZGVsZXRlKGlkKTtcclxuICAgICAgdGhpcy5lZGl0Q2lyY2xlKGlkLCBwcmlvcml0eSwgY2xpZW50RWRpdFN1YmplY3QsIGNpcmNsZU9wdGlvbnMsIGVkaXRvck9ic2VydmFibGUpO1xyXG4gICAgICBmaW5pc2hlZENyZWF0ZSA9IHRydWU7XHJcbiAgICAgIHJldHVybiBmaW5pc2hlZENyZWF0ZTtcclxuICAgIH07XHJcblxyXG4gICAgY29uc3QgbW91c2VNb3ZlUmVnaXN0cmF0aW9uID0gdGhpcy5tYXBFdmVudHNNYW5hZ2VyLnJlZ2lzdGVyKHtcclxuICAgICAgZXZlbnQ6IENlc2l1bUV2ZW50Lk1PVVNFX01PVkUsXHJcbiAgICAgIHBpY2s6IFBpY2tPcHRpb25zLk5PX1BJQ0ssXHJcbiAgICAgIHBpY2tDb25maWc6IG9wdGlvbnMucGlja0NvbmZpZ3VyYXRpb24sXHJcbiAgICAgIHByaW9yaXR5LFxyXG4gICAgfSk7XHJcbiAgICBjb25zdCBhZGRQb2ludFJlZ2lzdHJhdGlvbiA9IHRoaXMubWFwRXZlbnRzTWFuYWdlci5yZWdpc3Rlcih7XHJcbiAgICAgIGV2ZW50OiBDZXNpdW1FdmVudC5MRUZUX0NMSUNLLFxyXG4gICAgICBwaWNrOiBQaWNrT3B0aW9ucy5OT19QSUNLLFxyXG4gICAgICBwaWNrQ29uZmlnOiBvcHRpb25zLnBpY2tDb25maWd1cmF0aW9uLFxyXG4gICAgICBwcmlvcml0eSxcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMub2JzZXJ2YWJsZXNNYXAuc2V0KGlkLCBbbW91c2VNb3ZlUmVnaXN0cmF0aW9uLCBhZGRQb2ludFJlZ2lzdHJhdGlvbl0pO1xyXG4gICAgY29uc3QgZWRpdG9yT2JzZXJ2YWJsZSA9IHRoaXMuY3JlYXRlRWRpdG9yT2JzZXJ2YWJsZShjbGllbnRFZGl0U3ViamVjdCwgaWQsIGZpbmlzaENyZWF0aW9uKTtcclxuXHJcbiAgICBhZGRQb2ludFJlZ2lzdHJhdGlvbi5zdWJzY3JpYmUoKHsgbW92ZW1lbnQ6IHsgZW5kUG9zaXRpb24gfSB9KSA9PiB7XHJcbiAgICAgIGlmIChmaW5pc2hlZENyZWF0ZSkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG4gICAgICBjb25zdCBwb3NpdGlvbiA9IHRoaXMuY29vcmRpbmF0ZUNvbnZlcnRlci5zY3JlZW5Ub0NhcnRlc2lhbjMoZW5kUG9zaXRpb24pO1xyXG4gICAgICBpZiAoIXBvc2l0aW9uKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoIWNlbnRlcikge1xyXG4gICAgICAgIGNvbnN0IHVwZGF0ZSA9IHtcclxuICAgICAgICAgIGlkLFxyXG4gICAgICAgICAgY2VudGVyOiBwb3NpdGlvbixcclxuICAgICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuQ1JFQVRFLFxyXG4gICAgICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuQUREX1BPSU5ULFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQodXBkYXRlKTtcclxuICAgICAgICBjbGllbnRFZGl0U3ViamVjdC5uZXh0KHtcclxuICAgICAgICAgIC4uLnVwZGF0ZSxcclxuICAgICAgICAgIC4uLnRoaXMuZ2V0Q2lyY2xlUHJvcGVydGllcyhpZCksXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgY2VudGVyID0gcG9zaXRpb247XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZmluaXNoZWRDcmVhdGUgPSBmaW5pc2hDcmVhdGlvbihwb3NpdGlvbik7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIG1vdXNlTW92ZVJlZ2lzdHJhdGlvbi5zdWJzY3JpYmUoKHsgbW92ZW1lbnQ6IHsgZW5kUG9zaXRpb24gfSB9KSA9PiB7XHJcbiAgICAgIGlmICghY2VudGVyKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICAgIGNvbnN0IHBvc2l0aW9uID0gdGhpcy5jb29yZGluYXRlQ29udmVydGVyLnNjcmVlblRvQ2FydGVzaWFuMyhlbmRQb3NpdGlvbik7XHJcblxyXG4gICAgICBpZiAocG9zaXRpb24pIHtcclxuICAgICAgICBjb25zdCB1cGRhdGUgPSB7XHJcbiAgICAgICAgICBpZCxcclxuICAgICAgICAgIGNlbnRlcixcclxuICAgICAgICAgIHJhZGl1c1BvaW50OiBwb3NpdGlvbixcclxuICAgICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuQ1JFQVRFLFxyXG4gICAgICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuTU9VU0VfTU9WRSxcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHVwZGF0ZSk7XHJcbiAgICAgICAgY2xpZW50RWRpdFN1YmplY3QubmV4dCh7XHJcbiAgICAgICAgICAuLi51cGRhdGUsXHJcbiAgICAgICAgICAuLi50aGlzLmdldENpcmNsZVByb3BlcnRpZXMoaWQpLFxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gZWRpdG9yT2JzZXJ2YWJsZTtcclxuICB9XHJcblxyXG4gIGVkaXQoY2VudGVyOiBDYXJ0ZXNpYW4zLCByYWRpdXM6IG51bWJlciwgb3B0aW9ucyA9IERFRkFVTFRfQ0lSQ0xFX09QVElPTlMsIHByaW9yaXR5ID0gMTAwKTogQ2lyY2xlRWRpdG9yT2JzZXJ2YWJsZSB7XHJcbiAgICBjb25zdCBpZCA9IGdlbmVyYXRlS2V5KCk7XHJcbiAgICBjb25zdCBjaXJjbGVPcHRpb25zID0gdGhpcy5zZXRPcHRpb25zKG9wdGlvbnMpO1xyXG4gICAgY29uc3QgZWRpdFN1YmplY3QgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PENpcmNsZUVkaXRVcGRhdGU+KHtcclxuICAgICAgaWQsXHJcbiAgICAgIGVkaXRBY3Rpb246IG51bGwsXHJcbiAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuRURJVCxcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnN0IHJhZGl1c1BvaW50OiBDYXJ0ZXNpYW4zID0gR2VvVXRpbHNTZXJ2aWNlLnBvaW50QnlMb2NhdGlvbkRpc3RhbmNlQW5kQXppbXV0aChjZW50ZXIsIHJhZGl1cywgTWF0aC5QSSAvIDIsIHRydWUpO1xyXG5cclxuICAgIGNvbnN0IHVwZGF0ZSA9IHtcclxuICAgICAgaWQsXHJcbiAgICAgIGNlbnRlcixcclxuICAgICAgcmFkaXVzUG9pbnQsXHJcbiAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuRURJVCxcclxuICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuSU5JVCxcclxuICAgICAgY2lyY2xlT3B0aW9ucyxcclxuICAgIH07XHJcbiAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dCh1cGRhdGUpO1xyXG4gICAgZWRpdFN1YmplY3QubmV4dCh7XHJcbiAgICAgIC4uLnVwZGF0ZSxcclxuICAgICAgLi4udGhpcy5nZXRDaXJjbGVQcm9wZXJ0aWVzKGlkKSxcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiB0aGlzLmVkaXRDaXJjbGUoaWQsIHByaW9yaXR5LCBlZGl0U3ViamVjdCwgY2lyY2xlT3B0aW9ucyk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGVkaXRDaXJjbGUoXHJcbiAgICBpZDogc3RyaW5nLFxyXG4gICAgcHJpb3JpdHk6IG51bWJlcixcclxuICAgIGVkaXRTdWJqZWN0OiBTdWJqZWN0PENpcmNsZUVkaXRVcGRhdGU+LFxyXG4gICAgb3B0aW9uczogQ2lyY2xlRWRpdE9wdGlvbnMsXHJcbiAgICBlZGl0T2JzZXJ2YWJsZT86IENpcmNsZUVkaXRvck9ic2VydmFibGUsXHJcbiAgKTogQ2lyY2xlRWRpdG9yT2JzZXJ2YWJsZSB7XHJcbiAgICBjb25zdCBwb2ludERyYWdSZWdpc3RyYXRpb24gPSB0aGlzLm1hcEV2ZW50c01hbmFnZXIucmVnaXN0ZXIoe1xyXG4gICAgICBldmVudDogQ2VzaXVtRXZlbnQuTEVGVF9DTElDS19EUkFHLFxyXG4gICAgICBlbnRpdHlUeXBlOiBFZGl0UG9pbnQsXHJcbiAgICAgIHBpY2tDb25maWc6IG9wdGlvbnMucGlja0NvbmZpZ3VyYXRpb24sXHJcbiAgICAgIHBpY2s6IFBpY2tPcHRpb25zLlBJQ0tfRklSU1QsXHJcbiAgICAgIHByaW9yaXR5LFxyXG4gICAgICBwaWNrRmlsdGVyOiBlbnRpdHkgPT4gaWQgPT09IGVudGl0eS5lZGl0ZWRFbnRpdHlJZCxcclxuICAgIH0pO1xyXG5cclxuICAgIGxldCBzaGFwZURyYWdSZWdpc3RyYXRpb247XHJcbiAgICBpZiAob3B0aW9ucy5hbGxvd0RyYWcpIHtcclxuICAgICAgc2hhcGVEcmFnUmVnaXN0cmF0aW9uID0gdGhpcy5tYXBFdmVudHNNYW5hZ2VyLnJlZ2lzdGVyKHtcclxuICAgICAgICBldmVudDogQ2VzaXVtRXZlbnQuTEVGVF9DTElDS19EUkFHLFxyXG4gICAgICAgIGVudGl0eVR5cGU6IEVkaXRhYmxlQ2lyY2xlLFxyXG4gICAgICAgIHBpY2tDb25maWc6IG9wdGlvbnMucGlja0NvbmZpZ3VyYXRpb24sXHJcbiAgICAgICAgcGljazogUGlja09wdGlvbnMuUElDS19GSVJTVCxcclxuICAgICAgICBwcmlvcml0eTogcHJpb3JpdHksXHJcbiAgICAgICAgcGlja0ZpbHRlcjogZW50aXR5ID0+IGlkID09PSBlbnRpdHkuaWQsXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHBvaW50RHJhZ1JlZ2lzdHJhdGlvblxyXG4gICAgICAucGlwZSh0YXAoKHsgbW92ZW1lbnQ6IHsgZHJvcCB9IH0pID0+IHRoaXMuY2FtZXJhU2VydmljZS5lbmFibGVJbnB1dHMoZHJvcCkpKVxyXG4gICAgICAuc3Vic2NyaWJlKCh7IG1vdmVtZW50OiB7IGVuZFBvc2l0aW9uLCBzdGFydFBvc2l0aW9uLCBkcm9wIH0sIGVudGl0aWVzIH0pID0+IHtcclxuICAgICAgICBjb25zdCBzdGFydERyYWdQb3NpdGlvbiA9IHRoaXMuY29vcmRpbmF0ZUNvbnZlcnRlci5zY3JlZW5Ub0NhcnRlc2lhbjMoc3RhcnRQb3NpdGlvbik7XHJcbiAgICAgICAgY29uc3QgZW5kRHJhZ1Bvc2l0aW9uID0gdGhpcy5jb29yZGluYXRlQ29udmVydGVyLnNjcmVlblRvQ2FydGVzaWFuMyhlbmRQb3NpdGlvbik7XHJcbiAgICAgICAgaWYgKCFlbmREcmFnUG9zaXRpb24pIHtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHBvaW50OiBFZGl0UG9pbnQgPSBlbnRpdGllc1swXTtcclxuICAgICAgICBjb25zdCBwb2ludElzQ2VudGVyID0gcG9pbnQgPT09IHRoaXMuZ2V0Q2VudGVyUG9pbnQoaWQpO1xyXG4gICAgICAgIGxldCBlZGl0QWN0aW9uO1xyXG4gICAgICAgIGlmIChkcm9wKSB7XHJcbiAgICAgICAgICBlZGl0QWN0aW9uID0gcG9pbnRJc0NlbnRlciA/IEVkaXRBY3Rpb25zLkRSQUdfU0hBUEVfRklOSVNIIDogRWRpdEFjdGlvbnMuRFJBR19QT0lOVF9GSU5JU0g7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGVkaXRBY3Rpb24gPSBwb2ludElzQ2VudGVyID8gRWRpdEFjdGlvbnMuRFJBR19TSEFQRSA6IEVkaXRBY3Rpb25zLkRSQUdfUE9JTlQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIW9wdGlvbnMuYWxsb3dEcmFnICYmIChlZGl0QWN0aW9uID09PSBFZGl0QWN0aW9ucy5EUkFHX1NIQVBFIHx8IGVkaXRBY3Rpb24gPT09IEVkaXRBY3Rpb25zLkRSQUdfU0hBUEVfRklOSVNIKSkge1xyXG4gICAgICAgICAgdGhpcy5jYW1lcmFTZXJ2aWNlLmVuYWJsZUlucHV0cyh0cnVlKTtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHVwZGF0ZSA9IHtcclxuICAgICAgICAgIGlkLFxyXG4gICAgICAgICAgY2VudGVyOiB0aGlzLmdldENlbnRlclBvc2l0aW9uKGlkKSxcclxuICAgICAgICAgIHJhZGl1c1BvaW50OiB0aGlzLmdldFJhZGl1c1Bvc2l0aW9uKGlkKSxcclxuICAgICAgICAgIHN0YXJ0RHJhZ1Bvc2l0aW9uLFxyXG4gICAgICAgICAgZW5kRHJhZ1Bvc2l0aW9uLFxyXG4gICAgICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5FRElULFxyXG4gICAgICAgICAgZWRpdEFjdGlvbixcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHVwZGF0ZSk7XHJcbiAgICAgICAgZWRpdFN1YmplY3QubmV4dCh7XHJcbiAgICAgICAgICAuLi51cGRhdGUsXHJcbiAgICAgICAgICAuLi50aGlzLmdldENpcmNsZVByb3BlcnRpZXMoaWQpLFxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICBpZiAoc2hhcGVEcmFnUmVnaXN0cmF0aW9uKSB7XHJcbiAgICAgIHNoYXBlRHJhZ1JlZ2lzdHJhdGlvblxyXG4gICAgICAgIC5waXBlKHRhcCgoeyBtb3ZlbWVudDogeyBkcm9wIH0gfSkgPT4gdGhpcy5jYW1lcmFTZXJ2aWNlLmVuYWJsZUlucHV0cyhkcm9wKSkpXHJcbiAgICAgICAgLnN1YnNjcmliZSgoeyBtb3ZlbWVudDogeyBzdGFydFBvc2l0aW9uLCBlbmRQb3NpdGlvbiwgZHJvcCB9IH0pID0+IHtcclxuICAgICAgICAgIGNvbnN0IHN0YXJ0RHJhZ1Bvc2l0aW9uID0gdGhpcy5jb29yZGluYXRlQ29udmVydGVyLnNjcmVlblRvQ2FydGVzaWFuMyhzdGFydFBvc2l0aW9uKTtcclxuICAgICAgICAgIGNvbnN0IGVuZERyYWdQb3NpdGlvbiA9IHRoaXMuY29vcmRpbmF0ZUNvbnZlcnRlci5zY3JlZW5Ub0NhcnRlc2lhbjMoZW5kUG9zaXRpb24pO1xyXG4gICAgICAgICAgaWYgKCFlbmREcmFnUG9zaXRpb24gfHwgIXN0YXJ0RHJhZ1Bvc2l0aW9uKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBjb25zdCB1cGRhdGUgPSB7XHJcbiAgICAgICAgICAgIGlkLFxyXG4gICAgICAgICAgICBjZW50ZXI6IHRoaXMuZ2V0Q2VudGVyUG9zaXRpb24oaWQpLFxyXG4gICAgICAgICAgICByYWRpdXNQb2ludDogdGhpcy5nZXRSYWRpdXNQb3NpdGlvbihpZCksXHJcbiAgICAgICAgICAgIHN0YXJ0RHJhZ1Bvc2l0aW9uLFxyXG4gICAgICAgICAgICBlbmREcmFnUG9zaXRpb24sXHJcbiAgICAgICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuRURJVCxcclxuICAgICAgICAgICAgZWRpdEFjdGlvbjogZHJvcCA/IEVkaXRBY3Rpb25zLkRSQUdfU0hBUEVfRklOSVNIIDogRWRpdEFjdGlvbnMuRFJBR19TSEFQRSxcclxuICAgICAgICAgIH07XHJcbiAgICAgICAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dCh1cGRhdGUpO1xyXG4gICAgICAgICAgZWRpdFN1YmplY3QubmV4dCh7XHJcbiAgICAgICAgICAgIC4uLnVwZGF0ZSxcclxuICAgICAgICAgICAgLi4udGhpcy5nZXRDaXJjbGVQcm9wZXJ0aWVzKGlkKSxcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IG9ic2VydmFibGVzID0gW3BvaW50RHJhZ1JlZ2lzdHJhdGlvbl07XHJcbiAgICBpZiAoc2hhcGVEcmFnUmVnaXN0cmF0aW9uKSB7XHJcbiAgICAgIG9ic2VydmFibGVzLnB1c2goc2hhcGVEcmFnUmVnaXN0cmF0aW9uKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLm9ic2VydmFibGVzTWFwLnNldChpZCwgb2JzZXJ2YWJsZXMpO1xyXG4gICAgcmV0dXJuIGVkaXRPYnNlcnZhYmxlIHx8IHRoaXMuY3JlYXRlRWRpdG9yT2JzZXJ2YWJsZShlZGl0U3ViamVjdCwgaWQpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBjcmVhdGVFZGl0b3JPYnNlcnZhYmxlKG9ic2VydmFibGVUb0V4dGVuZDogYW55LCBpZDogc3RyaW5nLCBmaW5pc2hDcmVhdGlvbj86IChwb3NpdGlvbjogQ2FydGVzaWFuMykgPT4gYm9vbGVhbilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IENpcmNsZUVkaXRvck9ic2VydmFibGUge1xyXG4gICAgb2JzZXJ2YWJsZVRvRXh0ZW5kLmRpc3Bvc2UgPSAoKSA9PiB7XHJcbiAgICAgIGNvbnN0IG9ic2VydmFibGVzID0gdGhpcy5vYnNlcnZhYmxlc01hcC5nZXQoaWQpO1xyXG4gICAgICBpZiAob2JzZXJ2YWJsZXMpIHtcclxuICAgICAgICBvYnNlcnZhYmxlcy5mb3JFYWNoKG9icyA9PiBvYnMuZGlzcG9zZSgpKTtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLm9ic2VydmFibGVzTWFwLmRlbGV0ZShpZCk7XHJcbiAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHtcclxuICAgICAgICBpZCxcclxuICAgICAgICBjZW50ZXI6IHRoaXMuZ2V0Q2VudGVyUG9zaXRpb24oaWQpLFxyXG4gICAgICAgIHJhZGl1c1BvaW50OiB0aGlzLmdldFJhZGl1c1Bvc2l0aW9uKGlkKSxcclxuICAgICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkNSRUFURV9PUl9FRElULFxyXG4gICAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLkRJU1BPU0UsXHJcbiAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICBvYnNlcnZhYmxlVG9FeHRlbmQuZW5hYmxlID0gKCkgPT4ge1xyXG4gICAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dCh7XHJcbiAgICAgICAgaWQsXHJcbiAgICAgICAgY2VudGVyOiB0aGlzLmdldENlbnRlclBvc2l0aW9uKGlkKSxcclxuICAgICAgICByYWRpdXNQb2ludDogdGhpcy5nZXRSYWRpdXNQb3NpdGlvbihpZCksXHJcbiAgICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5FRElULFxyXG4gICAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLkVOQUJMRSxcclxuICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIG9ic2VydmFibGVUb0V4dGVuZC5kaXNhYmxlID0gKCkgPT4ge1xyXG4gICAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dCh7XHJcbiAgICAgICAgaWQsXHJcbiAgICAgICAgY2VudGVyOiB0aGlzLmdldENlbnRlclBvc2l0aW9uKGlkKSxcclxuICAgICAgICByYWRpdXNQb2ludDogdGhpcy5nZXRSYWRpdXNQb3NpdGlvbihpZCksXHJcbiAgICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5FRElULFxyXG4gICAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLkRJU0FCTEUsXHJcbiAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICBvYnNlcnZhYmxlVG9FeHRlbmQuc2V0TWFudWFsbHkgPSAoXHJcbiAgICAgIGNlbnRlcjogQ2FydGVzaWFuMyxcclxuICAgICAgcmFkaXVzOiBudW1iZXIsXHJcbiAgICAgIGNlbnRlclBvaW50UHJvcD86IFBvaW50UHJvcHMsXHJcbiAgICAgIHJhZGl1c1BvaW50UHJvcD86IFBvaW50UHJvcHMsXHJcbiAgICAgIGNpcmNsZVByb3A/OiBFbGxpcHNlUHJvcHMsXHJcbiAgICApID0+IHtcclxuICAgICAgY29uc3QgcmFkaXVzUG9pbnQgPSBHZW9VdGlsc1NlcnZpY2UucG9pbnRCeUxvY2F0aW9uRGlzdGFuY2VBbmRBemltdXRoKGNlbnRlciwgcmFkaXVzLCBNYXRoLlBJIC8gMiwgdHJ1ZSk7XHJcbiAgICAgIGNvbnN0IGNpcmNsZSA9IHRoaXMuY2lyY2xlc01hbmFnZXIuZ2V0KGlkKTtcclxuICAgICAgY2lyY2xlLnNldE1hbnVhbGx5KGNlbnRlciwgcmFkaXVzUG9pbnQsIGNlbnRlclBvaW50UHJvcCwgcmFkaXVzUG9pbnRQcm9wLCBjaXJjbGVQcm9wKTtcclxuICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQoe1xyXG4gICAgICAgIGlkLFxyXG4gICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuQ1JFQVRFX09SX0VESVQsXHJcbiAgICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuU0VUX01BTlVBTExZLFxyXG4gICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgb2JzZXJ2YWJsZVRvRXh0ZW5kLnNldExhYmVsc1JlbmRlckZuID0gKGNhbGxiYWNrOiAodXBkYXRlOiBCYXNpY0VkaXRVcGRhdGU8YW55PiwgbGFiZWxzOiBMYWJlbFByb3BzW10pID0+IExhYmVsUHJvcHNbXSkgPT4ge1xyXG4gICAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dCh7XHJcbiAgICAgICAgaWQsXHJcbiAgICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5DUkVBVEVfT1JfRURJVCxcclxuICAgICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5TRVRfRURJVF9MQUJFTFNfUkVOREVSX0NBTExCQUNLLFxyXG4gICAgICAgIGxhYmVsc1JlbmRlckZuOiBjYWxsYmFjayxcclxuICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIG9ic2VydmFibGVUb0V4dGVuZC51cGRhdGVMYWJlbHMgPSAobGFiZWxzOiBMYWJlbFByb3BzW10pID0+IHtcclxuICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQoe1xyXG4gICAgICAgIGlkLFxyXG4gICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuQ1JFQVRFX09SX0VESVQsXHJcbiAgICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuVVBEQVRFX0VESVRfTEFCRUxTLFxyXG4gICAgICAgIHVwZGF0ZUxhYmVsczogbGFiZWxzLFxyXG4gICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgb2JzZXJ2YWJsZVRvRXh0ZW5kLmZpbmlzaENyZWF0aW9uID0gKCkgPT4ge1xyXG4gICAgICBpZiAoIWZpbmlzaENyZWF0aW9uKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDaXJjbGVzIGVkaXRvciBlcnJvciBlZGl0KCk6IGNhbm5vdCBjYWxsIGZpbmlzaENyZWF0aW9uKCkgb24gZWRpdCcpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gZmluaXNoQ3JlYXRpb24obnVsbCk7XHJcbiAgICB9O1xyXG5cclxuICAgIG9ic2VydmFibGVUb0V4dGVuZC5nZXRFZGl0VmFsdWUgPSAoKSA9PiBvYnNlcnZhYmxlVG9FeHRlbmQuZ2V0VmFsdWUoKTtcclxuXHJcbiAgICBvYnNlcnZhYmxlVG9FeHRlbmQuZ2V0TGFiZWxzID0gKCk6IExhYmVsUHJvcHNbXSA9PiB0aGlzLmNpcmNsZXNNYW5hZ2VyLmdldChpZCkubGFiZWxzO1xyXG4gICAgb2JzZXJ2YWJsZVRvRXh0ZW5kLmdldENlbnRlciA9ICgpOiBDYXJ0ZXNpYW4zID0+IHRoaXMuZ2V0Q2VudGVyUG9zaXRpb24oaWQpO1xyXG4gICAgb2JzZXJ2YWJsZVRvRXh0ZW5kLmdldFJhZGl1cyA9ICgpOiBudW1iZXIgPT4gdGhpcy5nZXRSYWRpdXMoaWQpO1xyXG5cclxuICAgIHJldHVybiBvYnNlcnZhYmxlVG9FeHRlbmQgYXMgQ2lyY2xlRWRpdG9yT2JzZXJ2YWJsZTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgc2V0T3B0aW9ucyhvcHRpb25zOiBDaXJjbGVFZGl0T3B0aW9ucyk6IENpcmNsZUVkaXRPcHRpb25zIHtcclxuICAgIGNvbnN0IGRlZmF1bHRDbG9uZSA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoREVGQVVMVF9DSVJDTEVfT1BUSU9OUykpO1xyXG4gICAgY29uc3QgY2lyY2xlT3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oZGVmYXVsdENsb25lLCBvcHRpb25zKTtcclxuICAgIGNpcmNsZU9wdGlvbnMucG9pbnRQcm9wcyA9IE9iamVjdC5hc3NpZ24oe30sIERFRkFVTFRfQ0lSQ0xFX09QVElPTlMucG9pbnRQcm9wcywgb3B0aW9ucy5wb2ludFByb3BzKTtcclxuICAgIGNpcmNsZU9wdGlvbnMuY2lyY2xlUHJvcHMgPSBPYmplY3QuYXNzaWduKHt9LCBERUZBVUxUX0NJUkNMRV9PUFRJT05TLmNpcmNsZVByb3BzLCBvcHRpb25zLmNpcmNsZVByb3BzKTtcclxuICAgIGNpcmNsZU9wdGlvbnMucG9seWxpbmVQcm9wcyA9IE9iamVjdC5hc3NpZ24oe30sIERFRkFVTFRfQ0lSQ0xFX09QVElPTlMucG9seWxpbmVQcm9wcywgb3B0aW9ucy5wb2x5bGluZVByb3BzKTtcclxuICAgIHJldHVybiBjaXJjbGVPcHRpb25zO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBnZXRDZW50ZXJQb3NpdGlvbihpZDogc3RyaW5nKTogQ2FydGVzaWFuMyB7XHJcbiAgICByZXR1cm4gdGhpcy5jaXJjbGVzTWFuYWdlci5nZXQoaWQpLmdldENlbnRlcigpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBnZXRDZW50ZXJQb2ludChpZDogc3RyaW5nKTogRWRpdFBvaW50IHtcclxuICAgIHJldHVybiB0aGlzLmNpcmNsZXNNYW5hZ2VyLmdldChpZCkuY2VudGVyO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBnZXRSYWRpdXNQb3NpdGlvbihpZDogc3RyaW5nKTogQ2FydGVzaWFuMyB7XHJcbiAgICByZXR1cm4gdGhpcy5jaXJjbGVzTWFuYWdlci5nZXQoaWQpLmdldFJhZGl1c1BvaW50KCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGdldFJhZGl1cyhpZDogc3RyaW5nKTogbnVtYmVyIHtcclxuICAgIHJldHVybiB0aGlzLmNpcmNsZXNNYW5hZ2VyLmdldChpZCkuZ2V0UmFkaXVzKCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGdldENpcmNsZVByb3BlcnRpZXMoaWQ6IHN0cmluZykge1xyXG4gICAgY29uc3QgY2lyY2xlID0gdGhpcy5jaXJjbGVzTWFuYWdlci5nZXQoaWQpO1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgY2VudGVyOiBjaXJjbGUuZ2V0Q2VudGVyKCksXHJcbiAgICAgIHJhZGl1c1BvaW50OiBjaXJjbGUuZ2V0UmFkaXVzUG9pbnQoKSxcclxuICAgICAgcmFkaXVzOiBjaXJjbGUuZ2V0UmFkaXVzKCksXHJcbiAgICB9O1xyXG4gIH1cclxufVxyXG4iXX0=