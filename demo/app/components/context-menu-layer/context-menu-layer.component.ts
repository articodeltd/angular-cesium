import { Component, OnInit } from '@angular/core';
import { ContextMenuService } from '../../../../src/angular-cesium/services/context-menu/context-menu.service';
import { ContextMenuComponent } from '../context-menu/context-menu.component';
import { MapEventsManagerService } from '../../../../src/angular-cesium/services/map-events-mananger/map-events-manager';
import { PickOptions } from '../../../../src/angular-cesium/services/map-events-mananger/consts/pickOptions.enum';
import { CesiumEvent } from '../../../../src/angular-cesium/services/map-events-mananger/consts/cesium-event.enum';
import { CoordinateConverter } from '../../../../src/angular-cesium/services/coordinate-converter/coordinate-converter.service';

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
      .register({ event: CesiumEvent.RIGHT_CLICK, pick: PickOptions.NO_PICK })
      .subscribe(event => {
        const position = this.coordinateConverter.screenToCartesian3(event.movement.endPosition);
        if (!position) {
          return;
        }

        this.contextMenuService.open(
          ContextMenuComponent,
          position,
          { data: { items: ['New Track', 'Change Map', 'Context Menu', 'Do Something'] } }
        )
      });
  }
}
