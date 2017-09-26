import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularCesiumModule } from '../src/angular-cesium.module';
import { PolygonsEditorService } from './services/entity-editors/polygons-editor/polgons-editor.service';

@NgModule({
  imports: [
    CommonModule,
    AngularCesiumModule
  ],
  providers: [PolygonsEditorService]
})
export class AngularCesiumEntitiesEditorModule {
}
