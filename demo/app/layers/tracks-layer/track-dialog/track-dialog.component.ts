import { Component, Inject, OnInit } from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';

@Component({
  selector: 'track-dialog',
  templateUrl: './track-dialog.component.html',
  styleUrls: ['./track-dialog.component.css']
})
export class TracksDialogComponent implements OnInit {
  public track;

  constructor(public dialogRef: MdDialogRef<TracksDialogComponent>, @Inject(MD_DIALOG_DATA) public data: any) {
    this.track = data.track;
  }

  ngOnInit(): void {
  }
}
