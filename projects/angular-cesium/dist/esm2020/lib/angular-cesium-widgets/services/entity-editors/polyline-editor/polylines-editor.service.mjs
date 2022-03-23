import { publish, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Color, ClassificationType, sampleTerrain, Cartographic, HeightReference } from 'cesium';
import { BehaviorSubject, Subject } from 'rxjs';
import { CesiumEvent } from '../../../../angular-cesium/services/map-events-mananger/consts/cesium-event.enum';
import { PickOptions } from '../../../../angular-cesium/services/map-events-mananger/consts/pickOptions.enum';
import { EditModes } from '../../../models/edit-mode.enum';
import { EditActions } from '../../../models/edit-actions.enum';
import { CoordinateConverter } from '../../../../angular-cesium/services/coordinate-converter/coordinate-converter.service';
import { EditPoint } from '../../../models/edit-point';
import { EditPolyline } from '../../../models';
import { debounce, generateKey } from '../../utils';
import { when } from 'when';
import * as i0 from "@angular/core";
export const DEFAULT_POLYLINE_OPTIONS = {
    addPointEvent: CesiumEvent.LEFT_CLICK,
    addLastPointEvent: CesiumEvent.LEFT_DOUBLE_CLICK,
    removePointEvent: CesiumEvent.RIGHT_CLICK,
    dragPointEvent: CesiumEvent.LEFT_CLICK_DRAG,
    dragShapeEvent: CesiumEvent.LEFT_CLICK_DRAG,
    allowDrag: true,
    pointProps: {
        color: Color.WHITE.withAlpha(0.95),
        outlineColor: Color.BLACK.withAlpha(0.5),
        outlineWidth: 1,
        pixelSize: 15,
        virtualPointPixelSize: 8,
        show: true,
        showVirtual: true,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
    },
    polylineProps: {
        material: () => Color.BLACK,
        width: 3,
        clampToGround: false,
        zIndex: 0,
        classificationType: ClassificationType.BOTH,
    },
    clampHeightTo3D: false,
    clampHeightTo3DOptions: {
        clampToTerrain: false,
        clampMostDetailed: true,
        clampToHeightPickWidth: 2,
    },
};
/**
 * Service for creating editable polylines
 *
 *  * You must provide `PolylineEditorService` yourself.
 * PolygonsEditorService works together with `<polylines-editor>` component. Therefor you need to create `<polylines-editor>`
 * for each `PolylineEditorService`, And of course somewhere under `<ac-map>`/
 *
 * + `create` for starting a creation of the shape over the map. Returns a extension of `PolylineEditorObservable`.
 * + `edit` for editing shape over the map starting from a given positions. Returns an extension of `PolylineEditorObservable`.
 * + To stop editing call `dsipose()` from the `PolylineEditorObservable` you get back from `create()` \ `edit()`.
 *
 * **Labels over editted shapes**
 * Angular Cesium allows you to draw labels over a shape that is being edited with one of the editors.
 * To add label drawing logic to your editor use the function `setLabelsRenderFn()` that is defined on the
 * `PolylineEditorObservable` that is returned from calling `create()` \ `edit()` of one of the editor services.
 * `setLabelsRenderFn()` - receives a callback that is called every time the shape is redrawn
 * (except when the shape is being dragged). The callback is called with the last shape state and with an array of the current labels.
 * The callback should return type `LabelProps[]`.
 * You can also use `updateLabels()` to pass an array of labels of type `LabelProps[]` to be drawn.
 *
 * usage:
 * ```typescript
 *  // Start creating polyline
 *  const editing$ = polylinesEditorService.create();
 *  this.editing$.subscribe(editResult => {
 *				console.log(editResult.positions);
 *		});
 *
 *  // Or edit polyline from existing polyline cartesian3 positions
 *  const editing$ = this.polylinesEditor.edit(initialPos);
 *
 * ```
 */
export class PolylinesEditorService {
    constructor() {
        this.updateSubject = new Subject();
        this.updatePublisher = publish()(this.updateSubject); // TODO maybe not needed
        this.observablesMap = new Map();
        this.clampPointsDebounced = debounce((id, clampHeightTo3D, clampHeightTo3DOptions) => {
            this.clampPoints(id, clampHeightTo3D, clampHeightTo3DOptions);
        }, 300);
    }
    init(mapEventsManager, coordinateConverter, cameraService, polylinesManager, cesiumViewer) {
        this.mapEventsManager = mapEventsManager;
        this.coordinateConverter = coordinateConverter;
        this.cameraService = cameraService;
        this.polylinesManager = polylinesManager;
        this.updatePublisher.connect();
        this.cesiumScene = cesiumViewer.getScene();
    }
    onUpdate() {
        return this.updatePublisher;
    }
    clampPoints(id, clampHeightTo3D, { clampToTerrain, clampMostDetailed, clampToHeightPickWidth }) {
        if (clampHeightTo3D && clampMostDetailed) {
            const polyline = this.polylinesManager.get(id);
            const points = polyline.getPoints();
            if (!clampToTerrain) {
                // 3dTiles
                points.forEach(point => {
                    point.setPosition(this.cesiumScene.clampToHeight(point.getPosition(), undefined, clampToHeightPickWidth));
                });
            }
            else {
                const cartographics = points.map(point => this.coordinateConverter.cartesian3ToCartographic(point.getPosition()));
                const promise = sampleTerrain(this.cesiumScene.terrainProvider, 11, cartographics);
                when(promise, function (updatedPositions) {
                    points.forEach((point, index) => {
                        point.setPosition(Cartographic.toCartesian(updatedPositions[index]));
                    });
                });
            }
        }
    }
    screenToPosition(cartesian2, clampHeightTo3D, { clampToHeightPickWidth, clampToTerrain }) {
        const cartesian3 = this.coordinateConverter.screenToCartesian3(cartesian2);
        // If cartesian3 is undefined then the point inst on the globe
        if (clampHeightTo3D && cartesian3) {
            const globePositionPick = () => {
                const ray = this.cameraService.getCamera().getPickRay(cartesian2);
                return this.cesiumScene.globe.pick(ray, this.cesiumScene);
            };
            // is terrain?
            if (clampToTerrain) {
                return globePositionPick();
            }
            else {
                const cartesian3PickPosition = this.cesiumScene.pickPosition(cartesian2);
                const latLon = CoordinateConverter.cartesian3ToLatLon(cartesian3PickPosition);
                if (latLon.height < 0) { // means nothing picked -> Validate it
                    return globePositionPick();
                }
                return this.cesiumScene.clampToHeight(cartesian3PickPosition, undefined, clampToHeightPickWidth);
            }
        }
        return cartesian3;
    }
    create(options = DEFAULT_POLYLINE_OPTIONS, eventPriority = 100) {
        const positions = [];
        const id = generateKey();
        const polylineOptions = this.setOptions(options);
        const clientEditSubject = new BehaviorSubject({
            id,
            editAction: null,
            editMode: EditModes.CREATE
        });
        let finishedCreate = false;
        this.updateSubject.next({
            id,
            positions,
            editMode: EditModes.CREATE,
            editAction: EditActions.INIT,
            polylineOptions: polylineOptions,
        });
        const finishCreation = (position) => {
            return this.switchToEditMode(id, position, clientEditSubject, positions, eventPriority, polylineOptions, editorObservable, finishedCreate);
        };
        const mouseMoveRegistration = this.mapEventsManager.register({
            event: CesiumEvent.MOUSE_MOVE,
            pick: PickOptions.NO_PICK,
            priority: eventPriority,
            pickConfig: options.pickConfiguration,
        });
        const addPointRegistration = this.mapEventsManager.register({
            event: polylineOptions.addPointEvent,
            modifier: polylineOptions.addPointModifier,
            pick: PickOptions.NO_PICK,
            priority: eventPriority,
            pickConfig: options.pickConfiguration,
        });
        const addLastPointRegistration = this.mapEventsManager.register({
            event: polylineOptions.addLastPointEvent,
            modifier: polylineOptions.addLastPointModifier,
            pick: PickOptions.NO_PICK,
            priority: eventPriority,
            pickConfig: options.pickConfiguration,
        });
        this.observablesMap.set(id, [mouseMoveRegistration, addPointRegistration, addLastPointRegistration]);
        const editorObservable = this.createEditorObservable(clientEditSubject, id, finishCreation);
        mouseMoveRegistration.subscribe(({ movement: { endPosition } }) => {
            const position = this.screenToPosition(endPosition, polylineOptions.clampHeightTo3D, polylineOptions.clampHeightTo3DOptions);
            if (position) {
                this.updateSubject.next({
                    id,
                    positions: this.getPositions(id),
                    editMode: EditModes.CREATE,
                    updatedPosition: position,
                    editAction: EditActions.MOUSE_MOVE,
                });
            }
        });
        addPointRegistration.subscribe(({ movement: { endPosition } }) => {
            if (finishedCreate) {
                return;
            }
            const position = this.screenToPosition(endPosition, polylineOptions.clampHeightTo3D, polylineOptions.clampHeightTo3DOptions);
            if (!position) {
                return;
            }
            const allPositions = this.getPositions(id);
            if (allPositions.find((cartesian) => cartesian.equals(position))) {
                return;
            }
            const updateValue = {
                id,
                positions: allPositions,
                editMode: EditModes.CREATE,
                updatedPosition: position,
                editAction: EditActions.ADD_POINT,
            };
            this.updateSubject.next(updateValue);
            clientEditSubject.next({
                ...updateValue,
                positions: this.getPositions(id),
                points: this.getPoints(id),
            });
            if (polylineOptions.maximumNumberOfPoints && allPositions.length + 1 === polylineOptions.maximumNumberOfPoints) {
                finishedCreate = finishCreation(position);
            }
        });
        addLastPointRegistration.subscribe(({ movement: { endPosition } }) => {
            const position = this.screenToPosition(endPosition, polylineOptions.clampHeightTo3D, polylineOptions.clampHeightTo3DOptions);
            if (!position) {
                return;
            }
            // Add last point to positions if not already added
            const allPositions = this.getPositions(id);
            if (!allPositions.find((cartesian) => cartesian.equals(position))) {
                const updateValue = {
                    id,
                    positions: allPositions,
                    editMode: EditModes.CREATE,
                    updatedPosition: position,
                    editAction: EditActions.ADD_POINT,
                };
                this.updateSubject.next(updateValue);
                clientEditSubject.next({
                    ...updateValue,
                    positions: this.getPositions(id),
                    points: this.getPoints(id),
                });
            }
            finishedCreate = finishCreation(position);
        });
        return editorObservable;
    }
    switchToEditMode(id, position, clientEditSubject, positions, eventPriority, polylineOptions, editorObservable, finishedCreate) {
        const update = {
            id,
            positions: this.getPositions(id),
            editMode: EditModes.CREATE,
            updatedPosition: position,
            editAction: EditActions.ADD_LAST_POINT,
        };
        this.updateSubject.next(update);
        clientEditSubject.next({
            ...update,
            positions: this.getPositions(id),
            points: this.getPoints(id),
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
        this.editPolyline(id, positions, eventPriority, clientEditSubject, polylineOptions, editorObservable);
        finishedCreate = true;
        return finishedCreate;
    }
    edit(positions, options = DEFAULT_POLYLINE_OPTIONS, priority = 100) {
        if (positions.length < 2) {
            throw new Error('Polylines editor error edit(): polyline should have at least 2 positions');
        }
        const id = generateKey();
        const polylineOptions = this.setOptions(options);
        const editSubject = new BehaviorSubject({
            id,
            editAction: null,
            editMode: EditModes.EDIT
        });
        const update = {
            id,
            positions: positions,
            editMode: EditModes.EDIT,
            editAction: EditActions.INIT,
            polylineOptions: polylineOptions,
        };
        this.updateSubject.next(update);
        editSubject.next({
            ...update,
            positions: this.getPositions(id),
            points: this.getPoints(id),
        });
        return this.editPolyline(id, positions, priority, editSubject, polylineOptions);
    }
    editPolyline(id, positions, priority, editSubject, options, editObservable) {
        this.clampPoints(id, options.clampHeightTo3D, options.clampHeightTo3DOptions);
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
        let shapeDragRegistration;
        if (options.allowDrag) {
            shapeDragRegistration = this.mapEventsManager.register({
                event: options.dragShapeEvent,
                entityType: EditPolyline,
                pick: PickOptions.PICK_FIRST,
                pickConfig: options.pickConfiguration,
                priority,
                pickFilter: entity => id === entity.editedEntityId,
            });
        }
        if (shapeDragRegistration) {
            shapeDragRegistration
                .pipe(tap(({ movement: { drop } }) => this.polylinesManager.get(id).enableEdit && this.cameraService.enableInputs(drop)))
                .subscribe(({ movement: { startPosition, endPosition, drop }, entities }) => {
                const endDragPosition = this.screenToPosition(endPosition, false, options.clampHeightTo3DOptions);
                const startDragPosition = this.screenToPosition(startPosition, false, options.clampHeightTo3DOptions);
                if (!endDragPosition) {
                    return;
                }
                const update = {
                    id,
                    positions: this.getPositions(id),
                    editMode: EditModes.EDIT,
                    updatedPosition: endDragPosition,
                    draggedPosition: startDragPosition,
                    editAction: drop ? EditActions.DRAG_SHAPE_FINISH : EditActions.DRAG_SHAPE,
                };
                this.updateSubject.next(update);
                editSubject.next({
                    ...update,
                    positions: this.getPositions(id),
                    points: this.getPoints(id),
                });
            });
        }
        pointDragRegistration.pipe(tap(({ movement: { drop } }) => this.polylinesManager.get(id).enableEdit && this.cameraService.enableInputs(drop)))
            .subscribe(({ movement: { endPosition, drop }, entities }) => {
            const position = this.screenToPosition(endPosition, options.clampHeightTo3D, options.clampHeightTo3DOptions);
            if (!position) {
                return;
            }
            const point = entities[0];
            const update = {
                id,
                positions: this.getPositions(id),
                editMode: EditModes.EDIT,
                updatedPosition: position,
                updatedPoint: point,
                editAction: drop ? EditActions.DRAG_POINT_FINISH : EditActions.DRAG_POINT,
            };
            this.updateSubject.next(update);
            editSubject.next({
                ...update,
                positions: this.getPositions(id),
                points: this.getPoints(id),
            });
            this.clampPointsDebounced(id, options.clampHeightTo3D, options.clampHeightTo3DOptions);
        });
        pointRemoveRegistration.subscribe(({ entities }) => {
            const point = entities[0];
            const allPositions = [...this.getPositions(id)];
            if (allPositions.length < 3) {
                return;
            }
            const index = allPositions.findIndex(position => point.getPosition().equals(position));
            if (index < 0) {
                return;
            }
            const update = {
                id,
                positions: allPositions,
                editMode: EditModes.EDIT,
                updatedPoint: point,
                editAction: EditActions.REMOVE_POINT,
            };
            this.updateSubject.next(update);
            editSubject.next({
                ...update,
                positions: this.getPositions(id),
                points: this.getPoints(id),
            });
            this.clampPoints(id, options.clampHeightTo3D, options.clampHeightTo3DOptions);
        });
        const observables = [pointDragRegistration, pointRemoveRegistration];
        if (shapeDragRegistration) {
            observables.push(shapeDragRegistration);
        }
        this.observablesMap.set(id, observables);
        return this.createEditorObservable(editSubject, id);
    }
    setOptions(options) {
        const defaultClone = JSON.parse(JSON.stringify(DEFAULT_POLYLINE_OPTIONS));
        const polylineOptions = Object.assign(defaultClone, options);
        polylineOptions.pointProps = { ...DEFAULT_POLYLINE_OPTIONS.pointProps, ...options.pointProps };
        polylineOptions.polylineProps = { ...DEFAULT_POLYLINE_OPTIONS.polylineProps, ...options.polylineProps };
        polylineOptions.clampHeightTo3DOptions = { ...DEFAULT_POLYLINE_OPTIONS.clampHeightTo3DOptions, ...options.clampHeightTo3DOptions };
        if (options.clampHeightTo3D) {
            if (!this.cesiumScene.pickPositionSupported || !this.cesiumScene.clampToHeightSupported) {
                throw new Error(`Cesium pickPosition and clampToHeight must be supported to use clampHeightTo3D`);
            }
            if (this.cesiumScene.pickTranslucentDepth) {
                console.warn(`Cesium scene.pickTranslucentDepth must be false in order to make the editors work properly on 3D`);
            }
            if (polylineOptions.pointProps.color.alpha === 1 || polylineOptions.pointProps.outlineColor.alpha === 1) {
                console.warn('Point color and outline color must have alpha in order to make the editor work properly on 3D');
            }
            polylineOptions.allowDrag = false;
            polylineOptions.polylineProps.clampToGround = true;
            polylineOptions.pointProps.heightReference = polylineOptions.clampHeightTo3DOptions.clampToTerrain ?
                HeightReference.CLAMP_TO_GROUND : HeightReference.RELATIVE_TO_GROUND;
            polylineOptions.pointProps.disableDepthTestDistance = Number.POSITIVE_INFINITY;
        }
        return polylineOptions;
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
                positions: this.getPositions(id),
                editMode: EditModes.EDIT,
                editAction: EditActions.ENABLE,
            });
        };
        observableToExtend.disable = () => {
            this.updateSubject.next({
                id,
                positions: this.getPositions(id),
                editMode: EditModes.EDIT,
                editAction: EditActions.DISABLE,
            });
        };
        observableToExtend.setManually = (points, polylineProps) => {
            const polyline = this.polylinesManager.get(id);
            polyline.setManually(points, polylineProps);
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
                throw new Error('Polylines editor error edit(): cannot call finishCreation() on edit');
            }
            return finishCreation(null);
        };
        observableToExtend.getCurrentPoints = () => this.getPoints(id);
        observableToExtend.getEditValue = () => observableToExtend.getValue();
        observableToExtend.getLabels = () => this.polylinesManager.get(id).labels;
        return observableToExtend;
    }
    getPositions(id) {
        const polyline = this.polylinesManager.get(id);
        return polyline.getRealPositions();
    }
    getPoints(id) {
        const polyline = this.polylinesManager.get(id);
        return polyline.getRealPoints();
    }
}
PolylinesEditorService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: PolylinesEditorService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
PolylinesEditorService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: PolylinesEditorService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: PolylinesEditorService, decorators: [{
            type: Injectable
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9seWxpbmVzLWVkaXRvci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2xpYi9hbmd1bGFyLWNlc2l1bS13aWRnZXRzL3NlcnZpY2VzL2VudGl0eS1lZGl0b3JzL3BvbHlsaW5lLWVkaXRvci9wb2x5bGluZXMtZWRpdG9yLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUM5QyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxLQUFLLEVBQUUsa0JBQWtCLEVBQUUsYUFBYSxFQUFFLFlBQVksRUFBRSxlQUFlLEVBQWMsTUFBTSxRQUFRLENBQUM7QUFFN0csT0FBTyxFQUFFLGVBQWUsRUFBYyxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDNUQsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGtGQUFrRixDQUFDO0FBQy9HLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxpRkFBaUYsQ0FBQztBQUM5RyxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFDM0QsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLG1DQUFtQyxDQUFDO0FBRWhFLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLHVGQUF1RixDQUFDO0FBQzVILE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQU92RCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFFL0MsT0FBTyxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFFcEQsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLE1BQU0sQ0FBQzs7QUFFNUIsTUFBTSxDQUFDLE1BQU0sd0JBQXdCLEdBQXdCO0lBQzNELGFBQWEsRUFBRSxXQUFX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LEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUMvQyxPQUFPLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO0lBQ3JDLENBQUM7SUFFTyxTQUFTLENBQUMsRUFBVTtRQUMxQixNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQy9DLE9BQU8sUUFBUSxDQUFDLGFBQWEsRUFBRSxDQUFDO0lBQ2xDLENBQUM7O21IQWpoQlUsc0JBQXNCO3VIQUF0QixzQkFBc0I7MkZBQXRCLHNCQUFzQjtrQkFEbEMsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHB1Ymxpc2gsIHRhcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBDb2xvciwgQ2xhc3NpZmljYXRpb25UeXBlLCBzYW1wbGVUZXJyYWluLCBDYXJ0b2dyYXBoaWMsIEhlaWdodFJlZmVyZW5jZSwgQ2FydGVzaWFuMyB9IGZyb20gJ2Nlc2l1bSc7XHJcbmltcG9ydCB7IE1hcEV2ZW50c01hbmFnZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvbWFwLWV2ZW50cy1tYW5hbmdlci9tYXAtZXZlbnRzLW1hbmFnZXInO1xyXG5pbXBvcnQgeyBCZWhhdmlvclN1YmplY3QsIE9ic2VydmFibGUsIFN1YmplY3QgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgQ2VzaXVtRXZlbnQgfSBmcm9tICcuLi8uLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9tYXAtZXZlbnRzLW1hbmFuZ2VyL2NvbnN0cy9jZXNpdW0tZXZlbnQuZW51bSc7XHJcbmltcG9ydCB7IFBpY2tPcHRpb25zIH0gZnJvbSAnLi4vLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvbWFwLWV2ZW50cy1tYW5hbmdlci9jb25zdHMvcGlja09wdGlvbnMuZW51bSc7XHJcbmltcG9ydCB7IEVkaXRNb2RlcyB9IGZyb20gJy4uLy4uLy4uL21vZGVscy9lZGl0LW1vZGUuZW51bSc7XHJcbmltcG9ydCB7IEVkaXRBY3Rpb25zIH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL2VkaXQtYWN0aW9ucy5lbnVtJztcclxuaW1wb3J0IHsgRGlzcG9zYWJsZU9ic2VydmFibGUgfSBmcm9tICcuLi8uLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9tYXAtZXZlbnRzLW1hbmFuZ2VyL2Rpc3Bvc2FibGUtb2JzZXJ2YWJsZSc7XHJcbmltcG9ydCB7IENvb3JkaW5hdGVDb252ZXJ0ZXIgfSBmcm9tICcuLi8uLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9jb29yZGluYXRlLWNvbnZlcnRlci9jb29yZGluYXRlLWNvbnZlcnRlci5zZXJ2aWNlJztcclxuaW1wb3J0IHsgRWRpdFBvaW50IH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL2VkaXQtcG9pbnQnO1xyXG5pbXBvcnQgeyBDYW1lcmFTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvY2FtZXJhL2NhbWVyYS5zZXJ2aWNlJztcclxuaW1wb3J0IHsgUG9seWxpbmVzTWFuYWdlclNlcnZpY2UgfSBmcm9tICcuL3BvbHlsaW5lcy1tYW5hZ2VyLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBDbGFtcFRvM0RPcHRpb25zLCBQb2x5bGluZUVkaXRPcHRpb25zLCBQb2x5bGluZVByb3BzIH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL3BvbHlsaW5lLWVkaXQtb3B0aW9ucyc7XHJcbmltcG9ydCB7IFBvaW50UHJvcHMgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvcG9pbnQtZWRpdC1vcHRpb25zJztcclxuaW1wb3J0IHsgUG9seWxpbmVFZGl0VXBkYXRlIH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL3BvbHlsaW5lLWVkaXQtdXBkYXRlJztcclxuaW1wb3J0IHsgUG9seWxpbmVFZGl0b3JPYnNlcnZhYmxlIH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL3BvbHlsaW5lLWVkaXRvci1vYnNlcnZhYmxlJztcclxuaW1wb3J0IHsgRWRpdFBvbHlsaW5lIH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzJztcclxuaW1wb3J0IHsgTGFiZWxQcm9wcyB9IGZyb20gJy4uLy4uLy4uL21vZGVscy9sYWJlbC1wcm9wcyc7XHJcbmltcG9ydCB7IGRlYm91bmNlLCBnZW5lcmF0ZUtleSB9IGZyb20gJy4uLy4uL3V0aWxzJztcclxuaW1wb3J0IHsgQ2VzaXVtU2VydmljZSB9IGZyb20gJy4uLy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtJztcclxuaW1wb3J0IHsgd2hlbiB9IGZyb20gJ3doZW4nO1xyXG5cclxuZXhwb3J0IGNvbnN0IERFRkFVTFRfUE9MWUxJTkVfT1BUSU9OUzogUG9seWxpbmVFZGl0T3B0aW9ucyA9IHtcclxuICBhZGRQb2ludEV2ZW50OiBDZXNpdW1FdmVudC5MRUZUX0NMSUNLLFxyXG4gIGFkZExhc3RQb2ludEV2ZW50OiBDZXNpdW1FdmVudC5MRUZUX0RPVUJMRV9DTElDSyxcclxuICByZW1vdmVQb2ludEV2ZW50OiBDZXNpdW1FdmVudC5SSUdIVF9DTElDSyxcclxuICBkcmFnUG9pbnRFdmVudDogQ2VzaXVtRXZlbnQuTEVGVF9DTElDS19EUkFHLFxyXG4gIGRyYWdTaGFwZUV2ZW50OiBDZXNpdW1FdmVudC5MRUZUX0NMSUNLX0RSQUcsXHJcbiAgYWxsb3dEcmFnOiB0cnVlLFxyXG4gIHBvaW50UHJvcHM6IHtcclxuICAgIGNvbG9yOiBDb2xvci5XSElURS53aXRoQWxwaGEoMC45NSksXHJcbiAgICBvdXRsaW5lQ29sb3I6IENvbG9yLkJMQUNLLndpdGhBbHBoYSgwLjUpLFxyXG4gICAgb3V0bGluZVdpZHRoOiAxLFxyXG4gICAgcGl4ZWxTaXplOiAxNSxcclxuICAgIHZpcnR1YWxQb2ludFBpeGVsU2l6ZTogOCxcclxuICAgIHNob3c6IHRydWUsXHJcbiAgICBzaG93VmlydHVhbDogdHJ1ZSxcclxuICAgIGRpc2FibGVEZXB0aFRlc3REaXN0YW5jZTogTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZLFxyXG4gIH0sXHJcbiAgcG9seWxpbmVQcm9wczoge1xyXG4gICAgbWF0ZXJpYWw6ICgpID0+IENvbG9yLkJMQUNLLFxyXG4gICAgd2lkdGg6IDMsXHJcbiAgICBjbGFtcFRvR3JvdW5kOiBmYWxzZSxcclxuICAgIHpJbmRleDogMCxcclxuICAgIGNsYXNzaWZpY2F0aW9uVHlwZTogQ2xhc3NpZmljYXRpb25UeXBlLkJPVEgsXHJcbiAgfSxcclxuICBjbGFtcEhlaWdodFRvM0Q6IGZhbHNlLFxyXG4gIGNsYW1wSGVpZ2h0VG8zRE9wdGlvbnM6IHtcclxuICAgIGNsYW1wVG9UZXJyYWluOiBmYWxzZSxcclxuICAgIGNsYW1wTW9zdERldGFpbGVkOiB0cnVlLFxyXG4gICAgY2xhbXBUb0hlaWdodFBpY2tXaWR0aDogMixcclxuICB9LFxyXG59O1xyXG5cclxuLyoqXHJcbiAqIFNlcnZpY2UgZm9yIGNyZWF0aW5nIGVkaXRhYmxlIHBvbHlsaW5lc1xyXG4gKlxyXG4gKiAgKiBZb3UgbXVzdCBwcm92aWRlIGBQb2x5bGluZUVkaXRvclNlcnZpY2VgIHlvdXJzZWxmLlxyXG4gKiBQb2x5Z29uc0VkaXRvclNlcnZpY2Ugd29ya3MgdG9nZXRoZXIgd2l0aCBgPHBvbHlsaW5lcy1lZGl0b3I+YCBjb21wb25lbnQuIFRoZXJlZm9yIHlvdSBuZWVkIHRvIGNyZWF0ZSBgPHBvbHlsaW5lcy1lZGl0b3I+YFxyXG4gKiBmb3IgZWFjaCBgUG9seWxpbmVFZGl0b3JTZXJ2aWNlYCwgQW5kIG9mIGNvdXJzZSBzb21ld2hlcmUgdW5kZXIgYDxhYy1tYXA+YC9cclxuICpcclxuICogKyBgY3JlYXRlYCBmb3Igc3RhcnRpbmcgYSBjcmVhdGlvbiBvZiB0aGUgc2hhcGUgb3ZlciB0aGUgbWFwLiBSZXR1cm5zIGEgZXh0ZW5zaW9uIG9mIGBQb2x5bGluZUVkaXRvck9ic2VydmFibGVgLlxyXG4gKiArIGBlZGl0YCBmb3IgZWRpdGluZyBzaGFwZSBvdmVyIHRoZSBtYXAgc3RhcnRpbmcgZnJvbSBhIGdpdmVuIHBvc2l0aW9ucy4gUmV0dXJucyBhbiBleHRlbnNpb24gb2YgYFBvbHlsaW5lRWRpdG9yT2JzZXJ2YWJsZWAuXHJcbiAqICsgVG8gc3RvcCBlZGl0aW5nIGNhbGwgYGRzaXBvc2UoKWAgZnJvbSB0aGUgYFBvbHlsaW5lRWRpdG9yT2JzZXJ2YWJsZWAgeW91IGdldCBiYWNrIGZyb20gYGNyZWF0ZSgpYCBcXCBgZWRpdCgpYC5cclxuICpcclxuICogKipMYWJlbHMgb3ZlciBlZGl0dGVkIHNoYXBlcyoqXHJcbiAqIEFuZ3VsYXIgQ2VzaXVtIGFsbG93cyB5b3UgdG8gZHJhdyBsYWJlbHMgb3ZlciBhIHNoYXBlIHRoYXQgaXMgYmVpbmcgZWRpdGVkIHdpdGggb25lIG9mIHRoZSBlZGl0b3JzLlxyXG4gKiBUbyBhZGQgbGFiZWwgZHJhd2luZyBsb2dpYyB0byB5b3VyIGVkaXRvciB1c2UgdGhlIGZ1bmN0aW9uIGBzZXRMYWJlbHNSZW5kZXJGbigpYCB0aGF0IGlzIGRlZmluZWQgb24gdGhlXHJcbiAqIGBQb2x5bGluZUVkaXRvck9ic2VydmFibGVgIHRoYXQgaXMgcmV0dXJuZWQgZnJvbSBjYWxsaW5nIGBjcmVhdGUoKWAgXFwgYGVkaXQoKWAgb2Ygb25lIG9mIHRoZSBlZGl0b3Igc2VydmljZXMuXHJcbiAqIGBzZXRMYWJlbHNSZW5kZXJGbigpYCAtIHJlY2VpdmVzIGEgY2FsbGJhY2sgdGhhdCBpcyBjYWxsZWQgZXZlcnkgdGltZSB0aGUgc2hhcGUgaXMgcmVkcmF3blxyXG4gKiAoZXhjZXB0IHdoZW4gdGhlIHNoYXBlIGlzIGJlaW5nIGRyYWdnZWQpLiBUaGUgY2FsbGJhY2sgaXMgY2FsbGVkIHdpdGggdGhlIGxhc3Qgc2hhcGUgc3RhdGUgYW5kIHdpdGggYW4gYXJyYXkgb2YgdGhlIGN1cnJlbnQgbGFiZWxzLlxyXG4gKiBUaGUgY2FsbGJhY2sgc2hvdWxkIHJldHVybiB0eXBlIGBMYWJlbFByb3BzW11gLlxyXG4gKiBZb3UgY2FuIGFsc28gdXNlIGB1cGRhdGVMYWJlbHMoKWAgdG8gcGFzcyBhbiBhcnJheSBvZiBsYWJlbHMgb2YgdHlwZSBgTGFiZWxQcm9wc1tdYCB0byBiZSBkcmF3bi5cclxuICpcclxuICogdXNhZ2U6XHJcbiAqIGBgYHR5cGVzY3JpcHRcclxuICogIC8vIFN0YXJ0IGNyZWF0aW5nIHBvbHlsaW5lXHJcbiAqICBjb25zdCBlZGl0aW5nJCA9IHBvbHlsaW5lc0VkaXRvclNlcnZpY2UuY3JlYXRlKCk7XHJcbiAqICB0aGlzLmVkaXRpbmckLnN1YnNjcmliZShlZGl0UmVzdWx0ID0+IHtcclxuICpcdFx0XHRcdGNvbnNvbGUubG9nKGVkaXRSZXN1bHQucG9zaXRpb25zKTtcclxuICpcdFx0fSk7XHJcbiAqXHJcbiAqICAvLyBPciBlZGl0IHBvbHlsaW5lIGZyb20gZXhpc3RpbmcgcG9seWxpbmUgY2FydGVzaWFuMyBwb3NpdGlvbnNcclxuICogIGNvbnN0IGVkaXRpbmckID0gdGhpcy5wb2x5bGluZXNFZGl0b3IuZWRpdChpbml0aWFsUG9zKTtcclxuICpcclxuICogYGBgXHJcbiAqL1xyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBQb2x5bGluZXNFZGl0b3JTZXJ2aWNlIHtcclxuICBwcml2YXRlIG1hcEV2ZW50c01hbmFnZXI6IE1hcEV2ZW50c01hbmFnZXJTZXJ2aWNlO1xyXG4gIHByaXZhdGUgdXBkYXRlU3ViamVjdCA9IG5ldyBTdWJqZWN0PFBvbHlsaW5lRWRpdFVwZGF0ZT4oKTtcclxuICBwcml2YXRlIHVwZGF0ZVB1Ymxpc2hlciA9IHB1Ymxpc2g8UG9seWxpbmVFZGl0VXBkYXRlPigpKHRoaXMudXBkYXRlU3ViamVjdCk7IC8vIFRPRE8gbWF5YmUgbm90IG5lZWRlZFxyXG4gIHByaXZhdGUgY29vcmRpbmF0ZUNvbnZlcnRlcjogQ29vcmRpbmF0ZUNvbnZlcnRlcjtcclxuICBwcml2YXRlIGNhbWVyYVNlcnZpY2U6IENhbWVyYVNlcnZpY2U7XHJcbiAgcHJpdmF0ZSBwb2x5bGluZXNNYW5hZ2VyOiBQb2x5bGluZXNNYW5hZ2VyU2VydmljZTtcclxuICBwcml2YXRlIG9ic2VydmFibGVzTWFwID0gbmV3IE1hcDxzdHJpbmcsIERpc3Bvc2FibGVPYnNlcnZhYmxlPGFueT5bXT4oKTtcclxuICBwcml2YXRlIGNlc2l1bVNjZW5lO1xyXG5cclxuICBwcml2YXRlIGNsYW1wUG9pbnRzRGVib3VuY2VkID0gZGVib3VuY2UoKGlkLCBjbGFtcEhlaWdodFRvM0Q6IGJvb2xlYW4sIGNsYW1wSGVpZ2h0VG8zRE9wdGlvbnMpID0+IHtcclxuICAgIHRoaXMuY2xhbXBQb2ludHMoaWQsIGNsYW1wSGVpZ2h0VG8zRCwgY2xhbXBIZWlnaHRUbzNET3B0aW9ucyk7XHJcbiAgfSwgMzAwKTtcclxuXHJcbiAgaW5pdChtYXBFdmVudHNNYW5hZ2VyOiBNYXBFdmVudHNNYW5hZ2VyU2VydmljZSxcclxuICAgICAgIGNvb3JkaW5hdGVDb252ZXJ0ZXI6IENvb3JkaW5hdGVDb252ZXJ0ZXIsXHJcbiAgICAgICBjYW1lcmFTZXJ2aWNlOiBDYW1lcmFTZXJ2aWNlLFxyXG4gICAgICAgcG9seWxpbmVzTWFuYWdlcjogUG9seWxpbmVzTWFuYWdlclNlcnZpY2UsXHJcbiAgICAgICBjZXNpdW1WaWV3ZXI6IENlc2l1bVNlcnZpY2UpIHtcclxuICAgIHRoaXMubWFwRXZlbnRzTWFuYWdlciA9IG1hcEV2ZW50c01hbmFnZXI7XHJcbiAgICB0aGlzLmNvb3JkaW5hdGVDb252ZXJ0ZXIgPSBjb29yZGluYXRlQ29udmVydGVyO1xyXG4gICAgdGhpcy5jYW1lcmFTZXJ2aWNlID0gY2FtZXJhU2VydmljZTtcclxuICAgIHRoaXMucG9seWxpbmVzTWFuYWdlciA9IHBvbHlsaW5lc01hbmFnZXI7XHJcbiAgICB0aGlzLnVwZGF0ZVB1Ymxpc2hlci5jb25uZWN0KCk7XHJcblxyXG4gICAgdGhpcy5jZXNpdW1TY2VuZSA9IGNlc2l1bVZpZXdlci5nZXRTY2VuZSgpO1xyXG4gIH1cclxuXHJcbiAgb25VcGRhdGUoKTogT2JzZXJ2YWJsZTxQb2x5bGluZUVkaXRVcGRhdGU+IHtcclxuICAgIHJldHVybiB0aGlzLnVwZGF0ZVB1Ymxpc2hlcjtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgY2xhbXBQb2ludHMoaWQsIGNsYW1wSGVpZ2h0VG8zRDogYm9vbGVhbiwgeyBjbGFtcFRvVGVycmFpbiwgY2xhbXBNb3N0RGV0YWlsZWQsIGNsYW1wVG9IZWlnaHRQaWNrV2lkdGggfTogQ2xhbXBUbzNET3B0aW9ucykge1xyXG4gICAgaWYgKGNsYW1wSGVpZ2h0VG8zRCAmJiBjbGFtcE1vc3REZXRhaWxlZCkge1xyXG4gICAgICBjb25zdCBwb2x5bGluZSA9IHRoaXMucG9seWxpbmVzTWFuYWdlci5nZXQoaWQpO1xyXG4gICAgICBjb25zdCBwb2ludHMgPSBwb2x5bGluZS5nZXRQb2ludHMoKTtcclxuXHJcbiAgICAgIGlmICghY2xhbXBUb1RlcnJhaW4pIHtcclxuICAgICAgICAvLyAzZFRpbGVzXHJcbiAgICAgICAgcG9pbnRzLmZvckVhY2gocG9pbnQgPT4ge1xyXG4gICAgICAgICAgcG9pbnQuc2V0UG9zaXRpb24odGhpcy5jZXNpdW1TY2VuZS5jbGFtcFRvSGVpZ2h0KHBvaW50LmdldFBvc2l0aW9uKCksIHVuZGVmaW5lZCwgY2xhbXBUb0hlaWdodFBpY2tXaWR0aCkpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNvbnN0IGNhcnRvZ3JhcGhpY3MgPSBwb2ludHMubWFwKHBvaW50ID0+IHRoaXMuY29vcmRpbmF0ZUNvbnZlcnRlci5jYXJ0ZXNpYW4zVG9DYXJ0b2dyYXBoaWMocG9pbnQuZ2V0UG9zaXRpb24oKSkpO1xyXG4gICAgICAgIGNvbnN0IHByb21pc2UgPSBzYW1wbGVUZXJyYWluKHRoaXMuY2VzaXVtU2NlbmUudGVycmFpblByb3ZpZGVyLCAxMSwgY2FydG9ncmFwaGljcyk7XHJcbiAgICAgICAgd2hlbihwcm9taXNlLCBmdW5jdGlvbiAodXBkYXRlZFBvc2l0aW9ucykge1xyXG4gICAgICAgICAgcG9pbnRzLmZvckVhY2goKHBvaW50LCBpbmRleCkgPT4ge1xyXG4gICAgICAgICAgICBwb2ludC5zZXRQb3NpdGlvbihDYXJ0b2dyYXBoaWMudG9DYXJ0ZXNpYW4odXBkYXRlZFBvc2l0aW9uc1tpbmRleF0pKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuXHJcbiAgcHJpdmF0ZSBzY3JlZW5Ub1Bvc2l0aW9uKGNhcnRlc2lhbjIsIGNsYW1wSGVpZ2h0VG8zRDogYm9vbGVhbiwge2NsYW1wVG9IZWlnaHRQaWNrV2lkdGgsIGNsYW1wVG9UZXJyYWlufTogQ2xhbXBUbzNET3B0aW9ucykge1xyXG4gICAgY29uc3QgY2FydGVzaWFuMyA9IHRoaXMuY29vcmRpbmF0ZUNvbnZlcnRlci5zY3JlZW5Ub0NhcnRlc2lhbjMoY2FydGVzaWFuMik7XHJcblxyXG4gICAgLy8gSWYgY2FydGVzaWFuMyBpcyB1bmRlZmluZWQgdGhlbiB0aGUgcG9pbnQgaW5zdCBvbiB0aGUgZ2xvYmVcclxuICAgIGlmIChjbGFtcEhlaWdodFRvM0QgJiYgY2FydGVzaWFuMykge1xyXG4gICAgICBjb25zdCBnbG9iZVBvc2l0aW9uUGljayA9ICgpID0+IHtcclxuICAgICAgICBjb25zdCByYXkgPSB0aGlzLmNhbWVyYVNlcnZpY2UuZ2V0Q2FtZXJhKCkuZ2V0UGlja1JheShjYXJ0ZXNpYW4yKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5jZXNpdW1TY2VuZS5nbG9iZS5waWNrKHJheSwgdGhpcy5jZXNpdW1TY2VuZSk7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICAvLyBpcyB0ZXJyYWluP1xyXG4gICAgICBpZiAoY2xhbXBUb1RlcnJhaW4pIHtcclxuICAgICAgICByZXR1cm4gZ2xvYmVQb3NpdGlvblBpY2soKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjb25zdCBjYXJ0ZXNpYW4zUGlja1Bvc2l0aW9uID0gdGhpcy5jZXNpdW1TY2VuZS5waWNrUG9zaXRpb24oY2FydGVzaWFuMik7XHJcbiAgICAgICAgY29uc3QgbGF0TG9uID0gQ29vcmRpbmF0ZUNvbnZlcnRlci5jYXJ0ZXNpYW4zVG9MYXRMb24oY2FydGVzaWFuM1BpY2tQb3NpdGlvbik7XHJcbiAgICAgICAgaWYgKGxhdExvbi5oZWlnaHQgPCAwKSB7Ly8gbWVhbnMgbm90aGluZyBwaWNrZWQgLT4gVmFsaWRhdGUgaXRcclxuICAgICAgICAgIHJldHVybiBnbG9iZVBvc2l0aW9uUGljaygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5jZXNpdW1TY2VuZS5jbGFtcFRvSGVpZ2h0KGNhcnRlc2lhbjNQaWNrUG9zaXRpb24sIHVuZGVmaW5lZCwgY2xhbXBUb0hlaWdodFBpY2tXaWR0aCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gY2FydGVzaWFuMztcclxuICB9XHJcblxyXG4gIGNyZWF0ZShvcHRpb25zID0gREVGQVVMVF9QT0xZTElORV9PUFRJT05TLCBldmVudFByaW9yaXR5ID0gMTAwKTogUG9seWxpbmVFZGl0b3JPYnNlcnZhYmxlIHtcclxuICAgIGNvbnN0IHBvc2l0aW9uczogQ2FydGVzaWFuM1tdID0gW107XHJcbiAgICBjb25zdCBpZCA9IGdlbmVyYXRlS2V5KCk7XHJcbiAgICBjb25zdCBwb2x5bGluZU9wdGlvbnMgPSB0aGlzLnNldE9wdGlvbnMob3B0aW9ucyk7XHJcblxyXG4gICAgY29uc3QgY2xpZW50RWRpdFN1YmplY3QgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PFBvbHlsaW5lRWRpdFVwZGF0ZT4oe1xyXG4gICAgICBpZCxcclxuICAgICAgZWRpdEFjdGlvbjogbnVsbCxcclxuICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5DUkVBVEVcclxuICAgIH0pO1xyXG4gICAgbGV0IGZpbmlzaGVkQ3JlYXRlID0gZmFsc2U7XHJcblxyXG4gICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQoe1xyXG4gICAgICBpZCxcclxuICAgICAgcG9zaXRpb25zLFxyXG4gICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkNSRUFURSxcclxuICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuSU5JVCxcclxuICAgICAgcG9seWxpbmVPcHRpb25zOiBwb2x5bGluZU9wdGlvbnMsXHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zdCBmaW5pc2hDcmVhdGlvbiA9IChwb3NpdGlvbjogQ2FydGVzaWFuMykgPT4ge1xyXG4gICAgICByZXR1cm4gdGhpcy5zd2l0Y2hUb0VkaXRNb2RlKFxyXG4gICAgICAgIGlkLFxyXG4gICAgICAgIHBvc2l0aW9uLFxyXG4gICAgICAgIGNsaWVudEVkaXRTdWJqZWN0LFxyXG4gICAgICAgIHBvc2l0aW9ucyxcclxuICAgICAgICBldmVudFByaW9yaXR5LFxyXG4gICAgICAgIHBvbHlsaW5lT3B0aW9ucyxcclxuICAgICAgICBlZGl0b3JPYnNlcnZhYmxlLFxyXG4gICAgICAgIGZpbmlzaGVkQ3JlYXRlKTtcclxuICAgIH07XHJcblxyXG4gICAgY29uc3QgbW91c2VNb3ZlUmVnaXN0cmF0aW9uID0gdGhpcy5tYXBFdmVudHNNYW5hZ2VyLnJlZ2lzdGVyKHtcclxuICAgICAgZXZlbnQ6IENlc2l1bUV2ZW50Lk1PVVNFX01PVkUsXHJcbiAgICAgIHBpY2s6IFBpY2tPcHRpb25zLk5PX1BJQ0ssXHJcbiAgICAgIHByaW9yaXR5OiBldmVudFByaW9yaXR5LFxyXG4gICAgICBwaWNrQ29uZmlnOiBvcHRpb25zLnBpY2tDb25maWd1cmF0aW9uLFxyXG4gICAgfSk7XHJcbiAgICBjb25zdCBhZGRQb2ludFJlZ2lzdHJhdGlvbiA9IHRoaXMubWFwRXZlbnRzTWFuYWdlci5yZWdpc3Rlcih7XHJcbiAgICAgIGV2ZW50OiBwb2x5bGluZU9wdGlvbnMuYWRkUG9pbnRFdmVudCxcclxuICAgICAgbW9kaWZpZXI6IHBvbHlsaW5lT3B0aW9ucy5hZGRQb2ludE1vZGlmaWVyLFxyXG4gICAgICBwaWNrOiBQaWNrT3B0aW9ucy5OT19QSUNLLFxyXG4gICAgICBwcmlvcml0eTogZXZlbnRQcmlvcml0eSxcclxuICAgICAgcGlja0NvbmZpZzogb3B0aW9ucy5waWNrQ29uZmlndXJhdGlvbixcclxuICAgIH0pO1xyXG4gICAgY29uc3QgYWRkTGFzdFBvaW50UmVnaXN0cmF0aW9uID0gdGhpcy5tYXBFdmVudHNNYW5hZ2VyLnJlZ2lzdGVyKHtcclxuICAgICAgZXZlbnQ6IHBvbHlsaW5lT3B0aW9ucy5hZGRMYXN0UG9pbnRFdmVudCxcclxuICAgICAgbW9kaWZpZXI6IHBvbHlsaW5lT3B0aW9ucy5hZGRMYXN0UG9pbnRNb2RpZmllcixcclxuICAgICAgcGljazogUGlja09wdGlvbnMuTk9fUElDSyxcclxuICAgICAgcHJpb3JpdHk6IGV2ZW50UHJpb3JpdHksXHJcbiAgICAgIHBpY2tDb25maWc6IG9wdGlvbnMucGlja0NvbmZpZ3VyYXRpb24sXHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLm9ic2VydmFibGVzTWFwLnNldChpZCwgW21vdXNlTW92ZVJlZ2lzdHJhdGlvbiwgYWRkUG9pbnRSZWdpc3RyYXRpb24sIGFkZExhc3RQb2ludFJlZ2lzdHJhdGlvbl0pO1xyXG4gICAgY29uc3QgZWRpdG9yT2JzZXJ2YWJsZSA9IHRoaXMuY3JlYXRlRWRpdG9yT2JzZXJ2YWJsZShjbGllbnRFZGl0U3ViamVjdCwgaWQsIGZpbmlzaENyZWF0aW9uKTtcclxuXHJcbiAgICBtb3VzZU1vdmVSZWdpc3RyYXRpb24uc3Vic2NyaWJlKCh7IG1vdmVtZW50OiB7IGVuZFBvc2l0aW9uIH0gfSkgPT4ge1xyXG4gICAgICBjb25zdCBwb3NpdGlvbiA9IHRoaXMuc2NyZWVuVG9Qb3NpdGlvbihlbmRQb3NpdGlvbiwgcG9seWxpbmVPcHRpb25zLmNsYW1wSGVpZ2h0VG8zRCwgcG9seWxpbmVPcHRpb25zLmNsYW1wSGVpZ2h0VG8zRE9wdGlvbnMpO1xyXG4gICAgICBpZiAocG9zaXRpb24pIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dCh7XHJcbiAgICAgICAgICBpZCxcclxuICAgICAgICAgIHBvc2l0aW9uczogdGhpcy5nZXRQb3NpdGlvbnMoaWQpLFxyXG4gICAgICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5DUkVBVEUsXHJcbiAgICAgICAgICB1cGRhdGVkUG9zaXRpb246IHBvc2l0aW9uLFxyXG4gICAgICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuTU9VU0VfTU9WRSxcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgYWRkUG9pbnRSZWdpc3RyYXRpb24uc3Vic2NyaWJlKCh7IG1vdmVtZW50OiB7IGVuZFBvc2l0aW9uIH0gfSkgPT4ge1xyXG4gICAgICBpZiAoZmluaXNoZWRDcmVhdGUpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuICAgICAgY29uc3QgcG9zaXRpb24gPSB0aGlzLnNjcmVlblRvUG9zaXRpb24oZW5kUG9zaXRpb24sIHBvbHlsaW5lT3B0aW9ucy5jbGFtcEhlaWdodFRvM0QsIHBvbHlsaW5lT3B0aW9ucy5jbGFtcEhlaWdodFRvM0RPcHRpb25zKTtcclxuICAgICAgaWYgKCFwb3NpdGlvbikge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG4gICAgICBjb25zdCBhbGxQb3NpdGlvbnMgPSB0aGlzLmdldFBvc2l0aW9ucyhpZCk7XHJcbiAgICAgIGlmIChhbGxQb3NpdGlvbnMuZmluZCgoY2FydGVzaWFuKSA9PiBjYXJ0ZXNpYW4uZXF1YWxzKHBvc2l0aW9uKSkpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuICAgICAgY29uc3QgdXBkYXRlVmFsdWUgPSB7XHJcbiAgICAgICAgaWQsXHJcbiAgICAgICAgcG9zaXRpb25zOiBhbGxQb3NpdGlvbnMsXHJcbiAgICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5DUkVBVEUsXHJcbiAgICAgICAgdXBkYXRlZFBvc2l0aW9uOiBwb3NpdGlvbixcclxuICAgICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5BRERfUE9JTlQsXHJcbiAgICAgIH07XHJcbiAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHVwZGF0ZVZhbHVlKTtcclxuICAgICAgY2xpZW50RWRpdFN1YmplY3QubmV4dCh7XHJcbiAgICAgICAgLi4udXBkYXRlVmFsdWUsXHJcbiAgICAgICAgcG9zaXRpb25zOiB0aGlzLmdldFBvc2l0aW9ucyhpZCksXHJcbiAgICAgICAgcG9pbnRzOiB0aGlzLmdldFBvaW50cyhpZCksXHJcbiAgICAgIH0pO1xyXG4gICAgICBpZiAocG9seWxpbmVPcHRpb25zLm1heGltdW1OdW1iZXJPZlBvaW50cyAmJiBhbGxQb3NpdGlvbnMubGVuZ3RoICsgMSA9PT0gcG9seWxpbmVPcHRpb25zLm1heGltdW1OdW1iZXJPZlBvaW50cykge1xyXG4gICAgICAgIGZpbmlzaGVkQ3JlYXRlID0gZmluaXNoQ3JlYXRpb24ocG9zaXRpb24pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBhZGRMYXN0UG9pbnRSZWdpc3RyYXRpb24uc3Vic2NyaWJlKCh7IG1vdmVtZW50OiB7IGVuZFBvc2l0aW9uIH0gfSkgPT4ge1xyXG4gICAgICBjb25zdCBwb3NpdGlvbiA9IHRoaXMuc2NyZWVuVG9Qb3NpdGlvbihlbmRQb3NpdGlvbiwgcG9seWxpbmVPcHRpb25zLmNsYW1wSGVpZ2h0VG8zRCwgcG9seWxpbmVPcHRpb25zLmNsYW1wSGVpZ2h0VG8zRE9wdGlvbnMpO1xyXG4gICAgICBpZiAoIXBvc2l0aW9uKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBBZGQgbGFzdCBwb2ludCB0byBwb3NpdGlvbnMgaWYgbm90IGFscmVhZHkgYWRkZWRcclxuICAgICAgY29uc3QgYWxsUG9zaXRpb25zID0gdGhpcy5nZXRQb3NpdGlvbnMoaWQpO1xyXG4gICAgICBpZiAoIWFsbFBvc2l0aW9ucy5maW5kKChjYXJ0ZXNpYW4pID0+IGNhcnRlc2lhbi5lcXVhbHMocG9zaXRpb24pKSkge1xyXG4gICAgICAgIGNvbnN0IHVwZGF0ZVZhbHVlID0ge1xyXG4gICAgICAgICAgaWQsXHJcbiAgICAgICAgICBwb3NpdGlvbnM6IGFsbFBvc2l0aW9ucyxcclxuICAgICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuQ1JFQVRFLFxyXG4gICAgICAgICAgdXBkYXRlZFBvc2l0aW9uOiBwb3NpdGlvbixcclxuICAgICAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLkFERF9QT0lOVCxcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHVwZGF0ZVZhbHVlKTtcclxuICAgICAgICBjbGllbnRFZGl0U3ViamVjdC5uZXh0KHtcclxuICAgICAgICAgIC4uLnVwZGF0ZVZhbHVlLFxyXG4gICAgICAgICAgcG9zaXRpb25zOiB0aGlzLmdldFBvc2l0aW9ucyhpZCksXHJcbiAgICAgICAgICBwb2ludHM6IHRoaXMuZ2V0UG9pbnRzKGlkKSxcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZmluaXNoZWRDcmVhdGUgPSBmaW5pc2hDcmVhdGlvbihwb3NpdGlvbik7XHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gZWRpdG9yT2JzZXJ2YWJsZTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgc3dpdGNoVG9FZGl0TW9kZShpZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb24sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWVudEVkaXRTdWJqZWN0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbnM6IENhcnRlc2lhbjNbXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRQcmlvcml0eSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9seWxpbmVPcHRpb25zLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBlZGl0b3JPYnNlcnZhYmxlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBmaW5pc2hlZENyZWF0ZTogYm9vbGVhbikge1xyXG4gICAgY29uc3QgdXBkYXRlID0ge1xyXG4gICAgICBpZCxcclxuICAgICAgcG9zaXRpb25zOiB0aGlzLmdldFBvc2l0aW9ucyhpZCksXHJcbiAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuQ1JFQVRFLFxyXG4gICAgICB1cGRhdGVkUG9zaXRpb246IHBvc2l0aW9uLFxyXG4gICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5BRERfTEFTVF9QT0lOVCxcclxuICAgIH07XHJcbiAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dCh1cGRhdGUpO1xyXG4gICAgY2xpZW50RWRpdFN1YmplY3QubmV4dCh7XHJcbiAgICAgIC4uLnVwZGF0ZSxcclxuICAgICAgcG9zaXRpb25zOiB0aGlzLmdldFBvc2l0aW9ucyhpZCksXHJcbiAgICAgIHBvaW50czogdGhpcy5nZXRQb2ludHMoaWQpLFxyXG4gICAgfSk7XHJcblxyXG4gICAgY29uc3QgY2hhbmdlTW9kZSA9IHtcclxuICAgICAgaWQsXHJcbiAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuQ1JFQVRFLFxyXG4gICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5DSEFOR0VfVE9fRURJVCxcclxuICAgIH07XHJcbiAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dChjaGFuZ2VNb2RlKTtcclxuICAgIGNsaWVudEVkaXRTdWJqZWN0Lm5leHQoY2hhbmdlTW9kZSk7XHJcbiAgICBpZiAodGhpcy5vYnNlcnZhYmxlc01hcC5oYXMoaWQpKSB7XHJcbiAgICAgIHRoaXMub2JzZXJ2YWJsZXNNYXAuZ2V0KGlkKS5mb3JFYWNoKHJlZ2lzdHJhdGlvbiA9PiByZWdpc3RyYXRpb24uZGlzcG9zZSgpKTtcclxuICAgIH1cclxuICAgIHRoaXMub2JzZXJ2YWJsZXNNYXAuZGVsZXRlKGlkKTtcclxuICAgIHRoaXMuZWRpdFBvbHlsaW5lKGlkLCBwb3NpdGlvbnMsIGV2ZW50UHJpb3JpdHksIGNsaWVudEVkaXRTdWJqZWN0LCBwb2x5bGluZU9wdGlvbnMsIGVkaXRvck9ic2VydmFibGUpO1xyXG4gICAgZmluaXNoZWRDcmVhdGUgPSB0cnVlO1xyXG4gICAgcmV0dXJuIGZpbmlzaGVkQ3JlYXRlO1xyXG4gIH1cclxuXHJcbiAgZWRpdChwb3NpdGlvbnM6IENhcnRlc2lhbjNbXSwgb3B0aW9ucyA9IERFRkFVTFRfUE9MWUxJTkVfT1BUSU9OUywgcHJpb3JpdHkgPSAxMDApOiBQb2x5bGluZUVkaXRvck9ic2VydmFibGUge1xyXG4gICAgaWYgKHBvc2l0aW9ucy5sZW5ndGggPCAyKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignUG9seWxpbmVzIGVkaXRvciBlcnJvciBlZGl0KCk6IHBvbHlsaW5lIHNob3VsZCBoYXZlIGF0IGxlYXN0IDIgcG9zaXRpb25zJyk7XHJcbiAgICB9XHJcbiAgICBjb25zdCBpZCA9IGdlbmVyYXRlS2V5KCk7XHJcbiAgICBjb25zdCBwb2x5bGluZU9wdGlvbnMgPSB0aGlzLnNldE9wdGlvbnMob3B0aW9ucyk7XHJcbiAgICBjb25zdCBlZGl0U3ViamVjdCA9IG5ldyBCZWhhdmlvclN1YmplY3Q8UG9seWxpbmVFZGl0VXBkYXRlPih7XHJcbiAgICAgIGlkLFxyXG4gICAgICBlZGl0QWN0aW9uOiBudWxsLFxyXG4gICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkVESVRcclxuICAgIH0pO1xyXG4gICAgY29uc3QgdXBkYXRlID0ge1xyXG4gICAgICBpZCxcclxuICAgICAgcG9zaXRpb25zOiBwb3NpdGlvbnMsXHJcbiAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuRURJVCxcclxuICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuSU5JVCxcclxuICAgICAgcG9seWxpbmVPcHRpb25zOiBwb2x5bGluZU9wdGlvbnMsXHJcbiAgICB9O1xyXG4gICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQodXBkYXRlKTtcclxuICAgIGVkaXRTdWJqZWN0Lm5leHQoe1xyXG4gICAgICAuLi51cGRhdGUsXHJcbiAgICAgIHBvc2l0aW9uczogdGhpcy5nZXRQb3NpdGlvbnMoaWQpLFxyXG4gICAgICBwb2ludHM6IHRoaXMuZ2V0UG9pbnRzKGlkKSxcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIHRoaXMuZWRpdFBvbHlsaW5lKFxyXG4gICAgICBpZCxcclxuICAgICAgcG9zaXRpb25zLFxyXG4gICAgICBwcmlvcml0eSxcclxuICAgICAgZWRpdFN1YmplY3QsXHJcbiAgICAgIHBvbHlsaW5lT3B0aW9uc1xyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZWRpdFBvbHlsaW5lKGlkOiBzdHJpbmcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb25zOiBDYXJ0ZXNpYW4zW10sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgcHJpb3JpdHk6IG51bWJlcixcclxuICAgICAgICAgICAgICAgICAgICAgICBlZGl0U3ViamVjdDogU3ViamVjdDxQb2x5bGluZUVkaXRVcGRhdGU+LFxyXG4gICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnM6IFBvbHlsaW5lRWRpdE9wdGlvbnMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgZWRpdE9ic2VydmFibGU/OiBQb2x5bGluZUVkaXRvck9ic2VydmFibGUpIHtcclxuICAgIHRoaXMuY2xhbXBQb2ludHMoaWQsIG9wdGlvbnMuY2xhbXBIZWlnaHRUbzNELCBvcHRpb25zLmNsYW1wSGVpZ2h0VG8zRE9wdGlvbnMpO1xyXG5cclxuICAgIGNvbnN0IHBvaW50RHJhZ1JlZ2lzdHJhdGlvbiA9IHRoaXMubWFwRXZlbnRzTWFuYWdlci5yZWdpc3Rlcih7XHJcbiAgICAgIGV2ZW50OiBvcHRpb25zLmRyYWdQb2ludEV2ZW50LFxyXG4gICAgICBlbnRpdHlUeXBlOiBFZGl0UG9pbnQsXHJcbiAgICAgIHBpY2s6IFBpY2tPcHRpb25zLlBJQ0tfRklSU1QsXHJcbiAgICAgIHBpY2tDb25maWc6IG9wdGlvbnMucGlja0NvbmZpZ3VyYXRpb24sXHJcbiAgICAgIHByaW9yaXR5LFxyXG4gICAgICBwaWNrRmlsdGVyOiBlbnRpdHkgPT4gaWQgPT09IGVudGl0eS5lZGl0ZWRFbnRpdHlJZCxcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnN0IHBvaW50UmVtb3ZlUmVnaXN0cmF0aW9uID0gdGhpcy5tYXBFdmVudHNNYW5hZ2VyLnJlZ2lzdGVyKHtcclxuICAgICAgZXZlbnQ6IG9wdGlvbnMucmVtb3ZlUG9pbnRFdmVudCxcclxuICAgICAgbW9kaWZpZXI6IG9wdGlvbnMucmVtb3ZlUG9pbnRNb2RpZmllcixcclxuICAgICAgZW50aXR5VHlwZTogRWRpdFBvaW50LFxyXG4gICAgICBwaWNrOiBQaWNrT3B0aW9ucy5QSUNLX0ZJUlNULFxyXG4gICAgICBwaWNrQ29uZmlnOiBvcHRpb25zLnBpY2tDb25maWd1cmF0aW9uLFxyXG4gICAgICBwcmlvcml0eSxcclxuICAgICAgcGlja0ZpbHRlcjogZW50aXR5ID0+IGlkID09PSBlbnRpdHkuZWRpdGVkRW50aXR5SWQsXHJcbiAgICB9KTtcclxuXHJcbiAgICBsZXQgc2hhcGVEcmFnUmVnaXN0cmF0aW9uO1xyXG4gICAgaWYgKG9wdGlvbnMuYWxsb3dEcmFnKSB7XHJcbiAgICAgIHNoYXBlRHJhZ1JlZ2lzdHJhdGlvbiA9IHRoaXMubWFwRXZlbnRzTWFuYWdlci5yZWdpc3Rlcih7XHJcbiAgICAgICAgZXZlbnQ6IG9wdGlvbnMuZHJhZ1NoYXBlRXZlbnQsXHJcbiAgICAgICAgZW50aXR5VHlwZTogRWRpdFBvbHlsaW5lLFxyXG4gICAgICAgIHBpY2s6IFBpY2tPcHRpb25zLlBJQ0tfRklSU1QsXHJcbiAgICAgICAgcGlja0NvbmZpZzogb3B0aW9ucy5waWNrQ29uZmlndXJhdGlvbixcclxuICAgICAgICBwcmlvcml0eSxcclxuICAgICAgICBwaWNrRmlsdGVyOiBlbnRpdHkgPT4gaWQgPT09IGVudGl0eS5lZGl0ZWRFbnRpdHlJZCxcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHNoYXBlRHJhZ1JlZ2lzdHJhdGlvbikge1xyXG4gICAgICBzaGFwZURyYWdSZWdpc3RyYXRpb25cclxuICAgICAgICAucGlwZSh0YXAoKHsgbW92ZW1lbnQ6IHsgZHJvcCB9IH0pID0+IHRoaXMucG9seWxpbmVzTWFuYWdlci5nZXQoaWQpLmVuYWJsZUVkaXQgJiYgdGhpcy5jYW1lcmFTZXJ2aWNlLmVuYWJsZUlucHV0cyhkcm9wKSkpXHJcbiAgICAgICAgLnN1YnNjcmliZSgoeyBtb3ZlbWVudDogeyBzdGFydFBvc2l0aW9uLCBlbmRQb3NpdGlvbiwgZHJvcCB9LCBlbnRpdGllcyB9KSA9PiB7XHJcbiAgICAgICAgICBjb25zdCBlbmREcmFnUG9zaXRpb24gPSB0aGlzLnNjcmVlblRvUG9zaXRpb24oZW5kUG9zaXRpb24sIGZhbHNlLCBvcHRpb25zLmNsYW1wSGVpZ2h0VG8zRE9wdGlvbnMpO1xyXG4gICAgICAgICAgY29uc3Qgc3RhcnREcmFnUG9zaXRpb24gPSB0aGlzLnNjcmVlblRvUG9zaXRpb24oc3RhcnRQb3NpdGlvbiwgZmFsc2UsIG9wdGlvbnMuY2xhbXBIZWlnaHRUbzNET3B0aW9ucyk7XHJcbiAgICAgICAgICBpZiAoIWVuZERyYWdQb3NpdGlvbikge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgY29uc3QgdXBkYXRlID0ge1xyXG4gICAgICAgICAgICBpZCxcclxuICAgICAgICAgICAgcG9zaXRpb25zOiB0aGlzLmdldFBvc2l0aW9ucyhpZCksXHJcbiAgICAgICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuRURJVCxcclxuICAgICAgICAgICAgdXBkYXRlZFBvc2l0aW9uOiBlbmREcmFnUG9zaXRpb24sXHJcbiAgICAgICAgICAgIGRyYWdnZWRQb3NpdGlvbjogc3RhcnREcmFnUG9zaXRpb24sXHJcbiAgICAgICAgICAgIGVkaXRBY3Rpb246IGRyb3AgPyBFZGl0QWN0aW9ucy5EUkFHX1NIQVBFX0ZJTklTSCA6IEVkaXRBY3Rpb25zLkRSQUdfU0hBUEUsXHJcbiAgICAgICAgICB9O1xyXG4gICAgICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQodXBkYXRlKTtcclxuICAgICAgICAgIGVkaXRTdWJqZWN0Lm5leHQoe1xyXG4gICAgICAgICAgICAuLi51cGRhdGUsXHJcbiAgICAgICAgICAgIHBvc2l0aW9uczogdGhpcy5nZXRQb3NpdGlvbnMoaWQpLFxyXG4gICAgICAgICAgICBwb2ludHM6IHRoaXMuZ2V0UG9pbnRzKGlkKSxcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHBvaW50RHJhZ1JlZ2lzdHJhdGlvbi5waXBlKFxyXG4gICAgICB0YXAoKHsgbW92ZW1lbnQ6IHsgZHJvcCB9IH0pID0+IHRoaXMucG9seWxpbmVzTWFuYWdlci5nZXQoaWQpLmVuYWJsZUVkaXQgJiYgdGhpcy5jYW1lcmFTZXJ2aWNlLmVuYWJsZUlucHV0cyhkcm9wKSkpXHJcbiAgICAgIC5zdWJzY3JpYmUoKHsgbW92ZW1lbnQ6IHsgZW5kUG9zaXRpb24sIGRyb3AgfSwgZW50aXRpZXMgfSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHBvc2l0aW9uID0gdGhpcy5zY3JlZW5Ub1Bvc2l0aW9uKGVuZFBvc2l0aW9uLCBvcHRpb25zLmNsYW1wSGVpZ2h0VG8zRCwgb3B0aW9ucy5jbGFtcEhlaWdodFRvM0RPcHRpb25zKTtcclxuICAgICAgICBpZiAoIXBvc2l0aW9uKSB7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IHBvaW50OiBFZGl0UG9pbnQgPSBlbnRpdGllc1swXTtcclxuXHJcbiAgICAgICAgY29uc3QgdXBkYXRlID0ge1xyXG4gICAgICAgICAgaWQsXHJcbiAgICAgICAgICBwb3NpdGlvbnM6IHRoaXMuZ2V0UG9zaXRpb25zKGlkKSxcclxuICAgICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuRURJVCxcclxuICAgICAgICAgIHVwZGF0ZWRQb3NpdGlvbjogcG9zaXRpb24sXHJcbiAgICAgICAgICB1cGRhdGVkUG9pbnQ6IHBvaW50LFxyXG4gICAgICAgICAgZWRpdEFjdGlvbjogZHJvcCA/IEVkaXRBY3Rpb25zLkRSQUdfUE9JTlRfRklOSVNIIDogRWRpdEFjdGlvbnMuRFJBR19QT0lOVCxcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHVwZGF0ZSk7XHJcbiAgICAgICAgZWRpdFN1YmplY3QubmV4dCh7XHJcbiAgICAgICAgICAuLi51cGRhdGUsXHJcbiAgICAgICAgICBwb3NpdGlvbnM6IHRoaXMuZ2V0UG9zaXRpb25zKGlkKSxcclxuICAgICAgICAgIHBvaW50czogdGhpcy5nZXRQb2ludHMoaWQpLFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmNsYW1wUG9pbnRzRGVib3VuY2VkKGlkLCBvcHRpb25zLmNsYW1wSGVpZ2h0VG8zRCwgb3B0aW9ucy5jbGFtcEhlaWdodFRvM0RPcHRpb25zKTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgcG9pbnRSZW1vdmVSZWdpc3RyYXRpb24uc3Vic2NyaWJlKCh7IGVudGl0aWVzIH0pID0+IHtcclxuICAgICAgY29uc3QgcG9pbnQ6IEVkaXRQb2ludCA9IGVudGl0aWVzWzBdO1xyXG4gICAgICBjb25zdCBhbGxQb3NpdGlvbnMgPSBbLi4udGhpcy5nZXRQb3NpdGlvbnMoaWQpXTtcclxuICAgICAgaWYgKGFsbFBvc2l0aW9ucy5sZW5ndGggPCAzKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICAgIGNvbnN0IGluZGV4ID0gYWxsUG9zaXRpb25zLmZpbmRJbmRleChwb3NpdGlvbiA9PiBwb2ludC5nZXRQb3NpdGlvbigpLmVxdWFscyhwb3NpdGlvbiBhcyBDYXJ0ZXNpYW4zKSk7XHJcbiAgICAgIGlmIChpbmRleCA8IDApIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnN0IHVwZGF0ZSA9IHtcclxuICAgICAgICBpZCxcclxuICAgICAgICBwb3NpdGlvbnM6IGFsbFBvc2l0aW9ucyxcclxuICAgICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkVESVQsXHJcbiAgICAgICAgdXBkYXRlZFBvaW50OiBwb2ludCxcclxuICAgICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5SRU1PVkVfUE9JTlQsXHJcbiAgICAgIH07XHJcbiAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHVwZGF0ZSk7XHJcbiAgICAgIGVkaXRTdWJqZWN0Lm5leHQoe1xyXG4gICAgICAgIC4uLnVwZGF0ZSxcclxuICAgICAgICBwb3NpdGlvbnM6IHRoaXMuZ2V0UG9zaXRpb25zKGlkKSxcclxuICAgICAgICBwb2ludHM6IHRoaXMuZ2V0UG9pbnRzKGlkKSxcclxuICAgICAgfSk7XHJcblxyXG4gICAgICB0aGlzLmNsYW1wUG9pbnRzKGlkLCBvcHRpb25zLmNsYW1wSGVpZ2h0VG8zRCwgb3B0aW9ucy5jbGFtcEhlaWdodFRvM0RPcHRpb25zKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnN0IG9ic2VydmFibGVzID0gW3BvaW50RHJhZ1JlZ2lzdHJhdGlvbiwgcG9pbnRSZW1vdmVSZWdpc3RyYXRpb25dO1xyXG4gICAgaWYgKHNoYXBlRHJhZ1JlZ2lzdHJhdGlvbikge1xyXG4gICAgICBvYnNlcnZhYmxlcy5wdXNoKHNoYXBlRHJhZ1JlZ2lzdHJhdGlvbik7XHJcbiAgICB9XHJcbiAgICB0aGlzLm9ic2VydmFibGVzTWFwLnNldChpZCwgb2JzZXJ2YWJsZXMpO1xyXG4gICAgcmV0dXJuIHRoaXMuY3JlYXRlRWRpdG9yT2JzZXJ2YWJsZShlZGl0U3ViamVjdCwgaWQpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBzZXRPcHRpb25zKG9wdGlvbnM6IFBvbHlsaW5lRWRpdE9wdGlvbnMpIHtcclxuICAgIGNvbnN0IGRlZmF1bHRDbG9uZSA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoREVGQVVMVF9QT0xZTElORV9PUFRJT05TKSk7XHJcbiAgICBjb25zdCBwb2x5bGluZU9wdGlvbnM6IFBvbHlsaW5lRWRpdE9wdGlvbnMgPSBPYmplY3QuYXNzaWduKGRlZmF1bHRDbG9uZSwgb3B0aW9ucyk7XHJcbiAgICBwb2x5bGluZU9wdGlvbnMucG9pbnRQcm9wcyA9IHsuLi5ERUZBVUxUX1BPTFlMSU5FX09QVElPTlMucG9pbnRQcm9wcywgLi4ub3B0aW9ucy5wb2ludFByb3BzfTtcclxuICAgIHBvbHlsaW5lT3B0aW9ucy5wb2x5bGluZVByb3BzID0gey4uLkRFRkFVTFRfUE9MWUxJTkVfT1BUSU9OUy5wb2x5bGluZVByb3BzLCAuLi5vcHRpb25zLnBvbHlsaW5lUHJvcHN9O1xyXG4gICAgcG9seWxpbmVPcHRpb25zLmNsYW1wSGVpZ2h0VG8zRE9wdGlvbnMgPSB7Li4uREVGQVVMVF9QT0xZTElORV9PUFRJT05TLmNsYW1wSGVpZ2h0VG8zRE9wdGlvbnMsIC4uLm9wdGlvbnMuY2xhbXBIZWlnaHRUbzNET3B0aW9uc307XHJcblxyXG4gICAgaWYgKG9wdGlvbnMuY2xhbXBIZWlnaHRUbzNEKSB7XHJcbiAgICAgIGlmICghdGhpcy5jZXNpdW1TY2VuZS5waWNrUG9zaXRpb25TdXBwb3J0ZWQgfHwgIXRoaXMuY2VzaXVtU2NlbmUuY2xhbXBUb0hlaWdodFN1cHBvcnRlZCkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgQ2VzaXVtIHBpY2tQb3NpdGlvbiBhbmQgY2xhbXBUb0hlaWdodCBtdXN0IGJlIHN1cHBvcnRlZCB0byB1c2UgY2xhbXBIZWlnaHRUbzNEYCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICh0aGlzLmNlc2l1bVNjZW5lLnBpY2tUcmFuc2x1Y2VudERlcHRoKSB7XHJcbiAgICAgICAgY29uc29sZS53YXJuKGBDZXNpdW0gc2NlbmUucGlja1RyYW5zbHVjZW50RGVwdGggbXVzdCBiZSBmYWxzZSBpbiBvcmRlciB0byBtYWtlIHRoZSBlZGl0b3JzIHdvcmsgcHJvcGVybHkgb24gM0RgKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHBvbHlsaW5lT3B0aW9ucy5wb2ludFByb3BzLmNvbG9yLmFscGhhID09PSAxIHx8IHBvbHlsaW5lT3B0aW9ucy5wb2ludFByb3BzLm91dGxpbmVDb2xvci5hbHBoYSA9PT0gMSkge1xyXG4gICAgICAgIGNvbnNvbGUud2FybignUG9pbnQgY29sb3IgYW5kIG91dGxpbmUgY29sb3IgbXVzdCBoYXZlIGFscGhhIGluIG9yZGVyIHRvIG1ha2UgdGhlIGVkaXRvciB3b3JrIHByb3Blcmx5IG9uIDNEJyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHBvbHlsaW5lT3B0aW9ucy5hbGxvd0RyYWcgPSBmYWxzZTtcclxuICAgICAgcG9seWxpbmVPcHRpb25zLnBvbHlsaW5lUHJvcHMuY2xhbXBUb0dyb3VuZCA9IHRydWU7XHJcbiAgICAgIHBvbHlsaW5lT3B0aW9ucy5wb2ludFByb3BzLmhlaWdodFJlZmVyZW5jZSA9IHBvbHlsaW5lT3B0aW9ucy5jbGFtcEhlaWdodFRvM0RPcHRpb25zLmNsYW1wVG9UZXJyYWluID9cclxuICAgICAgICBIZWlnaHRSZWZlcmVuY2UuQ0xBTVBfVE9fR1JPVU5EIDogSGVpZ2h0UmVmZXJlbmNlLlJFTEFUSVZFX1RPX0dST1VORDtcclxuICAgICAgcG9seWxpbmVPcHRpb25zLnBvaW50UHJvcHMuZGlzYWJsZURlcHRoVGVzdERpc3RhbmNlID0gTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHBvbHlsaW5lT3B0aW9ucztcclxuICB9XHJcblxyXG5cclxuICBwcml2YXRlIGNyZWF0ZUVkaXRvck9ic2VydmFibGUob2JzZXJ2YWJsZVRvRXh0ZW5kOiBhbnksIGlkOiBzdHJpbmcsIGZpbmlzaENyZWF0aW9uPzogKHBvc2l0aW9uOiBDYXJ0ZXNpYW4zKSA9PiBib29sZWFuKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IFBvbHlsaW5lRWRpdG9yT2JzZXJ2YWJsZSB7XHJcbiAgICBvYnNlcnZhYmxlVG9FeHRlbmQuZGlzcG9zZSA9ICgpID0+IHtcclxuICAgICAgY29uc3Qgb2JzZXJ2YWJsZXMgPSB0aGlzLm9ic2VydmFibGVzTWFwLmdldChpZCk7XHJcbiAgICAgIGlmIChvYnNlcnZhYmxlcykge1xyXG4gICAgICAgIG9ic2VydmFibGVzLmZvckVhY2gob2JzID0+IG9icy5kaXNwb3NlKCkpO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMub2JzZXJ2YWJsZXNNYXAuZGVsZXRlKGlkKTtcclxuICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQoe1xyXG4gICAgICAgIGlkLFxyXG4gICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuQ1JFQVRFX09SX0VESVQsXHJcbiAgICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuRElTUE9TRSxcclxuICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIG9ic2VydmFibGVUb0V4dGVuZC5lbmFibGUgPSAoKSA9PiB7XHJcbiAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHtcclxuICAgICAgICBpZCxcclxuICAgICAgICBwb3NpdGlvbnM6IHRoaXMuZ2V0UG9zaXRpb25zKGlkKSxcclxuICAgICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkVESVQsXHJcbiAgICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuRU5BQkxFLFxyXG4gICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgb2JzZXJ2YWJsZVRvRXh0ZW5kLmRpc2FibGUgPSAoKSA9PiB7XHJcbiAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHtcclxuICAgICAgICBpZCxcclxuICAgICAgICBwb3NpdGlvbnM6IHRoaXMuZ2V0UG9zaXRpb25zKGlkKSxcclxuICAgICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkVESVQsXHJcbiAgICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuRElTQUJMRSxcclxuICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIG9ic2VydmFibGVUb0V4dGVuZC5zZXRNYW51YWxseSA9IChwb2ludHM6IHtcclxuICAgICAgcG9zaXRpb246IENhcnRlc2lhbjMsXHJcbiAgICAgIHBvaW50UHJvcD86IFBvaW50UHJvcHNcclxuICAgIH1bXSB8IENhcnRlc2lhbjNbXSwgcG9seWxpbmVQcm9wcz86IFBvbHlsaW5lUHJvcHMpID0+IHtcclxuICAgICAgY29uc3QgcG9seWxpbmUgPSB0aGlzLnBvbHlsaW5lc01hbmFnZXIuZ2V0KGlkKTtcclxuICAgICAgcG9seWxpbmUuc2V0TWFudWFsbHkocG9pbnRzLCBwb2x5bGluZVByb3BzKTtcclxuICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQoe1xyXG4gICAgICAgIGlkLFxyXG4gICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuQ1JFQVRFX09SX0VESVQsXHJcbiAgICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuU0VUX01BTlVBTExZLFxyXG4gICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgb2JzZXJ2YWJsZVRvRXh0ZW5kLnNldExhYmVsc1JlbmRlckZuID0gKGNhbGxiYWNrOiBhbnkpID0+IHtcclxuICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQoe1xyXG4gICAgICAgIGlkLFxyXG4gICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuQ1JFQVRFX09SX0VESVQsXHJcbiAgICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuU0VUX0VESVRfTEFCRUxTX1JFTkRFUl9DQUxMQkFDSyxcclxuICAgICAgICBsYWJlbHNSZW5kZXJGbjogY2FsbGJhY2ssXHJcbiAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICBvYnNlcnZhYmxlVG9FeHRlbmQudXBkYXRlTGFiZWxzID0gKGxhYmVsczogTGFiZWxQcm9wc1tdKSA9PiB7XHJcbiAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHtcclxuICAgICAgICBpZCxcclxuICAgICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkNSRUFURV9PUl9FRElULFxyXG4gICAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLlVQREFURV9FRElUX0xBQkVMUyxcclxuICAgICAgICB1cGRhdGVMYWJlbHM6IGxhYmVscyxcclxuICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIG9ic2VydmFibGVUb0V4dGVuZC5maW5pc2hDcmVhdGlvbiA9ICgpID0+IHtcclxuICAgICAgaWYgKCFmaW5pc2hDcmVhdGlvbikge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignUG9seWxpbmVzIGVkaXRvciBlcnJvciBlZGl0KCk6IGNhbm5vdCBjYWxsIGZpbmlzaENyZWF0aW9uKCkgb24gZWRpdCcpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gZmluaXNoQ3JlYXRpb24obnVsbCk7XHJcbiAgICB9O1xyXG5cclxuICAgIG9ic2VydmFibGVUb0V4dGVuZC5nZXRDdXJyZW50UG9pbnRzID0gKCkgPT4gdGhpcy5nZXRQb2ludHMoaWQpO1xyXG5cclxuICAgIG9ic2VydmFibGVUb0V4dGVuZC5nZXRFZGl0VmFsdWUgPSAoKSA9PiBvYnNlcnZhYmxlVG9FeHRlbmQuZ2V0VmFsdWUoKTtcclxuXHJcbiAgICBvYnNlcnZhYmxlVG9FeHRlbmQuZ2V0TGFiZWxzID0gKCk6IExhYmVsUHJvcHNbXSA9PiB0aGlzLnBvbHlsaW5lc01hbmFnZXIuZ2V0KGlkKS5sYWJlbHM7XHJcblxyXG4gICAgcmV0dXJuIG9ic2VydmFibGVUb0V4dGVuZCBhcyBQb2x5bGluZUVkaXRvck9ic2VydmFibGU7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGdldFBvc2l0aW9ucyhpZDogc3RyaW5nKSB7XHJcbiAgICBjb25zdCBwb2x5bGluZSA9IHRoaXMucG9seWxpbmVzTWFuYWdlci5nZXQoaWQpO1xyXG4gICAgcmV0dXJuIHBvbHlsaW5lLmdldFJlYWxQb3NpdGlvbnMoKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZ2V0UG9pbnRzKGlkOiBzdHJpbmcpIHtcclxuICAgIGNvbnN0IHBvbHlsaW5lID0gdGhpcy5wb2x5bGluZXNNYW5hZ2VyLmdldChpZCk7XHJcbiAgICByZXR1cm4gcG9seWxpbmUuZ2V0UmVhbFBvaW50cygpO1xyXG4gIH1cclxufVxyXG4iXX0=