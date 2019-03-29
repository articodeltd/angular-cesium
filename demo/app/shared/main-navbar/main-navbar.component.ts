import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AppSettingsService, TracksType } from '../../services/app-settings-service/app-settings-service';
import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';

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
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(
    public appSettingsService: AppSettingsService,
    private breakpointObserver: BreakpointObserver
  ) {
  }

  ngOnInit() {
  }

}
