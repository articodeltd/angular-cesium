import { NgModule } from '@angular/core';
import { DraggableToMapService } from './services/draggable-to-map.service';
import { CommonModule } from '@angular/common';
import { AngularCesiumModule } from '../angular-cesium/angular-cesium.module';
import { DraggableToMapDirective } from './directives/draggable-to-map.directive';
import { AcToolbarComponent } from './components/toolbar/ac-toolbar/ac-toolbar.component';
import { DragIconComponent } from './components/toolbar/ac-toolbar/drag-icon.component';
import { AcToolbarButtonComponent } from './components/toolbar/ac-toolbar-button/ac-toolbar-button.component';


@NgModule({
  imports: [
    CommonModule,
    AngularCesiumModule,
  ],
  declarations: [
    DragIconComponent,
    DraggableToMapDirective,
    AcToolbarComponent,
    AcToolbarButtonComponent,
  ],
  exports: [
    DraggableToMapDirective,
    AcToolbarComponent,
    AcToolbarButtonComponent
  ],
  providers: [DraggableToMapService],
})
export class AngularCesiumWidgetsModule {
}
