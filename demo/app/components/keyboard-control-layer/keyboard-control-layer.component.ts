import { Component, OnInit } from '@angular/core';
import { KeyboardControlService } from '../../../../src/services/keyboard-control/keyboard-control.service';
import { KeyboardAction } from '../../../../src/models/ac-keyboard-action.enum';

@Component({
  selector: 'keyboard-control-layer',
  template: '',
})
export class KeyboardControlLayerComponent implements OnInit {
  constructor(private keyboardControlService: KeyboardControlService) {

  }

  ngOnInit() {
    this.keyboardControlService.setKeyboardControls({
      W: { action: KeyboardAction.CAMERA_FORWARD },
      S: { action: KeyboardAction.CAMERA_BACKWARD },
      D: { action: KeyboardAction.CAMERA_RIGHT },
      A: { action: KeyboardAction.CAMERA_LEFT },
      E: { action: KeyboardAction.CAMERA_DOWN },
      Q: { action: KeyboardAction.CAMERA_UP },
    });
  }
}
