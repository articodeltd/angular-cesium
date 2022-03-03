import { publish, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Color, Cartesian3 } from 'cesium';
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
import { PointsManagerService } from './points-manager.service';
import { LabelProps } from '../../../models/label-props';
import { generateKey } from '../../utils';
import { CesiumService } from '../../../../angular-cesium';
import { PointEditOptions, PointProps } from '../../../models/point-edit-options';
import { PointEditUpdate } from '../../../models/point-edit-update';
import { PointEditorObservable } from '../../../models/point-editor-observable';

export const DEFAULT_POINT_OPTIONS: PointEditOptions = {
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
@Injectable()
export class PointsEditorService {
  private mapEventsManager: MapEventsManagerService;
  private updateSubject = new Subject<PointEditUpdate>();
  private updatePublisher = publish<PointEditUpdate>()(this.updateSubject); // TODO maybe not needed
  private coordinateConverter: CoordinateConverter;
  private cameraService: CameraService;
  private pointManager: PointsManagerService;
  private observablesMap = new Map<string, DisposableObservable<any>[]>();
  private cesiumScene;

  init(mapEventsManager: MapEventsManagerService,
       coordinateConverter: CoordinateConverter,
       cameraService: CameraService,
       pointManager: PointsManagerService,
       cesiumViewer: CesiumService) {
    this.mapEventsManager = mapEventsManager;
    this.coordinateConverter = coordinateConverter;
    this.cameraService = cameraService;
    this.pointManager = pointManager;
    this.updatePublisher.connect();

    this.cesiumScene = cesiumViewer.getScene();
  }

  onUpdate(): Observable<PointEditUpdate> {
    return this.updatePublisher;
  }

  private screenToPosition(cartesian2) {
    const cartesian3 = this.coordinateConverter.screenToCartesian3(cartesian2);

    // If cartesian3 is undefined then the point inst on the globe
    if (cartesian3) {
      const ray = this.cameraService.getCamera().getPickRay(cartesian2);
      return this.cesiumScene.globe.pick(ray, this.cesiumScene);
    }
    return cartesian3;
  }

  create(options = DEFAULT_POINT_OPTIONS, eventPriority = 100): PointEditorObservable {
    const id = generateKey();
    const pointOptions = this.setOptions(options);

    const clientEditSubject = new BehaviorSubject<PointEditUpdate>({
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

    const finishCreation = (position: Cartesian3) => {
      return this.switchToEditMode(
        id,
        clientEditSubject,
        position,
        eventPriority,
        pointOptions,
        editorObservable,
        true
      );
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

  private switchToEditMode(id,
                           clientEditSubject,
                           position: Cartesian3,
                           eventPriority,
                           pointOptions,
                           editorObservable,
                           finishedCreate: boolean) {
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

  edit(position: Cartesian3, options = DEFAULT_POINT_OPTIONS, priority = 100): PointEditorObservable {
    const id = generateKey();
    const pointOptions = this.setOptions(options);
    const editSubject = new BehaviorSubject<PointEditUpdate>({
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
    return this.editPoint(
      id,
      position,
      priority,
      editSubject,
      pointOptions
    );
  }

  private editPoint(id: string,
                       position: Cartesian3,
                       priority: number,
                       editSubject: Subject<PointEditUpdate>,
                       options: PointEditOptions,
                       editObservable?: PointEditorObservable) {
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

    pointDragRegistration.pipe(
      tap(({ movement: { drop } }) => this.cameraService.enableInputs(drop)))
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

  private setOptions(options: PointEditOptions) {
    const defaultClone = JSON.parse(JSON.stringify(DEFAULT_POINT_OPTIONS));
    const pointOptions: PointEditOptions = Object.assign(defaultClone, options);
    pointOptions.pointProps = {...DEFAULT_POINT_OPTIONS.pointProps, ...options.pointProps};
    pointOptions.pointProps = {...DEFAULT_POINT_OPTIONS.pointProps, ...options.pointProps};
    return pointOptions;
  }


  private createEditorObservable(observableToExtend: any, id: string, finishCreation?: (position: Cartesian3) => boolean)
                                                                                                    : PointEditorObservable {
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

    observableToExtend.setManually = (point: {
      position: Cartesian3,
      pointProp?: PointProps
    } | Cartesian3, pointProps?: PointProps) => {
      const newPoint = this.pointManager.get(id);
      newPoint.setManually(point, pointProps);
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
        throw new Error('Points editor error edit(): cannot call finishCreation() on edit');
      }

      return finishCreation(null);
    };

    observableToExtend.getCurrentPoint = () => this.getPoint(id);

    observableToExtend.getEditValue = () => observableToExtend.getValue();

    observableToExtend.getLabels = (): LabelProps[] => this.pointManager.get(id).labels;

    return observableToExtend as PointEditorObservable;
  }

  private getPosition(id: string) {
    const point = this.pointManager.get(id);
    return point.getPosition();
  }

  private getPoint(id: string) {
    const point = this.pointManager.get(id);
    if (point) {
      return point.getCurrentPoint();
    }
  }
}
