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

@Injectable()
export class PolygonsEditorService {
  private mapEventsManager: MapEventsManagerService;
  private updateSubject = new Subject<PolygonEditUpdate>();
  private updatePublisher = this.updateSubject.publish();
  private polygons = new Map<string, any[]>();
  private counter = 0;
  private coordinateConverter: CoordinateConverter;

  init(mapEventsManager: MapEventsManagerService, coordinateConverter: CoordinateConverter) {
    this.mapEventsManager = mapEventsManager;
    this.updatePublisher.connect();
    this.coordinateConverter = coordinateConverter;

  }

  onUpdate(): Observable<any> {
    return this.updatePublisher;
  }

  create(priority = 100): DisposableObservable<PolygonEditUpdate> {
    const editObservable = new Subject<PolygonEditUpdate>();
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

    const addPositionRegistration = this.mapEventsManager.register({
      event: CesiumEvent.LEFT_CLICK,
      pick: PickOptions.NO_PICK,
      priority,
    });
    addPositionRegistration.subscribe(({ movement: { endPosition } }) => {
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
      editObservable.next(updateValue);
    });

    const finishRegistration = this.mapEventsManager.register({
      event: CesiumEvent.LEFT_DOUBLE_CLICK,
      pick: PickOptions.NO_PICK,
      priority,
    });
    finishRegistration.subscribe(({ movement: { endPosition } }) => {
      const position = this.coordinateConverter.screenToCartesian3(endPosition);
      positions.push(position);
      const updateValue = {
        id,
        positions,
        editMode: EditModes.CREATE,
        updatedPosition: position,
        editAction: EditActions.DONE,
      };
      this.updateSubject.next(updateValue);
      editObservable.next(updateValue);
    });

    const disposableEditObservable = editObservable as any;
    disposableEditObservable.dispose = () => {
      mouseMoveRegistration.dispose();
      addPositionRegistration.dispose();
      finishRegistration.dispose();
      this.updateSubject.next({
        id,
        positions,
        editMode: EditModes.CREATE,
        editAction: EditActions.DISPOSE,
      })
    };

    return disposableEditObservable;
  }

  edit(polygon) {

  }

  private finishEdit(id: string) {

  }

  private cancelCreate(id: string) {

  }


  private generteId(): string {
    return 'edit-polygon-' + this.counter++;
  }
}
