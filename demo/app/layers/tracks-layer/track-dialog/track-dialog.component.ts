import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';
import { Observable } from 'rxjs';

@Component({
  selector: 'track-dialog',
  templateUrl: './track-dialog.component.html',
  styleUrls: ['./track-dialog.component.css']
})
export class TracksDialogComponent {
  public track$: Observable<any>;

  constructor(public dialogRef: MdDialogRef<TracksDialogComponent>, @Inject(MD_DIALOG_DATA) public data: any) {
    this.track$ = data.trackObservable;
  }
}
