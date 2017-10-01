import { Injectable } from '@angular/core';
import { MapEventsManagerService } from '../../../../src/services/map-events-mananger/map-events-manager';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { CesiumEvent } from '../../../../src/services/map-events-mananger/consts/cesium-event.enum';
import { PickOptions } from '../../../../src/services/map-events-mananger/consts/pickOptions.enum';
import { PolygonEditUpdate } from '../../../models/polygon-edit-update';
import { EditModes } from '../../../models/edit-mode.enum';
import { EditActions } from '../../../models/edit-actions.enum';
import { DisposableObservable } from '../../../../src/services/map-events-mananger/disposable-observable';
import { CoordinateConverter } from '../../../../src/services/coordinate-converter/coordinate-converter.service';
import { EditPoint } from '../../../models/edit-point';
import { CameraService } from '../../../../src/services/camera/camera.service';
import { Cartesian3 } from '../../../../src/models/cartesian3';
import { EditorObservable } from '../../../models/editor-observable';

@Injectable()
export class PolygonsEditorService {
  static clickDebounceTime = 150;
  private mapEventsManager: MapEventsManagerService;
  private updateSubject = new Subject<PolygonEditUpdate>();
  private updatePublisher = this.updateSubject.publish();
  private polygons = new Map<string, any[]>();
  private counter = 0;
  private coordinateConverter: CoordinateConverter;
  private cameraService: CameraService;

  init(mapEventsManager: MapEventsManagerService, coordinateConverter: CoordinateConverter, cameraService: CameraService) {
    this.mapEventsManager = mapEventsManager;
    this.updatePublisher.connect();
    this.coordinateConverter = coordinateConverter;
    this.cameraService = cameraService;

  }

  onUpdate(): Observable<any> {
    return this.updatePublisher;
  }

  create(priority = 100): EditorObservable<PolygonEditUpdate> {
    let clickTimeOut;
    const editSubject = new Subject<PolygonEditUpdate>();
    const positions = [];
    const id = this.generteId();
    this.polygons.set(id, positions);

    this.updateSubject.next({
      id,
      positions,
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
    const addLastPointRegistration = this.mapEventsManager.register({
      event: CesiumEvent.LEFT_DOUBLE_CLICK,
      pick: PickOptions.NO_PICK,
      priority,
    });
    const editorObservable = this.createEditorObservable(
      editSubject,
      [mouseMoveRegistration, addPointRegistration, addLastPointRegistration],
      id);

    mouseMoveRegistration.subscribe(({ movement: { endPosition } }) => {
      const position = this.coordinateConverter.screenToCartesian3(endPosition);
      positions.push(position);
      this.updateSubject.next({
        id,
        positions,
        editMode: EditModes.CREATE,
        updatedPosition: position,
        editAction: EditActions.MOUSE_MOVE,
      });

      positions.pop();
    });

    addPointRegistration.subscribe(({ movement: { endPosition } }) => {
      clickTimeOut = setTimeout(() => {
        const position = this.coordinateConverter.screenToCartesian3(endPosition);
        positions.push(position);
        const updateValue = {
          id,
          positions,
          editMode: EditModes.CREATE,
          updatedPosition: position,
          editAction: EditActions.ADD_POINT,
        };
        this.updateSubject.next(updateValue);
        editSubject.next(updateValue);
      }, PolygonsEditorService.clickDebounceTime);
    });

    addLastPointRegistration.subscribe(({ movement: { endPosition } }) => {
      if (clickTimeOut) {
        clearTimeout(clickTimeOut);
      }

      const position = this.coordinateConverter.screenToCartesian3(endPosition);
      positions.push(position);
      const updateValue = {
        id,
        positions,
        editMode: EditModes.CREATE,
        updatedPosition: position,
        editAction: EditActions.ADD_LAST_POINT,
      };
      this.updateSubject.next(updateValue);
      editSubject.next(updateValue);

      const changeMode = {
        id,
        editMode: EditModes.CREATE,
        editAction: EditActions.CHANGE_TO_EDIT,
      };
      this.updateSubject.next(changeMode);
      editSubject.next(changeMode);
      mouseMoveRegistration.dispose();
      addPointRegistration.dispose();
      addLastPointRegistration.dispose();
      this.editPolygon(id, positions, priority, editSubject, editorObservable)

    });

    return editorObservable;
  }

  edit(positions: Cartesian3[], priority = 100): EditorObservable<PolygonEditUpdate> {
    const id = this.generteId();
    this.polygons.set(id, positions);
    this.updateSubject.next({
      id,
      positions,
      editMode: EditModes.EDIT,
      editAction: EditActions.INIT,
    });
    return this.editPolygon(
      id,
      positions,
      priority,
      new Subject<PolygonEditUpdate>(),
    )
  }

  private editPolygon(id: string,
                      positions: Cartesian3[],
                      priority,
                      editSubject: Subject<PolygonEditUpdate>,
                      editObservable?: EditorObservable<PolygonEditUpdate>): EditorObservable<PolygonEditUpdate> {
    this.polygons.set(id, positions);

    const pointDragRegistration = this.mapEventsManager.register({
      event: CesiumEvent.LEFT_CLICK_DRAG,
      entityType: EditPoint,
      pick: PickOptions.PICK_FIRST,
      priority,
    });
    const pointRemoveRegistration = this.mapEventsManager.register({
      event: CesiumEvent.RIGHT_CLICK,
      entityType: EditPoint,
      pick: PickOptions.PICK_FIRST,
      priority,
    });

    pointDragRegistration.subscribe(({ movement: { endPosition, drop }, entities }) => {
      if (!drop) {
        this.cameraService.enableInputs(false)
      } else {
        setTimeout(() => this.cameraService.enableInputs(true), 0);
      }
      const position = this.coordinateConverter.screenToCartesian3(endPosition);
      const point: EditPoint = entities[0];
      this.updateSubject.next({
        id,
        positions,
        editMode: EditModes.EDIT,
        updatedPosition: position,
        updatedEntity: point,
        editAction: EditActions.DRAG_POINT,
      });
    });

    pointRemoveRegistration.subscribe(({ entities }) => {
      const point: EditPoint = entities[0];
      const index = positions.findIndex(position => point.getPosition().equals(position as Cartesian3));
      if (!index) {
        return;
      }

      positions.slice(index, 1);
      this.updateSubject.next({
        id,
        positions,
        editMode: EditModes.EDIT,
        updatedPosition: point.getPosition(),
        editAction: EditActions.REMOVE_POINT,
      });
    });

    return editObservable || this.createEditorObservable(editSubject,
      [pointDragRegistration, pointRemoveRegistration],
      id);
  }


  private createEditorObservable(observableToExtend: any,
                                 disposableObservables: DisposableObservable<any>[],
                                 id: string): EditorObservable<PolygonEditUpdate> {
    const positions = this.polygons.get(id);
    observableToExtend.dispose = () => {
      this.polygons.delete(id);
      disposableObservables.forEach(obs => obs.dispose());
      this.updateSubject.next({
        id,
        positions,
        editMode: EditModes.CREATE_OR_EDIT,
        editAction: EditActions.DISPOSE,
      });
    };
    observableToExtend.enable = () => {
      this.updateSubject.next({
        id,
        positions,
        editMode: EditModes.CREATE_OR_EDIT,
        editAction: EditActions.ENABLE,
      });
    };
    observableToExtend.disable = () => {
      this.updateSubject.next({
        id,
        positions,
        editMode: EditModes.CREATE_OR_EDIT,
        editAction: EditActions.DISABLE,
      });
    };

    return observableToExtend as EditorObservable<PolygonEditUpdate>;
  }

  private generteId(): string {
    return 'edit-polygon-' + this.counter++;
  }
}
