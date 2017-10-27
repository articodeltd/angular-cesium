import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularCesiumModule } from '../angular-cesium/angular-cesium.module';
import { PolygonsEditorService } from './services/entity-editors/polygons-editor/polygons-editor.service';
import { PolygonsEditorComponent } from './components/polygons-editor/polygons-editor.component';
import { CirclesEditorComponent } from './components/circles-editor/circles-editor.component';
import { CirclesEditorService } from './services/entity-editors/circles-editor/circles-editor.service';

@NgModule({
  imports: [
    CommonModule,
    AngularCesiumModule,
  ],
  declarations: [
    PolygonsEditorComponent,
    CirclesEditorComponent,
  ],
  exports: [
    PolygonsEditorComponent,
    CirclesEditorComponent,
  ],
  providers: [
    PolygonsEditorService,
    CirclesEditorService,
  ]
})
export class AngularCesiumEntitiesEditorModule {
}
