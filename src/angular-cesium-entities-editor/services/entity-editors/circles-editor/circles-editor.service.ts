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
import { EditorObservable } from '../../../models/editor-observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { CircleEditUpdate } from '../../../models/circle-edit-update';
import { GeoUtilsService } from '../../../../angular-cesium/services/geo-utils/geo-utils.service';
import { CirclesManagerService } from './circles-manager.service';
import { EditableCircle } from '../../../models/editable-circle';
import { CircleEditorObservable } from '../../../models/circle-editor-observable';

/**
 * Service for creating editable circles
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
  private updatePublisher = this.updateSubject.publish(); // TODO maybe not needed
  private counter = 0;
  private coordinateConverter: CoordinateConverter;
  private cameraService: CameraService;
  private circlesManager: CirclesManagerService;

  init(mapEventsManager: MapEventsManagerService,
       coordinateConverter: CoordinateConverter,
       cameraService: CameraService,
       circlesManager: CirclesManagerService) {
    this.mapEventsManager = mapEventsManager;
    this.updatePublisher.connect();
    this.coordinateConverter = coordinateConverter;
    this.cameraService = cameraService;
    this.circlesManager = circlesManager;

  }

  onUpdate(): Observable<CircleEditUpdate> {
    return this.updatePublisher;
  }

  create(priority = 100): EditorObservable<CircleEditUpdate> {
    let center = undefined;
    const id = this.generteId();
    const clientEditSubject = new BehaviorSubject<CircleEditUpdate>({
      id,
      editAction: null,
      editMode: EditModes.CREATE
    });
    let finishedCreate = false;

    this.updateSubject.next({
      id,
      editMode: EditModes.CREATE,
      editAction: EditActions.INIT,
    });

    const mouseMoveRegistration = this.mapEventsManager.register({
      event: CesiumEvent.MOUSE_MOVE,
      pick: PickOptions.NO_PICK,
      priority,
    });
    const addPointRegistration = this.mapEventsManager.register({
      event: CesiumEvent.LEFT_CLICK,
      pick: PickOptions.NO_PICK,
      priority,
    });

    const editorObservable = this.createEditorObservable(
      clientEditSubject,
      [mouseMoveRegistration, addPointRegistration],
      id);

    addPointRegistration.subscribe(({ movement: { endPosition } }) => {
      if (finishedCreate) {
        return;
      }
      const position = this.coordinateConverter.screenToCartesian3(endPosition);
      if (!position) {
        return;
      }

      if (!center) {
        const updateValue = {
          id,
          center: position,
          editMode: EditModes.CREATE,
          editAction: EditActions.ADD_POINT,
        };
        this.updateSubject.next(updateValue);
        clientEditSubject.next(updateValue);
        center = position;
      }

      else {
        const updateValue = {
          id,
          center,
          radiusPoint: position,
          editMode: EditModes.CREATE,
          editAction: EditActions.ADD_LAST_POINT,
        };
        this.updateSubject.next(updateValue);
        clientEditSubject.next(updateValue);
      }

      const changeMode = {
        id,
        editMode: EditModes.CREATE,
        editAction: EditActions.CHANGE_TO_EDIT,
      };

      this.updateSubject.next(changeMode);
      clientEditSubject.next(changeMode);
      mouseMoveRegistration.dispose();
      addPointRegistration.dispose();
      this.editCircle(id, priority, clientEditSubject, editorObservable);
      finishedCreate = true;
    });

    mouseMoveRegistration.subscribe(({ movement: { endPosition } }) => {
      if (!center) {
        return;
      }
      const position = this.coordinateConverter.screenToCartesian3(endPosition);

      if (position) {
        this.updateSubject.next({
          id,
          center,
          radiusPoint: position,
          editMode: EditModes.CREATE,
          editAction: EditActions.MOUSE_MOVE,
        });
      }
    });

    return editorObservable;
  }

  edit(center: Cartesian3, radius: number, priority = 100): EditorObservable<CircleEditUpdate> {
    const id = this.generteId();
    const editSubject = new BehaviorSubject<CircleEditUpdate>({
      id,
      editAction: null,
      editMode: EditModes.EDIT
    });

    const radiusPoint: Cartesian3 = GeoUtilsService.pointByLocationDistanceAndAzimuth(center, radius, Math.PI / 2, true);

    const update = {
      id,
      center,
      radiusPoint,
      editMode: EditModes.EDIT,
      editAction: EditActions.INIT,
    };
    this.updateSubject.next(update);
    editSubject.next(update);
    return this.editCircle(
      id,
      priority,
      editSubject,
    )
  }

  private editCircle(id: string,
                     priority,
                     editSubject: Subject<CircleEditUpdate>,
                     editObservable?: EditorObservable<CircleEditUpdate>): EditorObservable<CircleEditUpdate> {

    const pointDragRegistration = this.mapEventsManager.register({
      event: CesiumEvent.LEFT_CLICK_DRAG,
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
        const pointIsCenter = point === this.getCenterPoint(id);
        let editAction;
        if (drop) {
          editAction = pointIsCenter ? EditActions.DRAG_SHAPE_FINISH : EditActions.DRAG_POINT_FINISH;
        }
        else {
          editAction = pointIsCenter ? EditActions.DRAG_SHAPE : EditActions.DRAG_POINT;
        }
        const update = {
          id,
          center: this.getCenterPosition(id),
          radiusPoint: this.getRadiusPosition(id),
          dragPosition: position,
          editMode: EditModes.EDIT,
          editAction,
        };
        this.updateSubject.next(update);
        editSubject.next(update);
      });

    return editObservable || this.createEditorObservable(editSubject,
      [pointDragRegistration],
      id);
  }


  private createEditorObservable(observableToExtend: any,
                                 disposableObservables: DisposableObservable<any>[],
                                 id: string): CircleEditorObservable<CircleEditUpdate> {
    observableToExtend.dispose = () => {
      disposableObservables.forEach(obs => obs.dispose());
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

    observableToExtend.setCircleManually = (center: Cartesian3, radius: number) => {
      const radiusPoint = GeoUtilsService.pointByLocationDistanceAndAzimuth(center, radius, Math.PI / 2, true);
      this.updateSubject.next({
        id,
        center: this.getCenterPosition(id),
        radiusPoint: radiusPoint,
        editMode: EditModes.EDIT,
        editAction: EditActions.SET_MANUALLY,
      });
      observableToExtend.next({
        id,
        center: this.getCenterPosition(id),
        radiusPoint: radiusPoint,
        editMode: EditModes.EDIT,
        editAction: EditActions.SET_MANUALLY,
      })
    };

    observableToExtend.circleEditValue = () => observableToExtend.getValue();

    return observableToExtend as CircleEditorObservable<CircleEditUpdate>;
  }

  private getCenterPosition(id): Cartesian3 {
    return this.circlesManager.get(id).getCenter();
  }

  private getCenterPoint(id): EditPoint {
    return this.circlesManager.get(id).center;
  }

  private getRadiusPosition(id): Cartesian3 {
    return this.circlesManager.get(id).getRadiusPoint();
  }

  private getCircle(id): EditableCircle {
    return this.circlesManager.get(id);
  }

  private generteId(): string {
    return 'edit-circle-' + this.counter++;
  }

}
