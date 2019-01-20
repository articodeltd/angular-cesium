import { Component, OnInit } from '@angular/core';
import { CesiumEvent, ContextMenuService, CoordinateConverter, MapEventsManagerService, PickOptions } from 'angular-cesium';
import { ContextMenuComponent } from '../context-menu/context-menu.component';

@Component({
  selector: 'context-menu-layer',
  templateUrl: 'context-menu-layer.component.html',
  providers: [CoordinateConverter]
})

export class ContextMenuLayerComponent implements OnInit {
  constructor(private contextMenuService: ContextMenuService,
              private mapEventsManager: MapEventsManagerService,
              private coordinateConverter: CoordinateConverter) {
  }

  ngOnInit() {
    this.mapEventsManager
      .register({event: CesiumEvent.RIGHT_CLICK, pick: PickOptions.NO_PICK})
      .subscribe(event => {
        const position = this.coordinateConverter.screenToCartesian3(event.movement.endPosition);
        if (!position) {
          return;
        }

        this.contextMenuService.open(
          ContextMenuComponent,
          position,
          {data: {items: ['New Track', 'Change Map', 'Context Menu', 'Do Something']}}
        );
      });
  }
}
