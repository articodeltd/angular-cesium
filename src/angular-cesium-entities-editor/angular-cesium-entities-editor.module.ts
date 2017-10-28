import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularCesiumModule } from '../angular-cesium/angular-cesium.module';
import { PolygonsEditorComponent } from './components/polygons-editor/polygons-editor.component';
import { CirclesEditorComponent } from './components/circles-editor/circles-editor.component';
import { CirclesEditorService } from './services/entity-editors/circles-editor/circles-editor.service';
import { PolygonsEditorService } from './services/entity-editors/polygons-editor/polygons-editor.service';
import { PolylinesEditorService } from './services/entity-editors/polyline-editor/polylines-editor.service';
import { PolylinesEditorComponent } from './components/polylines-editor/polylines-editor.component';

@NgModule({
  imports: [
    CommonModule,
    AngularCesiumModule,
  ],
  declarations: [
    PolygonsEditorComponent,
    CirclesEditorComponent,
		PolylinesEditorComponent,
  ],
  exports: [
    PolygonsEditorComponent,
    CirclesEditorComponent,
    PolylinesEditorComponent,
  ],
  providers: [
    PolygonsEditorService,
    CirclesEditorService,
    PolylinesEditorService,
  ]
})
export class AngularCesiumEntitiesEditorModule {
}
