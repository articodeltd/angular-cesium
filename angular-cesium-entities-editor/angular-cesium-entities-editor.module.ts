import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularCesiumModule } from '../src/angular-cesium.module';
import { PolygonsEditorService } from './services/entity-editors/polygons-editor/polygons-editor.service';
import { PolygonsEditorComponent } from './components/polygons-editor/polygons-editor.component';

@NgModule({
  imports: [
    CommonModule,
    AngularCesiumModule,
  ],
  declarations: [
    PolygonsEditorComponent,
  ],
  exports: [
    PolygonsEditorComponent,
  ],
  providers: [
    PolygonsEditorService,
  ]
})
export class AngularCesiumEntitiesEditorModule {
}
