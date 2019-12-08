import { Component, OnDestroy, OnInit } from '@angular/core';
import { KeyboardAction, KeyboardControlService } from 'angular-cesium';

@Component({
  selector: 'keyboard-control-layer',
  template: '',
})
export class KeyboardControlLayerComponent implements OnInit, OnDestroy {
  constructor(private keyboardControlService: KeyboardControlService) {

  }

  ngOnInit() {
    this.keyboardControlService.setKeyboardControls({
      W: { action: KeyboardAction.CAMERA_UP },
      S: { action: KeyboardAction.CAMERA_DOWN },
      D: { action: KeyboardAction.CAMERA_RIGHT },
      A: { action: KeyboardAction.CAMERA_LEFT },
      ['+']: { action: KeyboardAction.CAMERA_FORWARD },
      ['-']: { action: KeyboardAction.CAMERA_BACKWARD },
    }, (keyEvent: KeyboardEvent) => {
      if (keyEvent.code === 'KeyW' || keyEvent.code === 'ArrowUp') {
        return 'W';
      } else if (keyEvent.code === 'KeyD' || keyEvent.code === 'ArrowRight') {
        return 'D';
      } else if (keyEvent.code === 'KeyA' || keyEvent.code === 'ArrowLeft') {
        return 'A';
      } else if (keyEvent.code === 'KeyS' || keyEvent.code === 'ArrowDown') {
        return 'S';
      } else {
        return keyEvent.key;
      }
    });
  }

  ngOnDestroy() {
    this.keyboardControlService.removeKeyboardControls();
  }
}
