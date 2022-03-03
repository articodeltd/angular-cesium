import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { publish, tap } from 'rxjs/operators';
import { Color, ClassificationType, ShadowMode, Cartesian3 } from 'cesium';
import { CameraService } from '../../../../angular-cesium/services/camera/camera.service';
import { CoordinateConverter } from '../../../../angular-cesium/services/coordinate-converter/coordinate-converter.service';
import { GeoUtilsService } from '../../../../angular-cesium/services/geo-utils/geo-utils.service';
import { CesiumEvent } from '../../../../angular-cesium/services/map-events-mananger/consts/cesium-event.enum';
import { PickOptions } from '../../../../angular-cesium/services/map-events-mananger/consts/pickOptions.enum';
import { DisposableObservable } from '../../../../angular-cesium/services/map-events-mananger/disposable-observable';
import { MapEventsManagerService } from '../../../../angular-cesium/services/map-events-mananger/map-events-manager';
import { BasicEditUpdate } from '../../../models/basic-edit-update';
import { CircleEditOptions } from '../../../models/circle-edit-options';
import { CircleEditUpdate } from '../../../models/circle-edit-update';
import { CircleEditorObservable } from '../../../models/circle-editor-observable';
import { EditActions } from '../../../models/edit-actions.enum';
import { EditModes } from '../../../models/edit-mode.enum';
import { EditPoint } from '../../../models/edit-point';
import { EditableCircle } from '../../../models/editable-circle';
import { EllipseProps } from '../../../models/ellipse-edit-options';
import { LabelProps } from '../../../models/label-props';
import { PointProps } from '../../../models/point-edit-options';
import { generateKey } from '../../utils';
import { CirclesManagerService } from './circles-manager.service';

export const DEFAULT_CIRCLE_OPTIONS: CircleEditOptions = {
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
@Injectable()
export class CirclesEditorService {
  private mapEventsManager: MapEventsManagerService;
  private updateSubject = new Subject<CircleEditUpdate>();
  private updatePublisher = publish<CircleEditUpdate>()(this.updateSubject); // TODO maybe not needed
  private coordinateConverter: CoordinateConverter;
  private cameraService: CameraService;
  private circlesManager: CirclesManagerService;
  private observablesMap = new Map<string, DisposableObservable<any>[]>();

  init(
    mapEventsManager: MapEventsManagerService,
    coordinateConverter: CoordinateConverter,
    cameraService: CameraService,
    circlesManager: CirclesManagerService,
  ) {
    this.mapEventsManager = mapEventsManager;
    this.coordinateConverter = coordinateConverter;
    this.cameraService = cameraService;
    this.circlesManager = circlesManager;
    this.updatePublisher.connect();
  }

  onUpdate(): Observable<CircleEditUpdate> {
    return this.updatePublisher;
  }

  create(options = DEFAULT_CIRCLE_OPTIONS, priority = 100): CircleEditorObservable {
    let center: any;
    const id = generateKey();
    const circleOptions = this.setOptions(options);
    const clientEditSubject = new BehaviorSubject<CircleEditUpdate>({
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

    const finishCreation = (position: Cartesian3) => {
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

  edit(center: Cartesian3, radius: number, options = DEFAULT_CIRCLE_OPTIONS, priority = 100): CircleEditorObservable {
    const id = generateKey();
    const circleOptions = this.setOptions(options);
    const editSubject = new BehaviorSubject<CircleEditUpdate>({
      id,
      editAction: null,
      editMode: EditModes.EDIT,
    });

    const radiusPoint: Cartesian3 = GeoUtilsService.pointByLocationDistanceAndAzimuth(center, radius, Math.PI / 2, true);

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

  private editCircle(
    id: string,
    priority: number,
    editSubject: Subject<CircleEditUpdate>,
    options: CircleEditOptions,
    editObservable?: CircleEditorObservable,
  ): CircleEditorObservable {
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

        const point: EditPoint = entities[0];
        const pointIsCenter = point === this.getCenterPoint(id);
        let editAction;
        if (drop) {
          editAction = pointIsCenter ? EditActions.DRAG_SHAPE_FINISH : EditActions.DRAG_POINT_FINISH;
        } else {
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

  private createEditorObservable(observableToExtend: any, id: string, finishCreation?: (position: Cartesian3) => boolean)
                                                                                                        : CircleEditorObservable {
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

    observableToExtend.setManually = (
      center: Cartesian3,
      radius: number,
      centerPointProp?: PointProps,
      radiusPointProp?: PointProps,
      circleProp?: EllipseProps,
    ) => {
      const radiusPoint = GeoUtilsService.pointByLocationDistanceAndAzimuth(center, radius, Math.PI / 2, true);
      const circle = this.circlesManager.get(id);
      circle.setManually(center, radiusPoint, centerPointProp, radiusPointProp, circleProp);
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
        throw new Error('Circles editor error edit(): cannot call finishCreation() on edit');
      }

      return finishCreation(null);
    };

    observableToExtend.getEditValue = () => observableToExtend.getValue();

    observableToExtend.getLabels = (): LabelProps[] => this.circlesManager.get(id).labels;
    observableToExtend.getCenter = (): Cartesian3 => this.getCenterPosition(id);
    observableToExtend.getRadius = (): number => this.getRadius(id);

    return observableToExtend as CircleEditorObservable;
  }

  private setOptions(options: CircleEditOptions): CircleEditOptions {
    const defaultClone = JSON.parse(JSON.stringify(DEFAULT_CIRCLE_OPTIONS));
    const circleOptions = Object.assign(defaultClone, options);
    circleOptions.pointProps = Object.assign({}, DEFAULT_CIRCLE_OPTIONS.pointProps, options.pointProps);
    circleOptions.circleProps = Object.assign({}, DEFAULT_CIRCLE_OPTIONS.circleProps, options.circleProps);
    circleOptions.polylineProps = Object.assign({}, DEFAULT_CIRCLE_OPTIONS.polylineProps, options.polylineProps);
    return circleOptions;
  }

  private getCenterPosition(id: string): Cartesian3 {
    return this.circlesManager.get(id).getCenter();
  }

  private getCenterPoint(id: string): EditPoint {
    return this.circlesManager.get(id).center;
  }

  private getRadiusPosition(id: string): Cartesian3 {
    return this.circlesManager.get(id).getRadiusPoint();
  }

  private getRadius(id: string): number {
    return this.circlesManager.get(id).getRadius();
  }

  private getCircleProperties(id: string) {
    const circle = this.circlesManager.get(id);
    return {
      center: circle.getCenter(),
      radiusPoint: circle.getRadiusPoint(),
      radius: circle.getRadius(),
    };
  }
}
