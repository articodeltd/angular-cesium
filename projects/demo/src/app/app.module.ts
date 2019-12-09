import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AngularCesiumModule, AngularCesiumWidgetsModule } from 'angular-cesium';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { TracksDialogComponent } from './components/tracks-layer/track-dialog/track-dialog.component';
import { TracksLayerComponent } from './components/tracks-layer/tracks-layer.component';
import { LabelLayerExampleComponent } from './components/label-layer-example/label-layer-example.component';
import { EllipseLayerExampleComponent } from './components/ellipse-layer-example/ellipse-layer-example.component';
import { CircleLayerExampleComponent } from './components/circle-layer-example/circle-layer-example.component';
import { EllipseLayerComponent } from './components/ellipse-layer/ellipse-layer.component';
import { PolylineLayerExampleComponent } from './components/polyline-layer-example/polyline-layer-example.component';
import { PolygonLayerExampleComponent } from './components/polygon-layer/polygon-layer-example.component';
import { RectangleLayerExampleComponent } from './components/rectangle-layer-example/rectangle-layer-example.component';
import { MapEventsExampleComponent } from './components/map-events-example/map-events-example.component';
import { ArcLayerExampleComponent } from './components/arc-layer/arc-layer-example.component';
import { PointLayerExampleComponent } from './components/point-layer/point-layer-example.component';
import { DemoMapComponent } from './components/demo-map/demo-map.component';
import { MapsProviderExampleComponent } from './components/maps-layer/maps-provider-example.component';
import { DemoMultipleMapsComponent } from './components/demo-multiple-maps/demo-multiple-maps.component';
import { ModelsLayerExampleComponent } from './components/models-layer/models-layer-example.component';
import { PolygonPerformanceTestComponent } from './components/polygon-layer/polygon-performance-test/polygon-performance-test.component';
import { HippodromeLayerExampleComponent } from './components/hippodrome-layer/hippodrome-layer-example.component';
import { KeyboardControlLayerComponent } from './components/keyboard-control-layer/keyboard-control-layer.component';
import { LayerOrderComponent } from './components/layer-order/layer-order.component';
import { ContextMenuLayerComponent } from './components/context-menu-layer/context-menu-layer.component';
import { SelectionLayerExampleComponent } from './components/selection-layer/selection-layer-example.component';
import { PolygonsEditorExampleComponent } from './components/editor-layer/polygons-editor-layer/polygons-editor-example.component';
import { HeatmapExampleComponent } from './components/heatmap-layer/heatmap-example.component';
import { PolylineEditorExampleComponent } from './components/editor-layer/polyline-example/polyline-editor-example.component';
import { CirclesEditorExampleComponent } from './components/editor-layer/circles-editor-layer/circles-editor-example.component';
import { HippodromeEditorExampleComponent } from './components/editor-layer/hippodrome-example/hippodrome-editor-example.component';
import { HtmlExampleComponent } from './components/html-layer/html-example.component';
import { EntitiesWithArraysExampleComponent } from './components/entities-with-arrays-example/entities-with-arrays-example.component';
import { ToolbarExampleComponent } from './components/toolbar-example/toolbar-example.component';
import { BoxesLayerComponent } from './components/boxes-layer/boxes-layer.component';
import { TrackEntityLayerComponent } from './components/track-entity-layer/track-entity-layer.component';
import { CzmlLayerExampleComponent } from './components/czml-layer/czml-layer-example.component';
import { EllipsesEditorExampleComponent } from './components/editor-layer/ellipses-editor-layer/ellipses-editor-example.component';
import { AppMaterialModule } from './app.material.module';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { environment } from '../environments/environment';
import { HttpLink, HttpLinkModule } from 'apollo-angular-link-http';
import { Apollo, APOLLO_OPTIONS, ApolloModule } from 'apollo-angular';
import { MaxValidatorDirective } from './layout/settings-form/max-validtor.directive';
import { MinValidatorDirective } from './layout/settings-form/min-validator.directive';
import { MainNavbarComponent } from './layout/main-navbar/main-navbar.component';
import { SidenavToolbarComponent } from './layout/sidenav-toolbar/sidenav-toolbar.component';
import { SettingsFormComponent } from './layout/settings-form/settings-form.component';
import { SingleEntityOnMapExampleComponent } from './components/single-entity-on-map-example/single-entity-on-map-example.component';
import { MyCustomContextMenuComponent } from './components/context-menu-layer/context-menu/my-custom-context-menu.component';
import { BillboardLayerExampleComponent } from './components/billboard-layer-example/billboard-layer-example.component';
import { CylinderLayerExampleComponent } from './components/cylinder-layer-example/cylinder-layer-example.component';
import { EllipsoidLayerExampleComponent } from './components/ellipsoid-layer-example/ellipsoid-layer-example.component';
import { VolumeLayerExampleComponent } from './components/volume-layer-example/volume-layer-example.component';
import { WallLayerExampleComponent } from './components/wall-layer-example/wall-layer-example.component';


@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    AngularCesiumModule.forRoot(),
    AngularCesiumWidgetsModule,
    BrowserAnimationsModule,
    AppMaterialModule,
    HttpClientModule,
    ApolloModule,
    HttpLinkModule,
  ],
  declarations: [
    AppComponent,
    TracksLayerComponent,
    BillboardLayerExampleComponent,
    WallLayerExampleComponent,
    CylinderLayerExampleComponent,
    EllipsoidLayerExampleComponent,
    VolumeLayerExampleComponent,
    LabelLayerExampleComponent,
    EllipseLayerExampleComponent,
    CircleLayerExampleComponent,
    EllipseLayerComponent,
    PolylineLayerExampleComponent,
    PolygonLayerExampleComponent,
    RectangleLayerExampleComponent,
    MapEventsExampleComponent,
    ArcLayerExampleComponent,
    PointLayerExampleComponent,
    TracksDialogComponent,
    SingleEntityOnMapExampleComponent,
    DemoMapComponent,
    DemoMultipleMapsComponent,
    MapsProviderExampleComponent,
    ModelsLayerExampleComponent,
    PolygonPerformanceTestComponent,
    KeyboardControlLayerComponent,
    HippodromeLayerExampleComponent,
    LayerOrderComponent,
    ContextMenuLayerComponent,
    SelectionLayerExampleComponent,
    PolygonsEditorExampleComponent,
    CirclesEditorExampleComponent,
    PolylineEditorExampleComponent,
    HeatmapExampleComponent,
    HippodromeEditorExampleComponent,
    HtmlExampleComponent,
    EntitiesWithArraysExampleComponent,
    ToolbarExampleComponent,
    BoxesLayerComponent,
    TrackEntityLayerComponent,
    CzmlLayerExampleComponent,
    EllipsesEditorExampleComponent,
    MaxValidatorDirective,
    MinValidatorDirective,
    MainNavbarComponent,
    SidenavToolbarComponent,
    SettingsFormComponent,
    MyCustomContextMenuComponent,
  ],
  entryComponents: [TracksDialogComponent, MyCustomContextMenuComponent],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(apollo: Apollo, httpLink: HttpLink) {
    apollo.create({
      link: httpLink.create({
        uri: environment.server + '/graphql',
      }),
      cache: new InMemoryCache(),
    });
  }

}
