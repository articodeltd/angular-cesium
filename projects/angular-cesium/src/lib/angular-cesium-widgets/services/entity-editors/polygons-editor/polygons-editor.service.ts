import { publish, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { MapEventsManagerService } from '../../../../angular-cesium/services/map-events-mananger/map-events-manager';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { CesiumEvent } from '../../../../angular-cesium/services/map-events-mananger/consts/cesium-event.enum';
import { PickOptions } from '../../../../angular-cesium/services/map-events-mananger/consts/pickOptions.enum';
import { PolygonEditUpdate } from '../../../models/polygon-edit-update';
import { EditModes } from '../../../models/edit-mode.enum';
import { EditActions } from '../../../models/edit-actions.enum';
import { DisposableObservable } from '../../../../angular-cesium/services/map-events-mananger/disposable-observable';
import { CoordinateConverter } from '../../../../angular-cesium/services/coordinate-converter/coordinate-converter.service';
import { EditPoint } from '../../../models/edit-point';
import { CameraService } from '../../../../angular-cesium/services/camera/camera.service';
import { Cartesian3 } from '../../../../angular-cesium/models/cartesian3';
import { PolygonsManagerService } from './polygons-manager.service';
import { PolygonEditorObservable } from '../../../models/polygon-editor-observable';
import { EditablePolygon } from '../../../models/editable-polygon';
import { PolygonEditOptions, PolygonProps } from '../../../models/polygon-edit-options';
import { PointProps } from '../../../models/polyline-edit-options';
import { LabelProps } from '../../../models/label-props';
import { generateKey } from '../../utils';

export const DEFAULT_POLYGON_OPTIONS: PolygonEditOptions = {
  addPointEvent: CesiumEvent.LEFT_CLICK,
  addLastPointEvent: CesiumEvent.LEFT_DOUBLE_CLICK,
  removePointEvent: CesiumEvent.RIGHT_CLICK,
  dragPointEvent: CesiumEvent.LEFT_CLICK_DRAG,
  dragShapeEvent: CesiumEvent.LEFT_CLICK_DRAG,
  allowDrag: true,
  pointProps: {
    color: Cesium.Color.WHITE.withAlpha(0.9),
    outlineColor: Cesium.Color.BLACK,
    outlineWidth: 1,
    pixelSize: 15,
    virtualPointPixelSize: 8,
    show: true,
    showVirtual: true,
  },
  polygonProps: {
    material: new Cesium.Color(0.1, 0.5, 0.2, 0.4),
  },
  polylineProps: {
    material: () => Cesium.Color.BLACK,
    width: 1,
  },
};

/**
 * Service for creating editable polygons
 *
 * You must provide `PolygonsEditorService` yourself.
 * PolygonsEditorService works together with `<polygons-editor>` component. Therefor you need to create `<polygons-editor>`
 * for each `PolygonsEditorService`, And of course somewhere under `<ac-map>`/
 *
 * + `create` for starting a creation of the shape over the map. Returns a extension of `PolygonEditorObservable`.
 * + `edit` for editing shape over the map starting from a given positions. Returns an extension of `PolygonEditorObservable`.
 * + To stop editing call `dsipose()` from the `PolygonEditorObservable` you get back from `create()` \ `edit()`.
 *
 * **Labels over editted shapes**
 * Angular Cesium allows you to draw labels over a shape that is being edited with one of the editors.
 * To add label drawing logic to your editor use the function `setLabelsRenderFn()` that is defined on the
 * `PolygonEditorObservable` that is returned from calling `create()` \ `edit()` of one of the editor services.
 * `setLabelsRenderFn()` - receives a callback that is called every time the shape is redrawn
 * (except when the shape is being dragged). The callback is called with the last shape state and with an array of the current labels.
 * The callback should return type `LabelProps[]`.
 * You can also use `updateLabels()` to pass an array of labels of type `LabelProps[]` to be drawn.
 *
 * usage:
 * ```typescript
 *  // Start creating polygon
 *  const editing$ = polygonsEditorService.create();
 *  this.editing$.subscribe(editResult => {
 *				console.log(editResult.positions);
 *		});
 *
 *  // Or edit polygon from existing polygon positions
 *  const editing$ = this.polygonsEditorService.edit(initialPos);
 *
 * ```
 */
@Injectable()
export class PolygonsEditorService {
  private mapEventsManager: MapEventsManagerService;
  private updateSubject = new Subject<PolygonEditUpdate>();
  private updatePublisher = publish<PolygonEditUpdate>()(this.updateSubject); // TODO maybe not needed
  private coordinateConverter: CoordinateConverter;
  private cameraService: CameraService;
  private polygonsManager: PolygonsManagerService;
  private observablesMap = new Map<string, DisposableObservable<any>[]>();

  init(mapEventsManager: MapEventsManagerService,
       coordinateConverter: CoordinateConverter,
       cameraService: CameraService,
       polygonsManager: PolygonsManagerService) {
    this.mapEventsManager = mapEventsManager;
    this.coordinateConverter = coordinateConverter;
    this.cameraService = cameraService;
    this.polygonsManager = polygonsManager;
    this.updatePublisher.connect();
  }

  onUpdate(): Observable<PolygonEditUpdate> {
    return this.updatePublisher;
  }

  create(options = DEFAULT_POLYGON_OPTIONS, priority = 100): PolygonEditorObservable {
    const positions: Cartesian3[] = [];
    const id = generateKey();
    const polygonOptions = this.setOptions(options);

    const clientEditSubject = new BehaviorSubject<PolygonEditUpdate>({
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
      polygonOptions: polygonOptions,
    });

    const mouseMoveRegistration = this.mapEventsManager.register({
      event: CesiumEvent.MOUSE_MOVE,
      pick: PickOptions.NO_PICK,
      priority,
    });
    const addPointRegistration = this.mapEventsManager.register({
      event: polygonOptions.addPointEvent,
      pick: PickOptions.NO_PICK,
      priority,
    });
    const addLastPointRegistration = this.mapEventsManager.register({
      event: polygonOptions.addLastPointEvent,
      pick: PickOptions.NO_PICK,
      priority,
    });

    this.observablesMap.set(id, [mouseMoveRegistration, addPointRegistration, addLastPointRegistration]);
    const editorObservable = this.createEditorObservable(clientEditSubject, id);

    mouseMoveRegistration.subscribe(({movement: {endPosition}}) => {
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

    addPointRegistration.subscribe(({movement: {endPosition}}) => {
      if (finishedCreate) {
        return;
      }
      const position = this.coordinateConverter.screenToCartesian3(endPosition);
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

      if (polygonOptions.maximumNumberOfPoints && allPositions.length + 1 === polygonOptions.maximumNumberOfPoints) {
        finishedCreate = this.switchToEditMode(
          id,
          position,
          clientEditSubject,
          positions,
          priority,
          polygonOptions,
          editorObservable,
          finishedCreate);
      }
    });


    addLastPointRegistration.subscribe(({movement: {endPosition}}) => {
      const position = this.coordinateConverter.screenToCartesian3(endPosition);
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
        polygonOptions,
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
                           polygonOptions,
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
    this.editPolygon(id, positions, priority, clientEditSubject, polygonOptions, editorObservable);
    finishedCreate = true;
    return finishedCreate;
  }

  edit(positions: Cartesian3[], options = DEFAULT_POLYGON_OPTIONS, priority = 100): PolygonEditorObservable {
    if (positions.length < 3) {
      throw new Error('Polygons editor error edit(): polygon should have at least 3 positions');
    }
    const id = generateKey();
    const polygonOptions = this.setOptions(options);
    const editSubject = new BehaviorSubject<PolygonEditUpdate>({
      id,
      editAction: null,
      editMode: EditModes.EDIT
    });
    const update = {
      id,
      positions: positions,
      editMode: EditModes.EDIT,
      editAction: EditActions.INIT,
      polygonOptions: polygonOptions,
    };
    this.updateSubject.next(update);
    editSubject.next({
      ...update,
      positions: this.getPositions(id),
      points: this.getPoints(id),
    });
    return this.editPolygon(
      id,
      positions,
      priority,
      editSubject,
      polygonOptions
    );
  }

  private editPolygon(id: string,
                      positions: Cartesian3[],
                      priority: number,
                      editSubject: Subject<PolygonEditUpdate>,
                      options: PolygonEditOptions,
                      editObservable?: PolygonEditorObservable): PolygonEditorObservable {

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
        entityType: EditablePolygon,
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
      tap(({movement: {drop}}) => this.cameraService.enableInputs(drop)))
      .subscribe(({movement: {endPosition, drop}, entities}) => {
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
        .pipe(tap(({movement: {drop}}) => this.cameraService.enableInputs(drop)))
        .subscribe(({movement: {startPosition, endPosition, drop}, entities}) => {
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

    pointRemoveRegistration.subscribe(({entities}) => {
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

  private setOptions(options: PolygonEditOptions) {
    if (options.maximumNumberOfPoints && options.maximumNumberOfPoints < 3) {
      console.warn('Warn: PolygonEditor invalid option.' +
        ' maximumNumberOfPoints smaller then 3, maximumNumberOfPoints changed to 3');
      options.maximumNumberOfPoints = 3;
    }

    const defaultClone = JSON.parse(JSON.stringify(DEFAULT_POLYGON_OPTIONS));
    const polygonOptions = Object.assign(defaultClone, options);
    polygonOptions.pointProps = Object.assign({}, DEFAULT_POLYGON_OPTIONS.pointProps, options.pointProps);
    polygonOptions.polygonProps = Object.assign({}, DEFAULT_POLYGON_OPTIONS.polygonProps, options.polygonProps);
    polygonOptions.polylineProps = Object.assign({}, DEFAULT_POLYGON_OPTIONS.polylineProps, options.polylineProps);
    return polygonOptions;
  }


  private createEditorObservable(observableToExtend: any, id: string): PolygonEditorObservable {
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
    }[] | Cartesian3[], polygonProps?: PolygonProps) => {
      const polygon = this.polygonsManager.get(id);
      polygon.setPointsManually(points, polygonProps);
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

    observableToExtend.getLabels = (): LabelProps[] => this.polygonsManager.get(id).labels;

    return observableToExtend as PolygonEditorObservable;
  }

  private getPositions(id: string) {
    const polygon = this.polygonsManager.get(id);
    return polygon.getRealPositions();
  }

  private getPoints(id: string) {
    const polygon = this.polygonsManager.get(id);
    return polygon.getRealPoints();
  }
}
