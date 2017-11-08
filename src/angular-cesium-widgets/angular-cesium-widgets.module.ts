import { NgModule } from '@angular/core';
import { DraggableToMapService } from './services/draggable-to-map.service';
import { CommonModule } from '@angular/common';
import { AngularCesiumModule } from '../angular-cesium/angular-cesium.module';
import { DraggableToMapDirective } from './directives/draggable-to-map.directive';
import { AcToolbarComponent } from './components/ac-toolbar/ac-toolbar.component';


@NgModule({
  imports: [
    CommonModule,
    AngularCesiumModule,
  ],
  declarations: [
    DraggableToMapDirective,
    AcToolbarComponent,
  ],
  exports: [
    DraggableToMapDirective,
    AcToolbarComponent
  ],
  providers: [DraggableToMapService],
})
export class AngularCesiumWidgetsModule {
}
