import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularCesiumModule } from '../angular-cesium/angular-cesium.module';
import { PolygonsEditorService } from './services/entity-editors/polygons-editor/polygons-editor.service';
import { PolygonsEditorComponent } from './components/polygons-editor/polygons-editor.component';
import { PolylinesEditorService } from './services/entity-editors/polyline-editor/polylines-editor.service';
import { PolylinesEditorComponent } from './components/polylines-editor/polylines-editor.component';
import { HippodromeEditorComponent } from './components/hippodrome-editor/hippodrome-editor.component';

@NgModule({
  imports: [
    CommonModule,
    AngularCesiumModule,
  ],
  declarations: [
		HippodromeEditorComponent,
    PolygonsEditorComponent,
		PolylinesEditorComponent,
  ],
  exports: [
		HippodromeEditorComponent,
    PolygonsEditorComponent,
    PolylinesEditorComponent,
  ],
  providers: [
    PolygonsEditorService,
    PolylinesEditorService,
  ]
})
export class AngularCesiumEntitiesEditorModule {
}
