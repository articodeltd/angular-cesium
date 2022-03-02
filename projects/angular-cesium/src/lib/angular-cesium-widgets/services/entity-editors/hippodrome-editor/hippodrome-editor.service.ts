import { publish, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Color, ClassificationType, ShadowMode, Cartesian3 } from 'cesium';
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
//import { Cartesian3 } from '../../../../angular-cesium/models/cartesian3';
import { HippodromeEditOptions } from '../../../models/hippodrome-edit-options';
import { HippodromeManagerService } from './hippodrome-manager.service';
import { HippodromeEditorObservable } from '../../../models/hippodrome-editor-oboservable';
import { HippodromeEditUpdate } from '../../../models/hippodrome-edit-update';
import { EditableHippodrome } from '../../../models/editable-hippodrome';
import { PointProps } from '../../../models/point-edit-options';
import { LabelProps } from '../../../models/label-props';
import { generateKey } from '../../utils';

export const DEFAULT_HIPPODROME_OPTIONS: HippodromeEditOptions = {
  addPointEvent: CesiumEvent.LEFT_CLICK,
  dragPointEvent: CesiumEvent.LEFT_CLICK_DRAG,
  dragShapeEvent: CesiumEvent.LEFT_CLICK_DRAG,
  allowDrag: true,
  hippodromeProps: {
    fill: true,
    material: Color.CORNFLOWERBLUE.withAlpha(0.4),
    outline: true,
    width: 200000.0,
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
};

/**
 * Service for creating editable hippodromes
 *
 * You must provide `HippodromeEditorService` yourself.
 * HippodromeEditorService works together with `<hippodromes-editor>` component. Therefor you need to create `<hippodromes-editor>`
 * for each `PolylineEditorService`, And of course somewhere under `<ac-map>`/
 *
 * + `create` for starting a creation of the shape over the map. Returns a extension of `HippodromeEditorObservable`.
 * + `edit` for editing shape over the map starting from a given positions. Returns an extension of `HippodromeEditorObservable`.
 * + To stop editing call `dsipose()` from the `HippodromeEditorObservable` you get back from `create()` \ `edit()`.
 *
 * **Labels over editted shapes**
 * Angular Cesium allows you to draw labels over a shape that is being edited with one of the editors.
 * To add label drawing logic to your editor use the function `setLabelsRenderFn()` that is defined on the
 * `HippodromeEditorObservable` that is returned from calling `create()` \ `edit()` of one of the editor services.
 * `setLabelsRenderFn()` - receives a callback that is called every time the shape is redrawn
 * (except when the shape is being dragged). The callback is called with the last shape state and with an array of the current labels.
 * The callback should return type `LabelProps[]`.
 * You can also use `updateLabels()` to pass an array of labels of type `LabelProps[]` to be drawn.
 *
 *
 * usage:
 * ```typescript
 *  // Start creating hippodrome
 *  const editing$ = hippodromeEditorService.create();
 *  this.editing$.subscribe(editResult => {
 *				console.log(editResult.positions);
 *		});
 *
 *  // Or edit hippodromes from existing hippodromes cartesian3 positions
 *  const editing$ = this.hippodromeEditor.edit(initialPos);
 *
 * ```
 */
@Injectable()
export class HippodromeEditorService {
  private mapEventsManager: MapEventsManagerService;
  private updateSubject = new Subject<HippodromeEditUpdate>();
  private updatePublisher = publish<HippodromeEditUpdate>()(this.updateSubject); // TODO maybe not needed
  private coordinateConverter: CoordinateConverter;
  private cameraService: CameraService;
  private hippodromeManager: HippodromeManagerService;
  private observablesMap = new Map<string, DisposableObservable<any>[]>();

  init(mapEventsManager: MapEventsManagerService,
       coordinateConverter: CoordinateConverter,
       cameraService: CameraService,
       managerService: HippodromeManagerService) {
    this.mapEventsManager = mapEventsManager;
    this.coordinateConverter = coordinateConverter;
    this.cameraService = cameraService;
    this.hippodromeManager = managerService;
    this.updatePublisher.connect();
  }

  onUpdate(): Observable<HippodromeEditUpdate> {
    return this.updatePublisher;
  }

  create(options = DEFAULT_HIPPODROME_OPTIONS, eventPriority = 100): HippodromeEditorObservable {
    const positions: Cartesian3[] = [];
    const id = generateKey();
    const hippodromeOptions = this.setOptions(options);

    const clientEditSubject = new BehaviorSubject<HippodromeEditUpdate>({
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
      hippodromeOptions: hippodromeOptions,
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
      this.editHippodrome(id, eventPriority, clientEditSubject, hippodromeOptions, editorObservable);
      finishedCreate = true;
      return finishedCreate;
    };

    const mouseMoveRegistration = this.mapEventsManager.register({
      event: CesiumEvent.MOUSE_MOVE,
      pickConfig: options.pickConfiguration,
      pick: PickOptions.NO_PICK,
      priority: eventPriority,
    });
    const addPointRegistration = this.mapEventsManager.register({
      event: hippodromeOptions.addPointEvent,
      pickConfig: options.pickConfiguration,
      pick: PickOptions.NO_PICK,
      priority: eventPriority,
    });

    this.observablesMap.set(id, [mouseMoveRegistration, addPointRegistration]);
    const editorObservable = this.createEditorObservable(clientEditSubject, id, finishCreation);

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
        width: this.getWidth(id),
      });

      if (!isFirstPoint) {
        finishedCreate = finishCreation();
      }
    });

    return editorObservable;
  }

  edit(positions: Cartesian3[], options = DEFAULT_HIPPODROME_OPTIONS, priority = 100): HippodromeEditorObservable {
    if (positions.length !== 2) {
      throw new Error('Hippodrome editor error edit(): polygon should have 2 positions but received ' + positions);
    }
    const id = generateKey();
    const hippodromeEditOptions = this.setOptions(options);
    const editSubject = new BehaviorSubject<HippodromeEditUpdate>({
      id,
      editAction: null,
      editMode: EditModes.EDIT
    });
    const update = {
      id,
      positions: positions,
      editMode: EditModes.EDIT,
      editAction: EditActions.INIT,
      hippodromeOptions: hippodromeEditOptions,
    };
    this.updateSubject.next(update);
    editSubject.next({
      ...update,
      positions: this.getPositions(id),
      points: this.getPoints(id),
      width: this.getWidth(id),
    });
    return this.editHippodrome(
      id,
      priority,
      editSubject,
      hippodromeEditOptions
    );
  }

  private editHippodrome(id: string,
                         priority: number,
                         editSubject: Subject<HippodromeEditUpdate>,
                         options: HippodromeEditOptions,
                         editObservable?: HippodromeEditorObservable): HippodromeEditorObservable {
    let shapeDragRegistration;
    if (options.allowDrag) {
      shapeDragRegistration = this.mapEventsManager.register({
        event: options.dragShapeEvent,
        entityType: EditableHippodrome,
        pick: PickOptions.PICK_FIRST,
        pickConfig: options.pickConfiguration,
        priority,
        pickFilter: entity => id === entity.id,
      });
    }
    const pointDragRegistration = this.mapEventsManager.register({
      event: options.dragPointEvent,
      entityType: EditPoint,
      pick: PickOptions.PICK_FIRST,
      pickConfig: options.pickConfiguration,
      priority,
      pickFilter: entity => id === entity.editedEntityId,
    });

    pointDragRegistration.pipe(
      tap(({movement: {drop}}) => this.hippodromeManager.get(id).enableEdit && this.cameraService.enableInputs(drop)))
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
          width: this.getWidth(id),
        });
      });

    if (shapeDragRegistration) {
      shapeDragRegistration
        .pipe(tap(({movement: {drop}}) => this.hippodromeManager.get(id).enableEdit && this.cameraService.enableInputs(drop)))
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
            width: this.getWidth(id),
          });
        });
    }

    const observables = [pointDragRegistration];
    if (shapeDragRegistration) {
      observables.push(shapeDragRegistration);
    }

    this.observablesMap.set(id, observables);
    return this.createEditorObservable(editSubject, id);
  }

  private setOptions(options: HippodromeEditOptions): HippodromeEditOptions {
    const defaultClone = JSON.parse(JSON.stringify(DEFAULT_HIPPODROME_OPTIONS));
    const hippodromeOptions = Object.assign(defaultClone, options);
    hippodromeOptions.hippodromeProps = Object.assign({}, DEFAULT_HIPPODROME_OPTIONS.hippodromeProps, options.hippodromeProps);
    hippodromeOptions.pointProps = Object.assign({}, DEFAULT_HIPPODROME_OPTIONS.pointProps, options.pointProps);
    return hippodromeOptions;
  }


  private createEditorObservable(observableToExtend: any, id: string, finishCreation?: () => boolean): HippodromeEditorObservable {
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
                                      widthMeters: number,
                                      firstPointProp?: PointProps,
                                      secondPointProp?: PointProps) => {
      const firstP = new EditPoint(id, firstPosition, firstPointProp ? firstPointProp : DEFAULT_HIPPODROME_OPTIONS.pointProps);
      const secP = new EditPoint(id, secondPosition, secondPointProp ? secondPointProp : DEFAULT_HIPPODROME_OPTIONS.pointProps);

      const hippodrome = this.hippodromeManager.get(id);
      hippodrome.setPointsManually([firstP, secP], widthMeters);
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
        throw new Error('Hippodrome editor error edit(): cannot call finishCreation() on edit');
      }

      return finishCreation();
    };

    observableToExtend.getCurrentPoints = () => this.getPoints(id);
    observableToExtend.getEditValue = () => observableToExtend.getValue();
    observableToExtend.getLabels = (): LabelProps[] => this.hippodromeManager.get(id).labels;
    observableToExtend.getCurrentWidth = (): number => this.getWidth(id);

    return observableToExtend as HippodromeEditorObservable;
  }

  private getPositions(id: any) {
    const hippodrome = this.hippodromeManager.get(id);
    return hippodrome.getRealPositions();
  }

  private getPoints(id: any) {
    const hippodrome = this.hippodromeManager.get(id);
    return hippodrome.getRealPoints();
  }

  private getWidth(id: string) {
    const hippodrome = this.hippodromeManager.get(id);
    return hippodrome.getWidth();
  }
}
