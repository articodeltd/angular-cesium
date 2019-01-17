import { ConnectableObservable, merge as observableMerge, Observable } from 'rxjs';
import { filter, map, publish } from 'rxjs/operators';
import { Component, Input, NgZone, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { AcLayerComponent, AcNotification, CameraService, CesiumEvent, MapEventsManagerService, PickOptions } from 'angular-cesium';
import { MatDialog } from '@angular/material';
import { TracksDialogComponent } from './track-dialog/track-dialog.component';
import { AppSettingsService, TracksType } from '../../services/app-settings-service/app-settings-service';
import { RealTracksDataProvider } from '../../utils/services/dataProvider/real-tracks-data-provider';
import { SimTracksDataProvider, Track } from '../../utils/services/dataProvider/sim-tracks-data-provider';

@Component({
  selector: 'tracks-layer',
  templateUrl: './tracks-layer.component.html',
  providers: [RealTracksDataProvider],
  styleUrls: ['./tracks-layer.component.css']
})
export class TracksLayerComponent implements OnInit, OnChanges {

  private readonly MAX_MODELS = 100;

  @ViewChild(AcLayerComponent) layer: AcLayerComponent;

  @Input()
  show: boolean;

  @Input()
  tracksType: TracksType = TracksType.MODELS_3D;

  private tracks$: ConnectableObservable<AcNotification>;
  private Cesium = Cesium;
  private lastPickTrack: any;
  private realTracksPauser: PauseableObserver;
  private simAndModelTracksPauser: PauseableObserver;
  private isDialogOpen = false;
  private wasDialogClosedByRealDataChange = false;
  private modelsCountFilter = this.MAX_MODELS;

  constructor(private mapEventsManager: MapEventsManagerService, public dialog: MatDialog,
              private ngZone: NgZone, realDataProvider: RealTracksDataProvider, simDataProvider: SimTracksDataProvider,
              private appSettingsService: AppSettingsService, private cameraService: CameraService) {
    const realTracks$ = realDataProvider.get();
    const simTracks$ = simDataProvider.get();
    const simAndModelTracks$ = simTracks$.pipe(filter(e => +e.id < this.modelsCountFilter));

    this.realTracksPauser = new PauseableObserver(realTracks$);
    this.simAndModelTracksPauser = new PauseableObserver(simAndModelTracks$);
    this.tracks$ = publish<AcNotification>()(observableMerge(
      this.simAndModelTracksPauser.getObserver(),
      this.realTracksPauser.getObserver()));
    this.tracks$.connect();
  }

  ngOnInit() {
    const mouseOverObservable = this.mapEventsManager.register({
      entityType: Track,
      event: CesiumEvent.MOUSE_MOVE,
      pick: PickOptions.PICK_FIRST,
      priority: 2,
    });

    // Change color on hover
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


    // Open dialog on double click
    const doubleClickObservable = this.mapEventsManager.register({
      entityType: Track,
      event: CesiumEvent.LEFT_DOUBLE_CLICK,
      pick: PickOptions.PICK_FIRST,
      priority: 2,
    });
    doubleClickObservable.subscribe((event) => {
      const track = event.entities !== null ? event.entities[0] : null;
      if (track) {
        this.ngZone.run(() => this.openDialog(track, event.cesiumEntities[0]));
      }
    });
  }

  openDialog(track: any, cesiumEntity: any) {
    track.dialogOpen = true;
    track.picked = false;
    this.layer.update(track, track.id);
    this.dialog.closeAll();
    const trackObservable = this.getSingleTrackObservable(track.id);
    this.dialog.open(TracksDialogComponent, {
      data: {
        trackObservable: trackObservable,
        track: Object.assign({}, track),
        trackEntityFn: () => this.cameraService.trackEntity(cesiumEntity),
        realData: this.tracksType === TracksType.REAL_DATA,
      },
      position: {
        top: '64px',
        left: '0',
      },
    }).afterClosed().subscribe(() => {
      this.cameraService.untrackEntity();
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

  getSingleTrackObservable(trackId: string) {
    return this.tracks$.pipe(
      filter((notification) => notification.id === trackId),
      map((notification) => notification.entity));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['show']) {
      this.show = changes['show'].currentValue;

    }


    if (changes['tracksType']) {
      if (this.isDialogOpen) {
        this.wasDialogClosedByRealDataChange = true;
      }
      this.dialog.closeAll();


      const tracksType = changes['tracksType'].currentValue;
      if (tracksType === TracksType.REAL_DATA) {
        this.simAndModelTracksPauser.pause();
        this.layer.removeAll();
        this.realTracksPauser.continue();
      } else {
        this.modelsCountFilter = tracksType === TracksType.MODELS_3D ? this.MAX_MODELS : Number.MAX_SAFE_INTEGER;
        this.realTracksPauser.pause();
        this.layer.removeAll();
        this.simAndModelTracksPauser.continue();
      }
    }
  }

  getTrackColor(track: any): any {
    if (track.dialogOpen) {
      return Cesium.Color.GREENYELLOW;
    }
    if (track.picked) {
      return Cesium.Color.YELLOW;
    }
    if (this.tracksType === TracksType.MODELS_3D) {
      return Cesium.Color.GRAY;
    } else if (this.tracksType === TracksType.SIM_DATA) {
      return track.isTarget ? Cesium.Color.BLACK : Cesium.Color.fromCssColorString('#673ab7');
    } else if (this.tracksType === TracksType.REAL_DATA) {
      const lastChar = track.id.toString().charAt(track.id.length - 1);
      if (lastChar <= '3') {
        return Cesium.Color.fromCssColorString('#424242');
      } else if (lastChar <= '9') {
        return Cesium.Color.fromCssColorString('#212121');
      } else {
        return Cesium.Color.fromCssColorString('#616161');
      }
    }
  }

  getTextColor(track: any): any {
    if (this.tracksType === TracksType.REAL_DATA) {
      return this.getTrackColor(track);
    }
    return Cesium.Color.BLACK;
  }

  getPolylineColor() {
    return new Cesium.Color(0.3, 1.0, 0.3, 1.0);
  }

  showVelocityVectors(): boolean {
    return this.appSettingsService.showVelocityVectors;
  }

  showEllipses(): boolean {
    return this.appSettingsService.showEllipses;
  }

  onlyModels() {
    return this.tracksType === TracksType.MODELS_3D;
  }

  onlyRealTracks() {
    return this.tracksType === TracksType.REAL_DATA;
  }

  onlySimTracks() {
    return this.tracksType === TracksType.SIM_DATA;
  }

  removeAll() {
    this.layer.removeAll();
  }

  setShow($event: boolean) {
    this.show = $event;
  }

  pixelOffset(value) {
    return new Cesium.Cartesian2(value[0], value[1]);
  }
}

class PauseableObserver {
  private observer: Observable<any>;
  private pauser = true;

  constructor(observer: Observable<any>) {
    this.observer = observer.pipe(filter(() => this.pauser));
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

