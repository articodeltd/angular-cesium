import { publish, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { MapEventsManagerService } from '../../../../angular-cesium/services/map-events-mananger/map-events-manager';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { CesiumEvent } from '../../../../angular-cesium/services/map-events-mananger/consts/cesium-event.enum';
import { PickOptions } from '../../../../angular-cesium/services/map-events-mananger/consts/pickOptions.enum';
import { EditModes } from '../../../models/edit-mode.enum';
import { EditActions } from '../../../models/edit-actions.enum';
import { DisposableObservable } from '../../../../angular-cesium/services/map-events-mananger/disposable-observable';
import { CoordinateConverter } from '../../../../angular-cesium/services/coordinate-converter/coordinate-converter.service';
import { EditPoint } from '../../../models/edit-point';
import { CameraService } from '../../../../angular-cesium/services/camera/camera.service';
import { Cartesian3 } from '../../../../angular-cesium/models/cartesian3';
import { PolylinesManagerService } from './polylines-manager.service';
import { ClampTo3DOptions, PolylineEditOptions, PolylineProps } from '../../../models/polyline-edit-options';
import { PointProps } from '../../../models/point-edit-options';
import { PolylineEditUpdate } from '../../../models/polyline-edit-update';
import { PolylineEditorObservable } from '../../../models/polyline-editor-observable';
import { EditPolyline } from '../../../models';
import { LabelProps } from '../../../models/label-props';
import { debounce, generateKey } from '../../utils';
import { CesiumService } from '../../../../angular-cesium';

export const DEFAULT_POLYLINE_OPTIONS: PolylineEditOptions = {
  addPointEvent: CesiumEvent.LEFT_CLICK,
  addLastPointEvent: CesiumEvent.LEFT_DOUBLE_CLICK,
  removePointEvent: CesiumEvent.RIGHT_CLICK,
  dragPointEvent: CesiumEvent.LEFT_CLICK_DRAG,
  dragShapeEvent: CesiumEvent.LEFT_CLICK_DRAG,
  allowDrag: true,
  pointProps: {
    color: Cesium.Color.WHITE.withAlpha(0.95),
    outlineColor: Cesium.Color.BLACK.withAlpha(0.5),
    outlineWidth: 1,
    pixelSize: 15,
    virtualPointPixelSize: 8,
    show: true,
    showVirtual: true,
    disableDepthTestDistance: Number.POSITIVE_INFINITY,
  },
  polylineProps: {
    material: () => Cesium.Color.BLACK,
    width: 3,
    clampToGround: false,
    zIndex: 0,
    classificationType: Cesium.ClassificationType.BOTH,
    useGroundPrimitiveOutline: false
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
@Injectable()
export class PolylinesEditorService {
  private mapEventsManager: MapEventsManagerService;
  private updateSubject = new Subject<PolylineEditUpdate>();
  private updatePublisher = publish<PolylineEditUpdate>()(this.updateSubject); // TODO maybe not needed
  private coordinateConverter: CoordinateConverter;
  private cameraService: CameraService;
  private polylinesManager: PolylinesManagerService;
  private observablesMap = new Map<string, DisposableObservable<any>[]>();
  private cesiumScene;

  private clampPointsDebounced = debounce((id, clampHeightTo3D: boolean, clampHeightTo3DOptions) => {
    this.clampPoints(id, clampHeightTo3D, clampHeightTo3DOptions);
  }, 300);

  init(mapEventsManager: MapEventsManagerService,
       coordinateConverter: CoordinateConverter,
       cameraService: CameraService,
       polylinesManager: PolylinesManagerService,
       cesiumViewer: CesiumService) {
    this.mapEventsManager = mapEventsManager;
    this.coordinateConverter = coordinateConverter;
    this.cameraService = cameraService;
    this.polylinesManager = polylinesManager;
    this.updatePublisher.connect();

    this.cesiumScene = cesiumViewer.getScene();
  }

  onUpdate(): Observable<PolylineEditUpdate> {
    return this.updatePublisher;
  }

  private clampPoints(id, clampHeightTo3D: boolean, { clampToTerrain, clampMostDetailed, clampToHeightPickWidth }: ClampTo3DOptions) {
    if (clampHeightTo3D && clampMostDetailed) {
      const polyline = this.polylinesManager.get(id);
      const points = polyline.getPoints();

      if (!clampToTerrain) {
        // 3dTiles
        points.forEach(point => {
          point.setPosition(this.cesiumScene.clampToHeight(point.getPosition(), undefined, clampToHeightPickWidth));
        });
      } else {
        const cartographics = points.map(point => this.coordinateConverter.cartesian3ToCartographic(point.getPosition()));
        const promise = Cesium.sampleTerrain(this.cesiumScene.terrainProvider, 11, cartographics);
        promise.then((updatedPositions) => {
          points.forEach((point, index) => {
            point.setPosition(Cesium.Cartographic.toCartesian(updatedPositions[index]));
          });
        });
      }
    }
  }


  private screenToPosition(cartesian2, clampHeightTo3D: boolean, {clampToHeightPickWidth, clampToTerrain}: ClampTo3DOptions) {
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
      } else {
        const cartesian3PickPosition = this.cesiumScene.pickPosition(cartesian2);
        const latLon = CoordinateConverter.cartesian3ToLatLon(cartesian3PickPosition);
        if (latLon.height < 0) {// means nothing picked -> Validate it
          return globePositionPick();
        }
        return this.cesiumScene.clampToHeight(cartesian3PickPosition, undefined, clampToHeightPickWidth);
      }
    }

    return cartesian3;
  }

  create(options = DEFAULT_POLYLINE_OPTIONS, eventPriority = 100): PolylineEditorObservable {
    const positions: Cartesian3[] = [];
    const id = generateKey();
    const polylineOptions = this.setOptions(options);

    const clientEditSubject = new BehaviorSubject<PolylineEditUpdate>({
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

    const finishCreation = (position: Cartesian3) => {
      return this.switchToEditMode(
        id,
        position,
        clientEditSubject,
        positions,
        eventPriority,
        polylineOptions,
        editorObservable,
        finishedCreate);
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

  private switchToEditMode(id,
                           position,
                           clientEditSubject,
                           positions: Cartesian3[],
                           eventPriority,
                           polylineOptions,
                           editorObservable,
                           finishedCreate: boolean) {
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

  edit(positions: Cartesian3[], options = DEFAULT_POLYLINE_OPTIONS, priority = 100): PolylineEditorObservable {
    if (positions.length < 2) {
      throw new Error('Polylines editor error edit(): polyline should have at least 2 positions');
    }
    const id = generateKey();
    const polylineOptions = this.setOptions(options);
    const editSubject = new BehaviorSubject<PolylineEditUpdate>({
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
    return this.editPolyline(
      id,
      positions,
      priority,
      editSubject,
      polylineOptions
    );
  }

  private editPolyline(id: string,
                       positions: Cartesian3[],
                       priority: number,
                       editSubject: Subject<PolylineEditUpdate>,
                       options: PolylineEditOptions,
                       editObservable?: PolylineEditorObservable) {
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

    pointDragRegistration.pipe(
      tap(({ movement: { drop } }) => this.polylinesManager.get(id).enableEdit && this.cameraService.enableInputs(drop)))
      .subscribe(({ movement: { endPosition, drop }, entities }) => {
        const position = this.screenToPosition(endPosition, options.clampHeightTo3D, options.clampHeightTo3DOptions);
        if (!position) {
          return;
        }
        const point: EditPoint = entities[0];

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
      const point: EditPoint = entities[0];
      const allPositions = [...this.getPositions(id)];
      if (allPositions.length < 3) {
        return;
      }
      const index = allPositions.findIndex(position => point.getPosition().equals(position as Cartesian3));
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

  private setOptions(options: PolylineEditOptions) {
    const defaultClone = JSON.parse(JSON.stringify(DEFAULT_POLYLINE_OPTIONS));
    const polylineOptions: PolylineEditOptions = Object.assign(defaultClone, options);
    polylineOptions.pointProps = {...DEFAULT_POLYLINE_OPTIONS.pointProps, ...options.pointProps};
    polylineOptions.polylineProps = {...DEFAULT_POLYLINE_OPTIONS.polylineProps, ...options.polylineProps};
    polylineOptions.clampHeightTo3DOptions = {...DEFAULT_POLYLINE_OPTIONS.clampHeightTo3DOptions, ...options.clampHeightTo3DOptions};

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
        Cesium.HeightReference.CLAMP_TO_GROUND : Cesium.HeightReference.RELATIVE_TO_GROUND;
      polylineOptions.pointProps.disableDepthTestDistance = Number.POSITIVE_INFINITY;
    }
    return polylineOptions;
  }


  private createEditorObservable(observableToExtend: any, id: string, finishCreation?: (position: Cartesian3) => boolean)
                                                                                                      : PolylineEditorObservable {
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

    observableToExtend.setManually = (points: {
      position: Cartesian3,
      pointProp?: PointProps
    }[] | Cartesian3[], polylineProps?: PolylineProps) => {
      const polyline = this.polylinesManager.get(id);
      polyline.setManually(points, polylineProps);
      this.updateSubject.next({
        id,
        editMode: EditModes.CREATE_OR_EDIT,
        editAction: EditActions.SET_MANUALLY,
      });
    };

    observableToExtend.setLabelsRenderFn = (callback: any) => {
      this.updateSubject.next({
        id,
        editMode: EditModes.CREATE_OR_EDIT,
        editAction: EditActions.SET_EDIT_LABELS_RENDER_CALLBACK,
        labelsRenderFn: callback,
      });
    };

    observableToExtend.updateLabels = (labels: LabelProps[]) => {
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

    observableToExtend.getLabels = (): LabelProps[] => this.polylinesManager.get(id).labels;

    return observableToExtend as PolylineEditorObservable;
  }

  private getPositions(id: string) {
    const polyline = this.polylinesManager.get(id);
    return polyline.getRealPositions();
  }

  private getPoints(id: string) {
    const polyline = this.polylinesManager.get(id);
    return polyline.getRealPoints();
  }
}
