import { NgModule } from '@angular/core';
import { DraggableToMapService } from './services/draggable-to-map.service';
import { CommonModule } from '@angular/common';
import { AngularCesiumModule } from '../angular-cesium/angular-cesium.module';
import { DraggableToMapDirective } from './directives/draggable-to-map.directive';


@NgModule({
  imports: [
    CommonModule,
    AngularCesiumModule,
  ],
  exports: [DraggableToMapDirective],
  declarations: [DraggableToMapDirective],
  providers: [DraggableToMapService],
})
export class AngularCesiumWidgetsModule {
}
