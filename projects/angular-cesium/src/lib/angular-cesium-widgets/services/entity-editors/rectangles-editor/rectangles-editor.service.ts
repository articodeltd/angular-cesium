import { publish, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Color, ClassificationType, HeightReference, Cartesian3 } from 'cesium';
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
import { RectanglesManagerService } from './rectangles-manager.service';
import { RectangleEditorObservable } from '../../../models/rectangle-editor-observable';
import { EditableRectangle } from '../../../models/editable-rectangle';
import { RectangleEditOptions } from '../../../models/rectangle-edit-options';
import { PointProps } from '../../../models/point-edit-options';
import { LabelProps } from '../../../models/label-props';
import { generateKey } from '../../utils';

export const DEFAULT_RECTANGLE_OPTIONS: RectangleEditOptions = {
  addPointEvent: CesiumEvent.LEFT_CLICK,
  dragPointEvent: CesiumEvent.LEFT_CLICK_DRAG,
  dragShapeEvent: CesiumEvent.LEFT_CLICK_DRAG,
  allowDrag: true,
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
  rectangleProps: {
    height: 0,
    extrudedHeight: 0,
    material: Color.CORNFLOWERBLUE.withAlpha(0.4),
    fill: true,
    classificationType: ClassificationType.BOTH,
    outline: true,
    outlineColor: Color.WHITE,
    zIndex: 0,
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

    const finishCreation = () => {
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
    };

    const mouseMoveRegistration = this.mapEventsManager.register({
      event: CesiumEvent.MOUSE_MOVE,
      pick: PickOptions.NO_PICK,
      pickConfig: options.pickConfiguration,
      priority,
    });
    const addPointRegistration = this.mapEventsManager.register({
      event: rectangleOptions.addPointEvent,
      pick: PickOptions.NO_PICK,
      pickConfig: options.pickConfiguration,
      priority,
    });

    this.observablesMap.set(id, [mouseMoveRegistration, addPointRegistration ]);
    const editorObservable = this.createEditorObservable(clientEditSubject, id, finishCreation);

    mouseMoveRegistration.subscribe(({ movement: { endPosition } }) => {
      const position = this.coordinateConverter.screenToCartesian3(endPosition);

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
      const position = this.coordinateConverter.screenToCartesian3(endPosition);
      if (!position) {
        return;
      }
      const allPositions = this.getPositions(id);
      const isFirstPoint = this.getPositions(id).length === 0;

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

      if (!isFirstPoint) {
        finishedCreate = finishCreation();
      }

    });

    return editorObservable;
  }

  edit(positions: Cartesian3[], options = DEFAULT_RECTANGLE_OPTIONS, priority = 100): RectangleEditorObservable {
    if (positions.length !== 2) {
      throw new Error('Rectangles editor error edit(): rectangle should have at least 2 positions');
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
      pickConfig: options.pickConfiguration,
      priority,
      pickFilter: entity => id === entity.editedEntityId,
    });

    let shapeDragRegistration;
    if (options.allowDrag) {
      shapeDragRegistration = this.mapEventsManager.register({
        event: options.dragShapeEvent,
        entityType: EditableRectangle,
        pick: PickOptions.PICK_FIRST,
        pickConfig: options.pickConfiguration,
        priority,
        pickFilter: entity => id === entity.id,
      });
    }

    pointDragRegistration.pipe(
      tap(({ movement: { drop } }) => this.rectanglesManager.get(id).enableEdit && this.cameraService.enableInputs(drop)))
      .subscribe(({ movement: { endPosition, drop }, entities }) => {
        const position = this.coordinateConverter.screenToCartesian3(endPosition);
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
        .pipe(tap(({ movement: { drop } }) => this.rectanglesManager.get(id).enableEdit && this.cameraService.enableInputs(drop)))
        .subscribe(({ movement: { startPosition, endPosition, drop }, entities }) => {
          const endDragPosition = this.coordinateConverter.screenToCartesian3(endPosition);
          const startDragPosition = this.coordinateConverter.screenToCartesian3(startPosition);
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

    const observables = [pointDragRegistration];
    if (shapeDragRegistration) {
      observables.push(shapeDragRegistration);
    }

    this.observablesMap.set(id, observables);
    return editObservable || this.createEditorObservable(editSubject, id);
  }

  private setOptions(options: RectangleEditOptions) {
    const defaultClone = JSON.parse(JSON.stringify(DEFAULT_RECTANGLE_OPTIONS));
    const rectangleOptions: RectangleEditOptions = Object.assign(defaultClone, options);
    rectangleOptions.pointProps = Object.assign({}, DEFAULT_RECTANGLE_OPTIONS.pointProps, options.pointProps);
    rectangleOptions.rectangleProps = Object.assign({}, DEFAULT_RECTANGLE_OPTIONS.rectangleProps, options.rectangleProps);

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

      rectangleOptions.pointProps.heightReference =  rectangleOptions.clampHeightTo3DOptions.clampToTerrain ?
        HeightReference.CLAMP_TO_GROUND : HeightReference.RELATIVE_TO_GROUND;
      rectangleOptions.pointProps.disableDepthTestDistance = Number.POSITIVE_INFINITY;
    }
    return rectangleOptions;
  }


  private createEditorObservable(observableToExtend: any, id: string, finishCreation?: () => boolean): RectangleEditorObservable {
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

    observableToExtend.setManually = (firstPosition: Cartesian3,
                                      secondPosition: Cartesian3,
                                      firstPointProp?: PointProps,
                                      secondPointProp?: PointProps) => {
      const firstP = new EditPoint(id, firstPosition, firstPointProp ? firstPointProp : DEFAULT_RECTANGLE_OPTIONS.pointProps);
      const secP = new EditPoint(id, secondPosition, secondPointProp ? secondPointProp : DEFAULT_RECTANGLE_OPTIONS.pointProps);

      const rectangle = this.rectanglesManager.get(id);
      rectangle.setPointsManually([firstP, secP]);
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
        throw new Error('Rectangles editor error edit(): cannot call finishCreation() on edit');
      }

      return finishCreation();
    };

    observableToExtend.getCurrentPoints = () => this.getPoints(id);

    observableToExtend.getEditValue = () => observableToExtend.getValue();

    observableToExtend.getLabels = (): LabelProps[] => this.rectanglesManager.get(id).labels;

    return observableToExtend as RectangleEditorObservable;
  }

  private getPositions(id: any) {
    const rectangle = this.rectanglesManager.get(id);
    return rectangle.getRealPositions();
  }

  private getPoints(id: any) {
    const rectangle = this.rectanglesManager.get(id);
    return rectangle.getRealPoints();
  }
}

