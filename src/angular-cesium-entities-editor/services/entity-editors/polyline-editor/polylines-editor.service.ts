import { Injectable } from '@angular/core';
import { MapEventsManagerService } from '../../../../angular-cesium/services/map-events-mananger/map-events-manager';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { CesiumEvent } from '../../../../angular-cesium/services/map-events-mananger/consts/cesium-event.enum';
import { PickOptions } from '../../../../angular-cesium/services/map-events-mananger/consts/pickOptions.enum';
import { EditModes } from '../../../models/edit-mode.enum';
import { EditActions } from '../../../models/edit-actions.enum';
import { DisposableObservable } from '../../../../angular-cesium/services/map-events-mananger/disposable-observable';
import { CoordinateConverter } from '../../../../angular-cesium/services/coordinate-converter/coordinate-converter.service';
import { EditPoint } from '../../../models/edit-point';
import { CameraService } from '../../../../angular-cesium/services/camera/camera.service';
import { Cartesian3 } from '../../../../angular-cesium/models/cartesian3';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { PolylinesManagerService } from './polylines-manager.service';
import { PointProps, PolylineEditOptions, PolylineProps } from '../../../models/polyline-edit-options';
import { PolylineEditUpdate } from '../../../models/polyline-edit-update';
import { PolylineEditorObservable } from '../../../models/polyline-editor-observable';
import { EditPolyline } from '../../../models';
import { LabelProps } from '../../../models/label-props';

export const DEFAULT_POLYLINE_OPTIONS: PolylineEditOptions = {
  addPointEvent: CesiumEvent.LEFT_CLICK,
  addLastPointEvent: CesiumEvent.LEFT_DOUBLE_CLICK,
  removePointEvent: CesiumEvent.RIGHT_CLICK,
  dragPointEvent: CesiumEvent.LEFT_CLICK_DRAG,
  dragShapeEvent: CesiumEvent.LEFT_CLICK_DRAG,
  allowDrag: true,
  pointProps: {
    color: Cesium.Color.WHITE,
    outlineColor: Cesium.Color.BLACK,
    outlineWidth: 1,
  },
  polylineProps: {
    material: Cesium.Color.BLACK,
    width: 4,
  },
};

/**
 * Service for creating editable polylines
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
  private updatePublisher = this.updateSubject.publish(); // TODO maybe not needed
  private counter = 0;
  private coordinateConverter: CoordinateConverter;
  private cameraService: CameraService;
  private polylinesManager: PolylinesManagerService;
  private observablesMap = new Map<string, DisposableObservable<any>[]>();

  init(mapEventsManager: MapEventsManagerService,
       coordinateConverter: CoordinateConverter,
       cameraService: CameraService,
       polylinesManager: PolylinesManagerService) {
    this.mapEventsManager = mapEventsManager;
    this.updatePublisher.connect();
    this.coordinateConverter = coordinateConverter;
    this.cameraService = cameraService;
    this.polylinesManager = polylinesManager;

  }

  onUpdate(): Observable<PolylineEditUpdate> {
    return this.updatePublisher;
  }

  create(options = DEFAULT_POLYLINE_OPTIONS, eventPriority = 100): PolylineEditorObservable {
    const positions: Cartesian3[] = [];
    const id = this.generteId();
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

    const mouseMoveRegistration = this.mapEventsManager.register({
      event: CesiumEvent.MOUSE_MOVE,
      pick: PickOptions.NO_PICK,
      priority: eventPriority,
    });
    const addPointRegistration = this.mapEventsManager.register({
      event: polylineOptions.addPointEvent,
      pick: PickOptions.NO_PICK,
      priority: eventPriority,
    });
    const addLastPointRegistration = this.mapEventsManager.register({
      event: polylineOptions.addLastPointEvent,
      pick: PickOptions.NO_PICK,
      priority: eventPriority,
    });

    this.observablesMap.set(id, [mouseMoveRegistration, addPointRegistration, addLastPointRegistration]);
    const editorObservable = this.createEditorObservable(clientEditSubject, id);

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
    });


    addLastPointRegistration.subscribe(({ movement: { endPosition } }) => {
      const position = this.coordinateConverter.screenToCartesian3(endPosition);
      if (!position) {
        return;
      }
      // position already added by addPointRegistration
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
      this.editPolyline(id, positions, eventPriority, clientEditSubject, polylineOptions, editorObservable);
      finishedCreate = true;
    });

    return editorObservable;
  }

  edit(positions: Cartesian3[], options = DEFAULT_POLYLINE_OPTIONS, priority = 100): PolylineEditorObservable {
    if (positions.length < 2) {
      throw new Error('Polylines editor error edit(): polyline should have at least 2 positions');
    }
    const id = this.generteId();
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
    )
  }

  private editPolyline(id: string,
                       positions: Cartesian3[],
                       priority,
                       editSubject: Subject<PolylineEditUpdate>,
                       options: PolylineEditOptions,
                       editObservable?: PolylineEditorObservable) {

    const pointDragRegistration = this.mapEventsManager.register({
      event: options.dragPointEvent,
      entityType: EditPoint,
      pick: PickOptions.PICK_FIRST,
      priority,
    });

    const pointRemoveRegistration = this.mapEventsManager.register({
      event: options.removePointEvent,
      entityType: EditPoint,
      pick: PickOptions.PICK_FIRST,
      priority,
    });


    let shapeDragRegistration;
    if (options.allowDrag) {
      shapeDragRegistration = this.mapEventsManager.register({
        event: options.dragShapeEvent,
        entityType: EditPolyline,
        pick: PickOptions.PICK_FIRST,
        priority,
      });
    }


    if (shapeDragRegistration) {
      shapeDragRegistration
        .do(x => console.log(x))
        .do(({ movement: { drop } }) => this.cameraService.enableInputs(drop))
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

    pointDragRegistration
      .do(({ movement: { drop } }) => this.cameraService.enableInputs(drop))
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
    const polylineOptions = Object.assign(defaultClone, options);
    polylineOptions.pointProps = Object.assign({}, DEFAULT_POLYLINE_OPTIONS.pointProps, options.pointProps);
    polylineOptions.polylineProps = Object.assign({},
      DEFAULT_POLYLINE_OPTIONS.polylineProps, options.polylineProps);
    return polylineOptions;
  }


  private createEditorObservable(observableToExtend: any, id: string): PolylineEditorObservable {
    observableToExtend.dispose = () => {
      const observables = this.observablesMap.get(id);
      if (observables) {
        observables.forEach(obs => obs.dispose())
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

    observableToExtend.setLabelsRenderFn = (callback) => {
      this.updateSubject.next({
        id,
        editMode: EditModes.CREATE_OR_EDIT,
        editAction: EditActions.SET_EDIT_LABELS_RENDER_CALLBACK,
        labelsRenderFn: callback,
      })
    };

    observableToExtend.updateLabels = (labels: LabelProps[]) => {
      this.updateSubject.next({
        id,
        editMode: EditModes.CREATE_OR_EDIT,
        editAction: EditActions.UPDATE_EDIT_LABELS,
        updateLabels: labels,
      })
    };
    observableToExtend.getCurrentPoints = () => this.getPoints(id);

    observableToExtend.getEditValue = () => observableToExtend.getValue();

    observableToExtend.getLabels = (): LabelProps[] => this.polylinesManager.get(id).labels;

    return observableToExtend as PolylineEditorObservable;
  }

  private generteId(): string {
    return 'edit-polyline-' + this.counter++;
  }

  private getPositions(id) {
    const polyline = this.polylinesManager.get(id);
    return polyline.getRealPositions()
  }

  private getPoints(id) {
    const polyline = this.polylinesManager.get(id);
    return polyline.getRealPoints();
  }
}
