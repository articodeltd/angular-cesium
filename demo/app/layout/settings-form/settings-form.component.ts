import { MatSnackBar } from '@angular/material';
import { Component, EventEmitter, Output } from '@angular/core';
import { AppSettingsService } from '../../services/app-settings-service/app-settings-service';
import { FormControl, NgForm } from '@angular/forms';
import { CameraService, MapsManagerService } from 'angular-cesium';
import { WebSocketSupplier } from '../../utils/services/webSocketSupplier/webSocketSupplier';

@Component({
  selector: 'settings-form',
  templateUrl: 'settings-form.component.html',
  styleUrls: ['settings-form.component.css']
})
export class SettingsFormComponent {
  @Output() cleanMap = new EventEmitter();
  private socket: any;
  private cameraService: CameraService;

  constructor(public settingsService: AppSettingsService,
              private snackBar: MatSnackBar,
              webSocket: WebSocketSupplier,
              private mapsManagerService: MapsManagerService) {

    this.socket = webSocket.get();
    this.socket.on('connect', () => {
      this.socket.emit('get_sending_params', '', (data: any) => {
        this.settingsService.numOfEntities = data && data.numOfEntities;
        this.settingsService.entitiesUpdateRate = data && data.interval;
      });
    });
  }

  applySettings() {
    this.socket.emit('change_sending', {
      rate: this.settingsService.entitiesUpdateRate,
      numOfEntities: this.settingsService.numOfEntities,
    }, () => {
      this.cleanMap.emit();
      this.snackBar.open(' Changed successfully', 'ok', {duration: 2000});
    });
  }

  newYorkToggle(toggle: any) {
    if (toggle.checked) {
      if (!this.cameraService) {
        this.cameraService = this.mapsManagerService.getMap().getCameraService();
      }
      this.cameraService.cameraFlyTo({
        destination: Cesium.Cartesian3.fromDegrees(-73.980689, 40.762991, 5000.0)
      });
    }
  }


  myErrorStateMatcher(control: FormControl, form: NgForm): boolean {
    // Error when invalid control is dirty, touched, or submitted
    const isSubmitted = form && form.submitted;
    return true;
  }


  downloadScreenshot() {
    const screenShotservice = this.mapsManagerService.getMap().getScreenshotService();
    screenShotservice.downloadMapScreenshot();
  }
}
