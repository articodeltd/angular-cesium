import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularCesiumModule } from '../angular-cesium/angular-cesium.module';
import { PolygonsEditorComponent } from './components/polygons-editor/polygons-editor.component';
import { CirclesEditorComponent } from './components/circles-editor/circles-editor.component';
import { CirclesEditorService } from './services/entity-editors/circles-editor/circles-editor.service';
import { PolygonsEditorService } from './services/entity-editors/polygons-editor/polygons-editor.service';
import { PolylinesEditorService } from './services/entity-editors/polyline-editor/polylines-editor.service';
import { PolylinesEditorComponent } from './components/polylines-editor/polylines-editor.component';
import { HippodromeEditorComponent } from './components/hippodrome-editor/hippodrome-editor.component';
import { HippodromeEditorService } from './services/entity-editors/hippodrome-editor/hippodrome-editor.service';
import { DraggableToMapDirective } from './directives/draggable-to-map.directive';
import { DraggableToMapService } from './services/draggable-to-map.service';
import { AcToolbarComponent } from './components/toolbar/ac-toolbar/ac-toolbar.component';
import { DragIconComponent } from './components/toolbar/ac-toolbar/drag-icon.component';
import { AcToolbarButtonComponent } from './components/toolbar/ac-toolbar-button/ac-toolbar-button.component';

@NgModule({
  imports: [
    CommonModule,
    AngularCesiumModule,
  ],
  declarations: [
		HippodromeEditorComponent,
    PolygonsEditorComponent,
    CirclesEditorComponent,
		PolylinesEditorComponent,
    DraggableToMapDirective,
    DragIconComponent,
    AcToolbarComponent,
    AcToolbarButtonComponent,
  ],
  exports: [
		HippodromeEditorComponent,
    PolygonsEditorComponent,
    CirclesEditorComponent,
    PolylinesEditorComponent,
    DraggableToMapDirective,
  ],
  providers: [
    PolygonsEditorService,
    CirclesEditorService,
    PolylinesEditorService,
		HippodromeEditorService,
    DraggableToMapService,
    AcToolbarComponent,
    AcToolbarButtonComponent,
  ]
})
export class AngularCesiumWidgetsModule {
}
