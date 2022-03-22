import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MainMapComponent } from './map-section/main-map/main-map.component';
import { ToolbarExampleComponent } from './map-section/toolbar-example/toolbar-example.component';
import { MyCustomContextMenuComponent } from './map-section/context-menu-layer/context-menu/my-custom-context-menu.component';
import { ContextMenuLayerComponent } from './map-section/context-menu-layer/context-menu-layer.component';
import { KeyboardControlLayerComponent } from './map-section/keyboard-control-layer/keyboard-control-layer.component';
import { AngularCesiumModule, AngularCesiumWidgetsModule } from 'angular-cesium';
import { MockDataProviderService } from './services/mock-data-provider.service';
import { UFOsLayerComponent } from './map-section/ufos-layer/ufos-layer.component';
import { NavBarComponent } from './about-section/nav-bar/nav-bar.component'
import { AboutComponent } from './about-section/about/about.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
    declarations: [
        AppComponent,
        MainMapComponent,
        ToolbarExampleComponent,
        MyCustomContextMenuComponent,
        ContextMenuLayerComponent,
        KeyboardControlLayerComponent,
        UFOsLayerComponent,
        NavBarComponent,
        AboutComponent
    ],
    imports: [
        BrowserModule,
        AngularCesiumModule.forRoot(),
        AngularCesiumWidgetsModule,
        FontAwesomeModule
    ],
    providers: [MockDataProviderService],
    bootstrap: [AppComponent]
})
export class AppModule {
}
