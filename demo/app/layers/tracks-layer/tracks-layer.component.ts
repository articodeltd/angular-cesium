import { Component, OnInit, ViewChild } from '@angular/core';
import { ConnectableObservable, Observable, Subject } from 'rxjs';
import { AcNotification } from '../../../../src/models/ac-notification';
import { ActionType } from '../../../../src/models/action-type.enum';
import { AcLayerComponent } from '../../../../src/components/ac-layer/ac-layer.component';
import { MapEventsManagerService } from '../../../../src/services/map-events-mananger/map-events-manager';
import { CesiumEvent } from '../../../../src/services/map-events-mananger/consts/cesium-event.enum';
import { PickOptions } from '../../../../src/services/map-events-mananger/consts/pickOptions.enum';
import { AcEntity } from '../../../../src/models/ac-entity';
import { MdDialog } from '@angular/material';
import { TracksDialogComponent } from './track-dialog/track-dialog.component';

@Component({
  selector: 'tracks-layer',
  templateUrl: './tracks-layer.component.html',
  styleUrls: ['./tracks-layer.component.css']
})
export class TracksLayerComponent implements OnInit {
  @ViewChild(AcLayerComponent) layer: AcLayerComponent;

  tracks$: ConnectableObservable<AcNotification>;
  Cesium = Cesium;
  showTracks = true;
  private lastPickTrack;
  private tracks = new Map<number, any>();

  constructor(private mapEventsManager: MapEventsManagerService, public dialog: MdDialog) {
  }

  ngOnInit() {
    const socket = io.connect('http://localhost:3000');
    this.tracks$ = Observable.create((observer) => {
      socket.on('birds', (data) => {
        data.forEach(
          (acNotification) => {
            let action;
            if (acNotification.action === 'ADD_OR_UPDATE') {
              action = ActionType.ADD_UPDATE;
            }
            else if (acNotification.action === 'DELETE') {
              action = ActionType.DELETE;
            }
            acNotification.actionType = action;
            acNotification.entity = AcEntity.create(this.convertToCesiumObj(acNotification.entity));
            const entity = acNotification.entity;
            const track = this.tracks.get(acNotification.id);
            if (!this.tracks.has(acNotification.id)) {
              this.tracks.set(acNotification.id, entity);
            }
            else {
              Object.assign(track, entity);
              acNotification.entity = track;
            }
            observer.next(acNotification);
          });
      });
    }).publish();

    this.tracks$.connect();

    const mouseOverObservable = this.mapEventsManager.register({
      event: CesiumEvent.MOUSE_MOVE,
      pick: PickOptions.PICK_FIRST,
      priority: 2,
    });

    mouseOverObservable.subscribe((event) => {
      const track = event.entities !== null ? event.entities[0] : null;
      if (this.lastPickTrack && (!track || track.id !== this.lastPickTrack.id)) {
        this.lastPickTrack.picked = false;
        this.layer.update({
          entity: this.lastPickTrack,
          actionType: ActionType.ADD_UPDATE,
          id: this.lastPickTrack.id
        });
      }
      if (track && (!this.lastPickTrack || track.id !== this.lastPickTrack.id)) {
        track.picked = true;
        this.layer.update({ entity: track, actionType: ActionType.ADD_UPDATE, id: track.id });
      }
      this.lastPickTrack = track;
    });

    const doubleClickObservable = this.mapEventsManager.register({
      event: CesiumEvent.LEFT_DOUBLE_CLICK,
      pick: PickOptions.PICK_FIRST,
      priority: 2,
    });

    doubleClickObservable.subscribe((event) => {
      const track = event.entities !== null ? event.entities[0] : null;
      if (track) {
        this.openDialog(track);
      }
    });
  }

  openDialog(track) {
    this.dialog.closeAll();
    const end$ = new Subject();
    const trackObservable = this.getSingleTrackObservable(track.id, end$);
    const dialogUpdateStream = new Subject<AcNotification>();
    trackObservable.merge(dialogUpdateStream);
    this.dialog.open(TracksDialogComponent, { data: { trackObservable } }).afterClosed().subscribe(() => end$.next(0));
    dialogUpdateStream.next(track);
  }

  getSingleTrackObservable(trackId, end$) {
    return this.tracks$
      .filter((notification) => notification.id === trackId).map((notification) => notification.entity).takeUntil(end$);
  }

  getTrackColor(track): any {
    if (track.picked) {
      return Cesium.Color.YELLOW;
    }
    else {
      return track.isTarget ? Cesium.Color.RED : Cesium.Color.BLUE;
    }
  }

  getTextColor(track): any {
    return Cesium.Color.BLACK;
  }

  convertToCesiumObj(entity): any {
    entity.scale = entity.id === 1 ? 0.3 : 0.15;
    entity.altitude = Math.round(entity.position.altitude);
    entity.position = Cesium.Cartesian3.fromDegrees(entity.position.long, entity.position.lat, entity.position.altitude);
    return entity;
  }

  removeAll() {
    this.layer.removeAll();
  }

  setShow($event) {
    this.showTracks = $event;
  }
}
