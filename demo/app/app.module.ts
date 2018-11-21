import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Apollo, ApolloModule } from 'apollo-angular';
import { HttpLink, HttpLinkModule } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import 'hammerjs';
import { AngularCesiumWidgetsModule } from '../../src/angular-cesium-widgets/angular-cesium-widgets.module';
import { AngularCesiumModule } from '../../src/angular-cesium/angular-cesium.module';
import { AppComponent } from './app.component';
import { AppMaterialModule } from './app.material.module';
import { ArcLayerComponent } from './components/arc-layer/arc-layer.component';
import { BaseLayerComponent } from './components/base-layer/base-layer.component';
import { BoxesLayerComponent } from './components/boxes-layer/boxes-layer.component';
import { ContextMenuLayerComponent } from './components/context-menu-layer/context-menu-layer.component';
import { ContextMenuComponent } from './components/context-menu/context-menu.component';
import { CzmlLayerComponent } from './components/czml-layer/czml-layer.component';
import { DemoMapComponent } from './components/demo-map/demo-map.component';
import { DemoMultipleMapsComponent } from './components/demo-multiple-maps/demo-multiple-maps.component';
import { DrawOnMapComponent } from './components/draw-on-map-layer/draw-on-map-layer.component';
import { DynamicCircleLayerComponent } from './components/dynamic-circle-layer/dynamic-circle-layer.component';
import { DynamicEllipseLayerComponent } from './components/dynamic-ellipse-layer/dynamic-ellipse-layer.component';
import { DynamicPolylineLayerComponent } from './components/dynamic-polyline-layer/dynamic-polyline-layer.component';
import { CirclesEditorLayerComponent } from './components/editor-layer/circles-editor-layer/circles-editor-layer.component';
import { EllipsesEditorLayerComponent } from './components/editor-layer/ellipses-editor-layer/ellipses-editor-layer.component';
import { HippodromeEditorLayerComponent } from './components/editor-layer/hippodrome-example/hippodrome-editor-layer.component';
import { PolygonsEditorLayerComponent } from './components/editor-layer/polygons-editor-layer/polygons-editor-layer.component';
import { PolylineEditorLayerComponent } from './components/editor-layer/polyline-example/polyline-editor-layer.component';
import { EllipseLayerComponent } from './components/ellipse-layer/ellipse-layer.component';
import { EventTestLayerComponent } from './components/event-test-layer/event-test-layer.component';
import { HeatmapLayerComponent } from './components/heatmap-layer/heatmap-layer.component';
import { HippodromeLayerComponent } from './components/hippodrome-layer/hippodrome-layer.component';
import { HtmlLayerComponent } from './components/html-layer/html-layer.component';
import { KeyboardControlLayerComponent } from './components/keyboard-control-layer/keyboard-control-layer.component';
import { LayerOrderComponent } from './components/layer-order/layer-order.component';
import { MapsLayerComponent } from './components/maps-layer/maps-layer.component';
import { ModelsLayerComponent } from './components/models-layer/models-layer.component';
import { PointLayerComponent } from './components/point-layer/point-layer.component';
import { PolygonLayerComponent } from './components/polygon-layer/polygon-layer.component';
import { PolygonPerformanceTestComponent } from './components/polygon-layer/polygon-performance-test/polygon-performance-test.component';
import { SelectionLayerComponent } from './components/selection-layer/selection-layer.component';
import { ToolbarExampleComponent } from './components/toolbar-example/toolbar-example.component';
import { TrackEntityLayerComponent } from './components/track-entity-layer/track-entity-layer.component';
import { TracksDialogComponent } from './components/tracks-layer/track-dialog/track-dialog.component';
import { TracksLayerComponent } from './components/tracks-layer/tracks-layer.component';
import { TracksWithArraysComponent } from './components/tracks-with-arrays-example/tracks-with-arrays.component';
import { MaxValidatorDirective } from './shared/settings-form/max-validtor.directive';
import { MinValidatorDirective } from './shared/settings-form/min-validator.directive';
import { SettingsFormComponent } from './shared/settings-form/settings-form.component';


@NgModule({
  declarations: [
    AppComponent,
    SettingsFormComponent,
    TracksLayerComponent,
    TracksDialogComponent,
    BaseLayerComponent,
    DynamicEllipseLayerComponent,
    DynamicCircleLayerComponent,
    EllipseLayerComponent,
    DynamicPolylineLayerComponent,
    PolygonLayerComponent,
    EventTestLayerComponent,
    ArcLayerComponent,
    PointLayerComponent,
    TracksDialogComponent,
    DrawOnMapComponent,
    DemoMapComponent,
    DemoMultipleMapsComponent,
    MapsLayerComponent,
    ModelsLayerComponent,
    MaxValidatorDirective,
    MinValidatorDirective,
    PolygonPerformanceTestComponent,
    KeyboardControlLayerComponent,
    HippodromeLayerComponent,
    LayerOrderComponent,
    ContextMenuComponent,
    ContextMenuLayerComponent,
    SelectionLayerComponent,
    PolygonsEditorLayerComponent,
    CirclesEditorLayerComponent,
    PolylineEditorLayerComponent,
    HeatmapLayerComponent,
    HippodromeEditorLayerComponent,
    HtmlLayerComponent,
    TracksWithArraysComponent,
    ToolbarExampleComponent,
    BoxesLayerComponent,
    TrackEntityLayerComponent,
    CzmlLayerComponent,
    EllipsesEditorLayerComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    AngularCesiumModule.forRoot(),
    AngularCesiumWidgetsModule,
    BrowserAnimationsModule,
    AppMaterialModule,
    ApolloModule,
    HttpClientModule,
    HttpLinkModule,

  ],
  entryComponents: [TracksDialogComponent, ContextMenuComponent],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(apollo: Apollo, httpLink: HttpLink) {
    apollo.create({
      link: httpLink.create({
        uri: process.env.SERVER + '/graphql',
      }),
      cache: new InMemoryCache(),
    });
  }
}
