import { Component, OnInit } from '@angular/core';
import { CesiumEvent, ContextMenuService, CoordinateConverter, MapEventsManagerService, PickOptions } from 'angular-cesium';
import { ContextMenuData, MyCustomContextMenuComponent } from './context-menu/my-custom-context-menu.component';

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

        this.contextMenuService.open<ContextMenuData>(
          MyCustomContextMenuComponent,
          position,
          {
            data: {
              item: { name: 'Cool name' },
              onActionClick: () => {
                console.log('do action');
                this.contextMenuService.close();
              }
            }
          }
        );
      });
  }
}
