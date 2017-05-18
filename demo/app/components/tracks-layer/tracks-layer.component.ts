import {
  ChangeDetectorRef,
  Component,
  Input,
  NgZone,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { ConnectableObservable, Observable } from 'rxjs';
import { AcNotification } from '../../../../src/models/ac-notification';
import { ActionType } from '../../../../src/models/action-type.enum';
import { AcLayerComponent } from '../../../../src/components/ac-layer/ac-layer.component';
import { MapEventsManagerService } from '../../../../src/services/map-events-mananger/map-events-manager';
import { CesiumEvent } from '../../../../src/services/map-events-mananger/consts/cesium-event.enum';
import { PickOptions } from '../../../../src/services/map-events-mananger/consts/pickOptions.enum';
import { AcEntity } from '../../../../src/models/ac-entity';
import { MdDialog } from '@angular/material';
import { TracksDialogComponent } from './track-dialog/track-dialog.component';
import { WebSocketSupplier } from '../../../utils/services/webSocketSupplier/webSocketSupplier';
import { RealTracksDataProvider } from '../../../utils/services/dataProvider/real-tracks-data-provider';
import { AppSettingsService } from '../../services/app-settings-service/app-settings-service';
@Component({
  selector: 'tracks-layer',
  templateUrl: './tracks-layer.component.html',
  providers: [RealTracksDataProvider],
  styleUrls: ['./tracks-layer.component.css']
})
export class TracksLayerComponent implements OnInit, OnChanges {

  @ViewChild(AcLayerComponent) layer: AcLayerComponent;

  @Input()
  show: boolean;

  @Input()
  realData = false;

  private tracks$: ConnectableObservable<AcNotification>;
  private Cesium = Cesium;
  private lastPickTrack;
  private realTracksPauser: PauseableObserver;
  private simTracksPauser: PauseableObserver;
  private isDialogOpen = false;
  private wasDialogClosedByRealDataChange = false;

  constructor(private mapEventsManager: MapEventsManagerService, public dialog: MdDialog, private webSocketSupllier: WebSocketSupplier,
              private cd: ChangeDetectorRef, private ngZone: NgZone, private dataProvider: RealTracksDataProvider,
              private appSettingsService: AppSettingsService) {
    const socket = this.webSocketSupllier.get();
    const realTracks$ = this.dataProvider.get();
    const simTracks$ = Observable.create((observer) => {
      socket.on('birds', (data) => {
        data.forEach(
          (acNotification) => {
            if (acNotification.action === 'ADD_OR_UPDATE') {
              acNotification.actionType = ActionType.ADD_UPDATE;
              acNotification.entity = new AcEntity(this.convertToCesiumObj(acNotification.entity));
            }
            else if (acNotification.action === 'DELETE') {
              acNotification.actionType = ActionType.DELETE;
            }
            observer.next(acNotification);
          });
      });
    });

    this.realTracksPauser = new PauseableObserver(realTracks$);
    this.simTracksPauser = new PauseableObserver(simTracks$);
    this.tracks$ = Observable.merge(this.simTracksPauser.getObserver(),
      this.realTracksPauser.getObserver()).publish();
    this.tracks$.connect();
  }

  ngOnInit() {
    const mouseOverObservable = this.mapEventsManager.register({
      event: CesiumEvent.MOUSE_MOVE,
      pick: PickOptions.PICK_FIRST,
      priority: 2,
    });

    mouseOverObservable.subscribe((event) => {
      const track = event.entities !== null ? event.entities[0] : null;
      if (this.lastPickTrack && (!track || track.id !== this.lastPickTrack.id)) {
        this.lastPickTrack.picked = false;
        this.layer.update(this.lastPickTrack, this.lastPickTrack.id);
      }
      if (track && (!this.lastPickTrack || track.id !== this.lastPickTrack.id)) {
        track.picked = true;
        this.layer.update(track, track.id);
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
        this.ngZone.run(() => this.openDialog(track));
      }
    });
  }

  openDialog(track) {
    track.dialogOpen = true;
    track.picked = false;
    this.layer.update(track, track.id);
    this.dialog.closeAll();
    const trackObservable = this.getSingleTrackObservable(track.id);
    this.dialog.open(TracksDialogComponent, {
      data: {
        trackObservable: trackObservable,
        track: Object.assign({}, track),
        realData: this.realData,
      },
      position: {
        top: '64px',
        left: '0',
      },
    }).afterClosed().subscribe(() => {

      track.dialogOpen = false;
      if (!this.wasDialogClosedByRealDataChange) {
        this.layer.update(track, track.id);
      }
      this.isDialogOpen = false;
      this.wasDialogClosedByRealDataChange = false;
    });
    this.isDialogOpen = true;
    this.wasDialogClosedByRealDataChange = false;
  }

  getSingleTrackObservable(trackId) {
    return this.tracks$
      .filter((notification) => notification.id === trackId).map((notification) => notification.entity);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['show']) {
      this.show = changes['show'].currentValue;

    }
    if (changes['realData']) {
      if (this.isDialogOpen) {
        this.wasDialogClosedByRealDataChange = true;
      }
      this.dialog.closeAll();
      const isRealTracks = changes['realData'].currentValue;
      if (isRealTracks) {
        this.simTracksPauser.pause();
        this.layer.removeAll();
        this.realTracksPauser.continue();
      } else {
        this.realTracksPauser.pause();
        this.layer.removeAll();
        this.simTracksPauser.continue();
      }
    }
  }

  getTrackColor(track): any {
    if (track.dialogOpen) {
      return Cesium.Color.GREENYELLOW;
    }
    if (track.picked) {
      return Cesium.Color.YELLOW;
    }
    else if (!this.realData) {
      return track.isTarget ? Cesium.Color.BLACK : Cesium.Color.fromCssColorString('#673ab7');
    }
    else {
      const lastChar = track.id.charAt(track.id.length - 1);
      if (lastChar <= '3') {
        return Cesium.Color.fromCssColorString('#424242');
      } else if (lastChar <= '9') {
        return Cesium.Color.fromCssColorString('#212121');
      }
      else {
        return Cesium.Color.fromCssColorString('#616161');
      }
    }
  }

  getTextColor(track): any {
    if (this.realData) {
      return this.getTrackColor(track);
    }
    return Cesium.Color.BLACK;
  }

  getPolylineColor() {
    return new Cesium.Material({
      fabric: {
        type: 'Color',
        uniforms: {
          color: new Cesium.Color(0.3, 1.0, 0.3, 1.0)
        }
      }
    });
  }

  showVelocityVectors(): boolean {
    return this.appSettingsService.showVelocityVectors;
  }

  convertToCesiumObj(entity): any {
    entity.scale = entity.id === 1 ? 0.3 : 0.15;
    entity.alt = Math.round(entity.position.altitude);
    entity.position = Cesium.Cartesian3.fromDegrees(entity.position.long, entity.position.lat, entity.position.altitude);
    entity.futurePosition =
      Cesium.Cartesian3.fromDegrees(entity.futurePosition.long, entity.futurePosition.lat, entity.futurePosition.altitude);
    return entity;
  }

  removeAll() {
    this.layer.removeAll();
  }

  setShow($event) {
    this.show = $event;
  }
}

class PauseableObserver {
  private observer: Observable<any>;
  private pauser = true;

  constructor(observer: Observable<any>) {
    this.observer = observer.filter(() => this.pauser);
  }

  pause() {
    this.pauser = false;
  }

  continue() {
    this.pauser = true;
  }

  getObserver() {
    return this.observer;
  }
}
