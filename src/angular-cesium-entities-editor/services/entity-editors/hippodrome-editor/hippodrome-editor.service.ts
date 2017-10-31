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
import { HippodromeEditOptions } from '../../../models/hippodrome-edit-options';
import { HippodromeManagerService } from './hippodrome-manager.service';
import { HippodromeEditorObservable } from '../../../models/hippodrome-editor-oboservable';
import { HippodromeEditUpdate } from '../../../models/hippodrome-edit-update';
import { EditableHippodrome } from '../../../models/editable-hippodrome';

export const DEFAULT_HIPPODROME_OPTIONS: HippodromeEditOptions = {
  addPointEvent: CesiumEvent.LEFT_CLICK,
  dragPointEvent: CesiumEvent.LEFT_CLICK_DRAG,
  dragShapeEvent: CesiumEvent.LEFT_CLICK_DRAG,
  allowDrag: false,
  hippodromeProps: {
    material: Cesium.Color.GREEN.withAlpha(0.5),
    width: 200000.0,
    outline: false,
  },
  defaultPointOptions: {
    color: Cesium.Color.WHITE,
    outlineColor: Cesium.Color.BLACK,
    outlineWidth: 1,
  },
};

/**
 * Service for creating editable hippodromes
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
  private updatePublisher = this.updateSubject.publish(); // TODO maybe not needed
  private counter = 0;
  private coordinateConverter: CoordinateConverter;
  private cameraService: CameraService;
  private hippodromeManager: HippodromeManagerService;
  private observablesMap = new Map<string, DisposableObservable<any>[]>();

  init(mapEventsManager: MapEventsManagerService,
       coordinateConverter: CoordinateConverter,
       cameraService: CameraService,
       managerService: HippodromeManagerService) {
    this.mapEventsManager = mapEventsManager;
    this.updatePublisher.connect();
    this.coordinateConverter = coordinateConverter;
    this.cameraService = cameraService;
    this.hippodromeManager = managerService;

  }

  onUpdate(): Observable<HippodromeEditUpdate> {
    return this.updatePublisher;
  }

  create(options = DEFAULT_HIPPODROME_OPTIONS, eventPriority = 100): HippodromeEditorObservable {
    const positions: Cartesian3[] = [];
    const id = this.generteId();
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

    const mouseMoveRegistration = this.mapEventsManager.register({
      event: CesiumEvent.MOUSE_MOVE,
      pick: PickOptions.NO_PICK,
      priority: eventPriority,
    });
    const addPointRegistration = this.mapEventsManager.register({
      event: hippodromeOptions.addPointEvent,
      pick: PickOptions.NO_PICK,
      priority: eventPriority,
    });

    this.observablesMap.set(id, [mouseMoveRegistration, addPointRegistration]);
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
        const changeMode = {
          id,
          editMode: EditModes.CREATE,
          editAction: EditActions.CHANGE_TO_EDIT,
        };
        this.updateSubject.next(changeMode);
        clientEditSubject.next(changeMode);
        this.observablesMap.get(id).forEach(registration => registration.dispose());
        this.observablesMap.delete(id);
        this.editHippodrome(id, eventPriority, clientEditSubject, hippodromeOptions, editorObservable);
        finishedCreate = true;
      }
    });

    return editorObservable;
  }

  edit(positions: Cartesian3[], options = DEFAULT_HIPPODROME_OPTIONS, priority = 100): HippodromeEditorObservable {
    if (positions.length !== 2) {
      throw new Error('Hippodrome editor error edit(): polygon should have 2 positions but received ' + positions);
    }
    const id = this.generteId();
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
    });
    return this.editHippodrome(
      id,
      priority,
      editSubject,
      hippodromeEditOptions
    )
  }

  private editHippodrome(id: string,
                         priority,
                         editSubject: Subject<HippodromeEditUpdate>,
                         options: HippodromeEditOptions,
                         editObservable?: HippodromeEditorObservable): HippodromeEditorObservable {
    let shapeDragRegistration;
    if (options.allowDrag) {
      shapeDragRegistration = this.mapEventsManager.register({
        event: options.dragShapeEvent,
        entityType: EditableHippodrome,
        pick: PickOptions.PICK_FIRST,
        priority,
      });
    }
    const pointDragRegistration = this.mapEventsManager.register({
      event: options.dragPointEvent,
      entityType: EditPoint,
      pick: PickOptions.PICK_FIRST,
      priority,
    });

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

    if (shapeDragRegistration) {
      shapeDragRegistration
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

    const observables = [pointDragRegistration];
    if (shapeDragRegistration) {
      observables.push(shapeDragRegistration)
    }

    this.observablesMap.set(id, observables);
    return this.createEditorObservable(editSubject, id);
  }

  private setOptions(options: HippodromeEditOptions): HippodromeEditOptions {
    const defaultClone = JSON.parse(JSON.stringify(DEFAULT_HIPPODROME_OPTIONS));
    const hippodromeOptions = Object.assign(defaultClone, options);
    hippodromeOptions.hippodromeProps = Object.assign({}, DEFAULT_HIPPODROME_OPTIONS.hippodromeProps, options.hippodromeProps);
    hippodromeOptions.defaultPointOptions = Object.assign({}, DEFAULT_HIPPODROME_OPTIONS.defaultPointOptions, options.defaultPointOptions);
    return hippodromeOptions;
  }


  private createEditorObservable(observableToExtend: any, id: string): HippodromeEditorObservable {
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
    observableToExtend.setPointsManually = (points: EditPoint[]) => {
      this.updateSubject.next({
        id,
        positions: points.map(p => p.getPosition()),
        points: points,
        editMode: EditModes.EDIT,
        editAction: EditActions.SET_MANUALLY,
      });
      observableToExtend.next({
        id,
        positions: this.getPositions(id),
        points: this.getPoints(id),
        editMode: EditModes.EDIT,
        editAction: EditActions.SET_MANUALLY,
      })
    };
    observableToExtend.getCurrentPoints = () => this.getPoints(id);

    observableToExtend.polygonEditValue = () => observableToExtend.getValue();

    return observableToExtend as HippodromeEditorObservable;
  }

  private generteId(): string {
    return 'edit-hippodrome-' + this.counter++;
  }

  private getPositions(id) {
    const hippodrome = this.hippodromeManager.get(id);
    return hippodrome.getRealPositions()
  }

  private getPoints(id) {
    const hippodrome = this.hippodromeManager.get(id);
    return hippodrome.getRealPoints();
  }
}
