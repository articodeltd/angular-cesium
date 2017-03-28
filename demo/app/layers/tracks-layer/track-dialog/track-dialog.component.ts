import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material';

@Component({
  selector: 'track-dialog',
  templateUrl: './track-dialog.component.html',
  styleUrls: ['./track-dialog.component.css']
})
export class TracksDialogComponent implements OnInit {
  constructor(public dialogRef: MdDialogRef<TracksDialogComponent>) {
  }

  ngOnInit(): void {
  }
}
