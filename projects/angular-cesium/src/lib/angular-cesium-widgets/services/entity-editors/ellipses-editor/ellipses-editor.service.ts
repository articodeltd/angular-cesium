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
import { EllipseEditUpdate } from '../../../models/ellipse-edit-update';
import { EllipsesManagerService } from './ellipses-manager.service';
import { EllipseEditorObservable } from '../../../models/ellipse-editor-observable';
import { EllipseEditOptions, EllipseProps } from '../../../models/ellipse-edit-options';
import { EditableEllipse } from '../../../models/editable-ellipse';
import { PointProps } from '../../../models/point-edit-options';
import { LabelProps } from '../../../models/label-props';
import { BasicEditUpdate } from '../../../models/basic-edit-update';
import { generateKey } from '../../utils';
import { CesiumEventModifier } from '../../../../angular-cesium/services/map-events-mananger/consts/cesium-event-modifier.enum';
import { CesiumService } from '../../../../angular-cesium';

export const DEFAULT_ELLIPSE_OPTIONS: EllipseEditOptions = {
  addPointEvent: CesiumEvent.LEFT_CLICK,
  dragPointEvent: CesiumEvent.LEFT_CLICK_DRAG,
  dragShapeEvent: CesiumEvent.LEFT_CLICK_DRAG,
  circleToEllipseTransformEvent: CesiumEvent.LEFT_CLICK,
  circleToEllipseTransformEventModifier: CesiumEventModifier.ALT,
  allowDrag: true,
  ellipseProps: {
    material: Color.CORNFLOWERBLUE.withAlpha(0.4),
    fill: true,
    outline: true,
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
    material: () => Color.WHITE,
  },
  circleToEllipseTransformation: false,
};

/**
 * Service for creating editable ellipses
 *
 * You must provide `EllipsesEditorService` yourself.
 * EllipsesEditorService works together with `<ellipse-editor>` component. Therefor you need to create `<ellipse-editor>`
 * for each `EllipsesEditorService`, And of course somewhere under `<ac-map>`/
 *
 * + `create` for starting a creation of the shape over the map. Returns a extension of `EllipseEditorObservable`.
 * + `edit` for editing shape over the map starting from a given positions. Returns an extension of `EllipseEditorObservable`.
 * + To stop editing call `dispose()` from the `EllipseEditorObservable` you get back from `create()` \ `edit()`.
 *
 * **Labels over edited shapes**
 * Angular Cesium allows you to draw labels over a shape that is being edited with one of the editors.
 * To add label drawing logic to your editor use the function `setLabelsRenderFn()` that is defined on the
 * `EllipseEditorObservable` that is returned from calling `create()` \ `edit()` of one of the editor services.
 * `setLabelsRenderFn()` - receives a callback that is called every time the shape is redrawn
 * (except when the shape is being dragged). The callback is called with the last shape state and with an array of the current labels.
 * The callback should return type `LabelProps[]`.
 * You can also use `updateLabels()` to pass an array of labels of type `LabelProps[]` to be drawn.
 *
 * usage:
 * ```typescript
 *  // Start creating ellipse
 *  const editing$ = ellipsesEditorService.create();
 *  this.editing$.subscribe(editResult => {
 *				console.log(editResult.positions);
 *		});
 *
 *  // Or edit ellipse from existing center point, two radiuses and rotation
 *  const editing$ = this.ellipsesEditorService.edit(center, majorRadius, rotation, minorRadius);
 *
 * ```
 */
@Injectable()
export class EllipsesEditorService {
  private mapEventsManager: MapEventsManagerService;
  private updateSubject = new Subject<EllipseEditUpdate>();
  private updatePublisher = publish<EllipseEditUpdate>()(this.updateSubject); // TODO maybe not needed
  private coordinateConverter: CoordinateConverter;
  private cameraService: CameraService;
  private ellipsesManager: EllipsesManagerService;
  private observablesMap = new Map<string, DisposableObservable<any>[]>();
  private cesiumScene: any;

  init(
    mapEventsManager: MapEventsManagerService,
    coordinateConverter: CoordinateConverter,
    cameraService: CameraService,
    ellipsesManager: EllipsesManagerService,
    cesiumViewer: CesiumService,
  ) {
    this.mapEventsManager = mapEventsManager;
    this.coordinateConverter = coordinateConverter;
    this.cameraService = cameraService;
    this.ellipsesManager = ellipsesManager;
    this.updatePublisher.connect();

    this.cesiumScene = cesiumViewer.getScene();
  }

  onUpdate(): Observable<EllipseEditUpdate> {
    return this.updatePublisher;
  }

  create(options = DEFAULT_ELLIPSE_OPTIONS, priority = 100): EllipseEditorObservable {
    let center: any;
    const id = generateKey();
    const ellipseOptions = this.setOptions(options);
    const clientEditSubject = new BehaviorSubject<EllipseEditUpdate>({
      id,
      editAction: null,
      editMode: EditModes.CREATE,
    });
    let finishedCreate = false;

    this.updateSubject.next({
      id,
      editMode: EditModes.CREATE,
      editAction: EditActions.INIT,
      ellipseOptions,
    });

    const finishCreation = (position: Cartesian3) => {
      const update: EllipseEditUpdate = {
        id,
        center,
        updatedPosition: position,
        editMode: EditModes.CREATE,
        editAction: EditActions.ADD_LAST_POINT,
      };
      this.updateSubject.next(update);
      clientEditSubject.next({
        ...update,
      });

      const changeMode: EllipseEditUpdate = {
        id,
        center,
        editMode: EditModes.CREATE,
        editAction: EditActions.CHANGE_TO_EDIT,
      };

      this.updateSubject.next(changeMode);
      clientEditSubject.next({
        ...update,
      });
      if (this.observablesMap.has(id)) {
        this.observablesMap.get(id).forEach(registration => registration.dispose());
      }
      this.observablesMap.delete(id);
      this.editEllipse(id, priority, clientEditSubject, ellipseOptions, editorObservable);
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
      event: ellipseOptions.addPointEvent,
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
        const update: EllipseEditUpdate = {
          id,
          center: position,
          editMode: EditModes.CREATE,
          editAction: EditActions.ADD_POINT,
        };
        this.updateSubject.next(update);
        clientEditSubject.next({
          ...update,
        });
        center = position;
      } else {
        finishedCreate = finishCreation(position);
      }
    });

    mouseMoveRegistration.subscribe(({ movement: { endPosition } }) => {
      if (!center) {
        return;
      }
      const position = this.coordinateConverter.screenToCartesian3(endPosition);

      if (position) {
        const update: EllipseEditUpdate = {
          id,
          center,
          updatedPosition: position,
          editMode: EditModes.CREATE,
          editAction: EditActions.MOUSE_MOVE,
        };
        this.updateSubject.next(update);
        clientEditSubject.next({
          ...update,
        });
      }
    });

    return editorObservable;
  }

  edit(
    center: Cartesian3,
    majorRadius: number,
    rotation = Math.PI / 2,
    minorRadius?: number,
    options = DEFAULT_ELLIPSE_OPTIONS,
    priority = 100,
  ): EllipseEditorObservable {
    const id = generateKey();
    const ellipseOptions = this.setOptions(options);
    const editSubject = new BehaviorSubject<EllipseEditUpdate>({
      id,
      editAction: null,
      editMode: EditModes.EDIT,
    });

    const update: EllipseEditUpdate = {
      id,
      center,
      majorRadius,
      rotation,
      minorRadius,
      editMode: EditModes.EDIT,
      editAction: EditActions.INIT,
      ellipseOptions,
    };
    this.updateSubject.next(update);
    editSubject.next({
      ...update,
    });

    return this.editEllipse(id, priority, editSubject, ellipseOptions);
  }

  private editEllipse(
    id: string,
    priority: number,
    editSubject: Subject<EllipseEditUpdate>,
    options: EllipseEditOptions,
    editObservable?: EllipseEditorObservable,
  ): EllipseEditorObservable {
    const pointDragRegistration = this.mapEventsManager.register({
      event: options.dragPointEvent,
      entityType: EditPoint,
      pickConfig: options.pickConfiguration,
      pick: PickOptions.PICK_FIRST,
      priority,
      pickFilter: entity => id === entity.editedEntityId,
    });

    let addSecondRadiusRegistration;
    if (options.circleToEllipseTransformation) {
      addSecondRadiusRegistration = this.mapEventsManager.register({
        event: options.circleToEllipseTransformEvent,
        modifier: options.circleToEllipseTransformEventModifier,
        entityType: EditableEllipse,
        pickConfig: options.pickConfiguration,
        pick: PickOptions.PICK_FIRST,
        priority,
        pickFilter: entity => id === entity.id,
      });
    }

    let shapeDragRegistration;
    if (options.allowDrag) {
      shapeDragRegistration = this.mapEventsManager.register({
        event: options.dragShapeEvent,
        entityType: EditableEllipse,
        pickConfig: options.pickConfiguration,
        pick: PickOptions.PICK_FIRST,
        priority: priority,
        pickFilter: entity => id === entity.id,
      });
    }

    pointDragRegistration
      .pipe(tap(({ movement: { drop } }) => this.ellipsesManager.get(id).enableEdit && this.cameraService.enableInputs(drop)))
      .subscribe(({ movement: { endPosition, startPosition, drop }, entities }) => {
        const startDragPosition = this.coordinateConverter.screenToCartesian3(startPosition);
        const endDragPosition = this.coordinateConverter.screenToCartesian3(endPosition);
        if (!endDragPosition) {
          return;
        }

        const point: EditPoint = entities[0];
        const pointIsCenter = point === this.getCenterPoint(id);
        let editAction;
        if (drop) {
          editAction = pointIsCenter ? EditActions.DRAG_SHAPE_FINISH : EditActions.DRAG_POINT_FINISH;
        } else {
          editAction = pointIsCenter ? EditActions.DRAG_SHAPE : EditActions.DRAG_POINT;
        }

        if (!options.allowDrag && this.ellipsesManager.get(id).enableEdit &&
          (editAction === EditActions.DRAG_SHAPE || editAction === EditActions.DRAG_SHAPE_FINISH)) {
          this.cameraService.enableInputs(true);
          return;
        }

        const update: EllipseEditUpdate = {
          id,
          updatedPoint: point,
          startDragPosition,
          endDragPosition,
          editMode: EditModes.EDIT,
          editAction,
          ...this.getEllipseProperties(id),
        };
        this.updateSubject.next(update);
        editSubject.next({
          ...update,
        });
      });

    if (addSecondRadiusRegistration) {
      addSecondRadiusRegistration.subscribe(({ movement: { endPosition, startPosition, drop }, entities }) => {
        const update: EllipseEditUpdate = {
          id,
          editMode: EditModes.EDIT,
          editAction: EditActions.TRANSFORM,
          ...this.getEllipseProperties(id),
        };
        this.updateSubject.next(update);
        editSubject.next({
          ...update,
        });
      });
    }

    if (shapeDragRegistration) {
      shapeDragRegistration
        .pipe(tap(({ movement: { drop } }) => this.ellipsesManager.get(id).enableEdit && this.cameraService.enableInputs(drop)))
        .subscribe(({ movement: { startPosition, endPosition, drop } }) => {
          const startDragPosition = this.coordinateConverter.screenToCartesian3(startPosition);
          const endDragPosition = this.coordinateConverter.screenToCartesian3(endPosition);
          if (!endDragPosition || !startDragPosition) {
            return;
          }

          const update: EllipseEditUpdate = {
            id,
            startDragPosition,
            endDragPosition,
            editMode: EditModes.EDIT,
            editAction: drop ? EditActions.DRAG_SHAPE_FINISH : EditActions.DRAG_SHAPE,
            ...this.getEllipseProperties(id),
          };
          this.updateSubject.next(update);
          editSubject.next({
            ...update,
          });
        });
    }

    const observables = [pointDragRegistration];
    if (shapeDragRegistration) {
      observables.push(shapeDragRegistration);
    }
    if (addSecondRadiusRegistration) {
      observables.push(addSecondRadiusRegistration);
    }

    this.observablesMap.set(id, observables);
    return editObservable || this.createEditorObservable(editSubject, id);
  }

  private createEditorObservable(observableToExtend: any, id: string, finishCreation?: (position: Cartesian3) => boolean)
                                                                                                        : EllipseEditorObservable {
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
      } as EllipseEditUpdate);
    };

    observableToExtend.enable = () => {
      this.updateSubject.next({
        id,
        editMode: EditModes.EDIT,
        editAction: EditActions.ENABLE,
        ...this.getEllipseProperties(id),
      } as EllipseEditUpdate);
    };

    observableToExtend.disable = () => {
      this.updateSubject.next({
        id,
        editMode: EditModes.EDIT,
        editAction: EditActions.DISABLE,
        ...this.getEllipseProperties(id),
      } as EllipseEditUpdate);
    };

    observableToExtend.setManually = (
      center: Cartesian3,
      majorRadius: number,
      rotation?: number,
      minorRadius?: number,
      centerPointProp?: PointProps,
      radiusPointProp?: PointProps,
      ellipseProp?: EllipseProps,
    ) => {
      const ellipse = this.ellipsesManager.get(id);
      ellipse.setManually(center, majorRadius, rotation, minorRadius, centerPointProp, radiusPointProp, ellipseProp);
      this.updateSubject.next({
        id,
        editMode: EditModes.CREATE_OR_EDIT,
        editAction: EditActions.SET_MANUALLY,
      });
    };

    observableToExtend.setLabelsRenderFn = (callback: (update: BasicEditUpdate<any>, labels: LabelProps[]) => LabelProps[]) => {
      this.updateSubject.next({
        id,
        editMode: EditModes.CREATE_OR_EDIT,
        editAction: EditActions.SET_EDIT_LABELS_RENDER_CALLBACK,
        labelsRenderFn: callback,
      } as EllipseEditUpdate);
    };

    observableToExtend.updateLabels = (labels: LabelProps[]) => {
      this.updateSubject.next({
        id,
        editMode: EditModes.CREATE_OR_EDIT,
        editAction: EditActions.UPDATE_EDIT_LABELS,
        updateLabels: labels,
      } as EllipseEditUpdate);
    };

    observableToExtend.finishCreation = () => {
      if (!finishCreation) {
        throw new Error('Ellipses editor error edit(): cannot call finishCreation() on edit');
      }

      return finishCreation(null);
    };

    observableToExtend.getEditValue = () => observableToExtend.getValue();

    observableToExtend.getLabels = (): LabelProps[] => this.ellipsesManager.get(id).labels;
    observableToExtend.getCenter = (): Cartesian3 => this.getCenterPosition(id);
    observableToExtend.getMajorRadius = (): number => this.getMajorRadius(id);
    observableToExtend.getMinorRadius = (): number => this.getMinorRadius(id);

    return observableToExtend as EllipseEditorObservable;
  }

  private setOptions(options: EllipseEditOptions): EllipseEditOptions {
    const defaultClone = JSON.parse(JSON.stringify(DEFAULT_ELLIPSE_OPTIONS));
    const ellipseOptions = Object.assign(defaultClone, options);
    ellipseOptions.pointProps = Object.assign({}, DEFAULT_ELLIPSE_OPTIONS.pointProps, options.pointProps);
    ellipseOptions.ellipseProps = Object.assign({}, DEFAULT_ELLIPSE_OPTIONS.ellipseProps, options.ellipseProps);
    ellipseOptions.polylineProps = Object.assign({}, DEFAULT_ELLIPSE_OPTIONS.polylineProps, options.polylineProps);
    return ellipseOptions;
  }

  private getCenterPosition(id: string): Cartesian3 {
    return this.ellipsesManager.get(id).getCenter();
  }

  private getCenterPoint(id: string): EditPoint {
    return this.ellipsesManager.get(id).center;
  }

  private getMajorRadius(id: string): number {
    return this.ellipsesManager.get(id).getMajorRadius();
  }

  private getMinorRadius(id: string): number {
    return this.ellipsesManager.get(id).getMinorRadius();
  }

  private getEllipseProperties(id: string) {
    const ellipse = this.ellipsesManager.get(id);
    return {
      center: ellipse.getCenter(),
      rotation: ellipse.getRotation(),
      minorRadius: ellipse.getMinorRadius(),
      majorRadius: ellipse.getMajorRadius(),
      minorRadiusPointPosition: ellipse.getMinorRadiusPointPosition(),
      majorRadiusPointPosition: ellipse.getMajorRadiusPointPosition(),
    };
  }
}
