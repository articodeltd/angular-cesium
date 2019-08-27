import { debounceTime, publish, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { CesiumService } from '../../../../angular-cesium/services/cesium/cesium.service';
import { MapEventsManagerService } from '../../../../angular-cesium/services/map-events-mananger/map-events-manager';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { CesiumEvent } from '../../../../angular-cesium/services/map-events-mananger/consts/cesium-event.enum';
import { PickOptions } from '../../../../angular-cesium/services/map-events-mananger/consts/pickOptions.enum';
import { RectangleEditUpdate } from '../../../models/rectangle-edit-update';
import { EditModes } from '../../../models/edit-mode.enum';
import { EditActions } from '../../../models/edit-actions.enum';
import { DisposableObservable } from '../../../../angular-cesium/services/map-events-mananger/disposable-observable';
import { CoordinateConverter } from '../../../../angular-cesium/services/coordinate-converter/coordinate-converter.service';
import { EditPoint } from '../../../models/edit-point';
import { CameraService } from '../../../../angular-cesium/services/camera/camera.service';
import { Cartesian3 } from '../../../../angular-cesium/models/cartesian3';
import { RectanglesManagerService } from './rectangles-manager.service';
import { RectangleEditorObservable } from '../../../models/rectangle-editor-observable';
import { EditableRectangle } from '../../../models/editable-rectangle';
import { RectangleEditOptions, RectangleProps } from '../../../models/rectangle-edit-options';
import { PointProps } from '../../../models/polyline-edit-options';
import { LabelProps } from '../../../models/label-props';
import { generateKey } from '../../utils';

export const DEFAULT_RECTANGLE_OPTIONS: RectangleEditOptions = {
  addPointEvent: CesiumEvent.LEFT_CLICK,
  addLastPointEvent: CesiumEvent.LEFT_DOUBLE_CLICK,
  removePointEvent: CesiumEvent.RIGHT_CLICK,
  dragPointEvent: CesiumEvent.LEFT_CLICK_DRAG,
  dragShapeEvent: CesiumEvent.LEFT_CLICK_DRAG,
  allowDrag: true,
  pointProps: {
    color: Cesium.Color.WHITE.withAlpha(0.8),
    outlineColor: Cesium.Color.BLACK.withAlpha(0.2),
    outlineWidth: 1,
    pixelSize: 13,
    virtualPointPixelSize: 8,
    show: true,
    showVirtual: true,
    disableDepthTestDistance: Number.POSITIVE_INFINITY,
  },
  rectangleProps: {
    material: Cesium.Color.CORNFLOWERBLUE.withAlpha(0.4),
    fill: true,
    classificationType: Cesium.ClassificationType.BOTH,
    zIndex: 0,
  },
  polylineProps: {
    material: () => Cesium.Color.WHITE,
    width: 3,
    clampToGround: false,
    zIndex: 0,
    classificationType: Cesium.ClassificationType.BOTH,
  },
  clampHeightTo3D: false,
  clampHeightTo3DOptions: {
    clampToTerrain: false,
  },
};

/**
 * Service for creating editable rectangles 
 *
 * You must provide `RectanglesEditorService` yourself.
 * RectanglesEditorService works together with `<rectangles-editor>` component. Therefor you need to create `<rectangles-editor>`
 * for each `RectanglesEditorService`, And of course somewhere under `<ac-map>`/
 *
 * + `create` for starting a creation of the shape over the map. Returns a extension of `RectangleEditorObservable`.
 * + `edit` for editing shape over the map starting from a given positions. Returns an extension of `RectangleEditorObservable`.
 * + To stop editing call `dsipose()` from the `RectangleEditorObservable` you get back from `create()` \ `edit()`.
 *
 * **Labels over editted shapes**
 * Angular Cesium allows you to draw labels over a shape that is being edited with one of the editors.
 * To add label drawing logic to your editor use the function `setLabelsRenderFn()` that is defined on the
 * `RectangleEditorObservable` that is returned from calling `create()` \ `edit()` of one of the editor services.
 * `setLabelsRenderFn()` - receives a callback that is called every time the shape is redrawn
 * (except when the shape is being dragged). The callback is called with the last shape state and with an array of the current labels.
 * The callback should return type `LabelProps[]`.
 * You can also use `updateLabels()` to pass an array of labels of type `LabelProps[]` to be drawn.
 *
 * usage:
 * ```typescript
 *  // Start creating rectangle
 *  const editing$ = rectanglesEditorService.create();
 *  this.editing$.subscribe(editResult => {
 *				console.log(editResult.positions);
 *		});
 *
 *  // Or edit rectangle from existing rectangle positions
 *  const editing$ = this.rectanglesEditorService.edit(initialPos);
 *
 * ```
 */
@Injectable()
export class RectanglesEditorService {
  private mapEventsManager: MapEventsManagerService;
  private updateSubject = new Subject<RectangleEditUpdate>();
  private updatePublisher = publish<RectangleEditUpdate>()(this.updateSubject); // TODO maybe not needed
  private coordinateConverter: CoordinateConverter;
  private cameraService: CameraService;
  private rectanglesManager: RectanglesManagerService;
  private observablesMap = new Map<string, DisposableObservable<any>[]>();
  private cesiumScene: any;

  init(mapEventsManager: MapEventsManagerService,
       coordinateConverter: CoordinateConverter,
       cameraService: CameraService,
       rectanglesManager: RectanglesManagerService,
       cesiumViewer: CesiumService,
  ) {
    this.mapEventsManager = mapEventsManager;
    this.coordinateConverter = coordinateConverter;
    this.cameraService = cameraService;
    this.rectanglesManager = rectanglesManager;
    this.updatePublisher.connect();

    this.cesiumScene = cesiumViewer.getScene();
  }

  onUpdate(): Observable<RectangleEditUpdate> {
    return this.updatePublisher;
  }

  screenToPosition(cartesian2, clampHeightTo3D: boolean) {
    const cartesian3 = this.coordinateConverter.screenToCartesian3(cartesian2);
    // If cartesian3 is undefined then the point inst on the globe
    if (clampHeightTo3D && cartesian3) {
      const cartesian3PickPosition = this.cesiumScene.pickPosition(cartesian2);
      const latLon = CoordinateConverter.cartesian3ToLatLon(cartesian3PickPosition);
      if (latLon.height < 0) {// means nothing picked -> Validate it
        const ray = this.cameraService.getCamera().getPickRay(cartesian2);
        return this.cesiumScene.globe.pick(ray, this.cesiumScene);
      }
      return this.cesiumScene.clampToHeight(cartesian3PickPosition);
    }

    return cartesian3;
  }

  create(options = DEFAULT_RECTANGLE_OPTIONS, priority = 100): RectangleEditorObservable {
    const positions: Cartesian3[] = [];
    const id = generateKey();
    const rectangleOptions = this.setOptions(options);

    const clientEditSubject = new BehaviorSubject<RectangleEditUpdate>({
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
      rectangleOptions: rectangleOptions,
    });

    const mouseMoveRegistration = this.mapEventsManager.register({
      event: CesiumEvent.MOUSE_MOVE,
      pick: PickOptions.NO_PICK,
      priority,
    });
    const addPointRegistration = this.mapEventsManager.register({
      event: rectangleOptions.addPointEvent,
      pick: PickOptions.NO_PICK,
      priority,
    });
    const addLastPointRegistration = this.mapEventsManager.register({
      event: rectangleOptions.addLastPointEvent,
      pick: PickOptions.NO_PICK,
      priority,
    });

    this.observablesMap.set(id, [mouseMoveRegistration, addPointRegistration, addLastPointRegistration]);
    const editorObservable = this.createEditorObservable(clientEditSubject, id);

    mouseMoveRegistration.subscribe(({ movement: { endPosition } }) => {
      const position = this.screenToPosition(endPosition, options.clampHeightTo3D);

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
      const position = this.screenToPosition(endPosition, options.clampHeightTo3D);
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

      if (rectangleOptions.maximumNumberOfPoints && allPositions.length + 1 === rectangleOptions.maximumNumberOfPoints) {
        finishedCreate = this.switchToEditMode(
          id,
          position,
          clientEditSubject,
          positions,
          priority,
          rectangleOptions,
          editorObservable,
          finishedCreate);
      }
    });


    addLastPointRegistration.subscribe(({ movement: { endPosition } }) => {
      const position = this.screenToPosition(endPosition, options.clampHeightTo3D);
      if (!position) {
        return;
      }
      // position already added by addPointRegistration
      finishedCreate = this.switchToEditMode(
        id,
        position,
        clientEditSubject,
        positions,
        priority,
        rectangleOptions,
        editorObservable,
        finishedCreate);
    });

    return editorObservable;
  }

  private switchToEditMode(id,
                           position,
                           clientEditSubject,
                           positions: Cartesian3[],
                           priority,
                           rectangleOptions,
                           editorObservable,
                           finishedCreate: boolean) {
    const updateValue = {
      id,
      positions: this.getPositions(id),
      editMode: EditModes.CREATE,
      updatedPosition: position,
      editAction: EditActions.ADD_LAST_POINT,
    };
    this.updateSubject.next(updateValue);
    clientEditSubject.next({
      ...updateValue,
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
    this.editRectangle(id, positions, priority, clientEditSubject, rectangleOptions, editorObservable);
    finishedCreate = true;
    return finishedCreate;
  }

  edit(positions: Cartesian3[], options = DEFAULT_RECTANGLE_OPTIONS, priority = 100): RectangleEditorObservable {
    if (positions.length < 3) {
      throw new Error('Rectangles editor error edit(): rectangle should have at least 3 positions');
    }
    const id = generateKey();
    const rectangleOptions = this.setOptions(options);
    const editSubject = new BehaviorSubject<RectangleEditUpdate>({
      id,
      editAction: null,
      editMode: EditModes.EDIT
    });
    const update = {
      id,
      positions: positions,
      editMode: EditModes.EDIT,
      editAction: EditActions.INIT,
      rectangleOptions: rectangleOptions,
    };
    this.updateSubject.next(update);
    editSubject.next({
      ...update,
      positions: this.getPositions(id),
      points: this.getPoints(id),
    });
    return this.editRectangle(
      id,
      positions,
      priority,
      editSubject,
      rectangleOptions
    );
  }

  private editRectangle(id: string,
                      positions: Cartesian3[],
                      priority: number,
                      editSubject: Subject<RectangleEditUpdate>,
                      options: RectangleEditOptions,
                      editObservable?: RectangleEditorObservable): RectangleEditorObservable {

    const pointDragRegistration = this.mapEventsManager.register({
      event: options.dragPointEvent,
      entityType: EditPoint,
      pick: PickOptions.PICK_FIRST,
      priority,
      pickFilter: entity => id === entity.editedEntityId,
    });

    let shapeDragRegistration;
    if (options.allowDrag) {
      shapeDragRegistration = this.mapEventsManager.register({
        event: options.dragShapeEvent,
        entityType: EditableRectangle,
        pick: PickOptions.PICK_FIRST,
        priority,
        pickFilter: entity => id === entity.id,
      });
    }
    const pointRemoveRegistration = this.mapEventsManager.register({
      event: options.removePointEvent,
      entityType: EditPoint,
      pick: PickOptions.PICK_FIRST,
      priority,
      pickFilter: entity => id === entity.editedEntityId,
    });

    pointDragRegistration.pipe(
      tap(({ movement: { drop } }) => this.cameraService.enableInputs(drop)))
      .subscribe(({ movement: { endPosition, drop }, entities }) => {
        const position = this.screenToPosition(endPosition, options.clampHeightTo3D);
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
      });

    if (shapeDragRegistration) {
      shapeDragRegistration
        .pipe(tap(({ movement: { drop } }) => this.cameraService.enableInputs(drop)))
        .subscribe(({ movement: { startPosition, endPosition, drop }, entities }) => {
          const endDragPosition = this.screenToPosition(endPosition, false);
          const startDragPosition = this.screenToPosition(startPosition, false);
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

    pointRemoveRegistration.subscribe(({ entities }) => {
      const point: EditPoint = entities[0];
      const allPositions = [...this.getPositions(id)];
      if (allPositions.length < 4) {
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
    });

    const observables = [pointDragRegistration, pointRemoveRegistration];
    if (shapeDragRegistration) {
      observables.push(shapeDragRegistration);
    }

    this.observablesMap.set(id, observables);
    return editObservable || this.createEditorObservable(editSubject, id);
  }

  private setOptions(options: RectangleEditOptions) {
    if (options.maximumNumberOfPoints && options.maximumNumberOfPoints < 3) {
      console.warn('Warn: RectangleEditor invalid option.' +
        ' maximumNumberOfPoints smaller then 3, maximumNumberOfPoints changed to 3');
      options.maximumNumberOfPoints = 3;
    }

    const defaultClone = JSON.parse(JSON.stringify(DEFAULT_RECTANGLE_OPTIONS));
    const rectangleOptions: RectangleEditOptions = Object.assign(defaultClone, options);
    rectangleOptions.pointProps = Object.assign({}, DEFAULT_RECTANGLE_OPTIONS.pointProps, options.pointProps);
    rectangleOptions.rectangleProps = Object.assign({}, DEFAULT_RECTANGLE_OPTIONS.rectangleProps, options.rectangleProps);
    rectangleOptions.polylineProps = Object.assign({}, DEFAULT_RECTANGLE_OPTIONS.polylineProps, options.polylineProps);

    if (options.clampHeightTo3D) {
      if (!this.cesiumScene.pickPositionSupported || !this.cesiumScene.clampToHeightSupported) {
        throw new Error(`Cesium pickPosition and clampToHeight must be supported to use clampHeightTo3D`);
      }

      if (this.cesiumScene.pickTranslucentDepth) {
        console.warn(`Cesium scene.pickTranslucentDepth must be false in order to make the editors work properly on 3D`);
      }

      if (rectangleOptions.pointProps.color.alpha === 1 || rectangleOptions.pointProps.outlineColor.alpha === 1) {
        console.warn('Point color and outline color must have alpha in order to make the editor work properly on 3D');
      }

      rectangleOptions.allowDrag = false;
      rectangleOptions.polylineProps.clampToGround = true;
      rectangleOptions.pointProps.heightReference =  rectangleOptions.clampHeightTo3DOptions.clampToTerrain ?
        Cesium.HeightReference.CLAMP_TO_GROUND : Cesium.HeightReference.RELATIVE_TO_GROUND;
      rectangleOptions.pointProps.disableDepthTestDistance = Number.POSITIVE_INFINITY;
    }
    return rectangleOptions;
  }


  private createEditorObservable(observableToExtend: any, id: string): RectangleEditorObservable {
    observableToExtend.dispose = () => {
      const observables = this.observablesMap.get(id);
      if (observables) {
        observables.forEach(obs => obs.dispose());
      }
      this.observablesMap.delete(id);
      this.updateSubject.next({
        id,
        positions: this.getPositions(id),
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
      position: Cartesian3, pointProps: PointProps
    }[] | Cartesian3[], rectangleProps?: RectangleProps) => {
      const rectangle = this.rectanglesManager.get(id);
      rectangle.setPointsManually(points, rectangleProps);
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

    observableToExtend.getCurrentPoints = () => this.getPoints(id);

    observableToExtend.getEditValue = () => observableToExtend.getValue();

    observableToExtend.getLabels = (): LabelProps[] => this.rectanglesManager.get(id).labels;

    return observableToExtend as RectangleEditorObservable;
  }

  private getPositions(id: string) {
    const rectangle = this.rectanglesManager.get(id);
    return rectangle.getRealPositions();
  }

  private getPoints(id: string) {
    const rectangle = this.rectanglesManager.get(id);
    return rectangle.getRealPoints();
  }
}

