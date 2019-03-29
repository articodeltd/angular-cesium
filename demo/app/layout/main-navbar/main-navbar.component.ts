import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AppSettingsService, TracksType } from '../../services/app-settings-service/app-settings-service';
import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'main-navbar',
  templateUrl: './main-navbar.component.html',
  styleUrls: ['./main-navbar.component.css']
})
export class MainNavbarComponent implements OnInit {

  @Output() onSettingClick = new EventEmitter();
  @Output() onMultiMapClick = new EventEmitter();
  @Output() onToolbarSideNavClick = new EventEmitter();

  TracksType = TracksType;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe('(max-width: 1100px)')
    .pipe(
      map(result => result.matches)
    );

  constructor(
    public appSettingsService: AppSettingsService,
    private breakpointObserver: BreakpointObserver,
    private snackBar: MatSnackBar,
  ) {
  }

  ngOnInit() {
  }

  changeAppSettings(type: TracksType) {
    this.appSettingsService.tracksDataType = type;
    if (type === TracksType.REAL_DATA) {
      this.snackBar.open('Try double clicking the tracks to see more info. Like aircraft type, destination and more.',
        'OK', {duration: 10000});
    }
    if (type === TracksType.SIM_DATA) {
      this.snackBar.open('Try changing entities amount and rate in the settings navbar',
        'OK', {duration: 10000});
    }
  }

}
