import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';
import { Observable } from 'rxjs';
import { RadiansToDegreesPipe } from '../../../../../src/pipes/radians-to-degrees/radians-to-degrees.pipe';

@Component({
  selector: 'track-dialog',
  templateUrl: './track-dialog.component.html',
  styleUrls: ['./track-dialog.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class TracksDialogComponent {
  public track$: Observable<any>;

  constructor(public dialogRef: MdDialogRef<TracksDialogComponent>, @Inject(MD_DIALOG_DATA) public data: any) {
    this.track$ = data.trackObservable;
  }

  toRadians(value) {
    return 360 - Math.round(180 * value / Math.PI);
  }
}
