import { NgModule } from '@angular/core';
import { IconDragService } from './services/icon-drag.service';
import { CommonModule } from '@angular/common';
import { AngularCesiumModule } from '../angular-cesium/angular-cesium.module';
import { DraggableToMapDirective } from './directives/draggable-to-map';


@NgModule({
  imports: [
    CommonModule,
    AngularCesiumModule,
  ],
  exports: [DraggableToMapDirective],
  declarations: [DraggableToMapDirective],
  providers: [IconDragService],
})
export class AngularCesiumWidgetsModule {
}
