import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { AppSettingsService, TracksType } from '../../services/app-settings-service/app-settings-service';

@Component({
  selector: 'sidenav-toolbar',
  templateUrl: './sidenav-toolbar.component.html',
  styleUrls: ['./sidenav-toolbar.component.css']
})
export class SidenavToolbarComponent implements OnInit {
  @Output() onMultiMapClick = new EventEmitter();

  TracksType = TracksType;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );


  constructor(
    private breakpointObserver: BreakpointObserver,
    public appSettingsService: AppSettingsService,
  ) { }

  ngOnInit() {
  }

}
