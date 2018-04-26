/**
 * Bootstraps the application and makes the ROUTER_PROVIDERS and the APP_BASE_HREF available to it.
 * @see https://angular.io/docs/ts/latest/api/platform-browser-dynamic/index/bootstrap-function.html
 */
import { enableProdMode } from '@angular/core';
import '../../node_modules/@angular/material/prebuilt-themes/deeppurple-amber.css';
// The browser platform with a compiler
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
// The app module
import { AppModule } from './app.module';
// Load i18n providers
// import { TranslationProviders } from './i18n.providers';

if (process.env.ENV === 'build-demo') {
  enableProdMode();
}

// Compile and launch the module with i18n providers
// let TP = new TranslationProviders();
// TP.getTranslationFile().then((providers: any) => {
  // const options: any = { providers };
Cesium.buildModuleUrl.setBaseUrl('/node_modules/cesium/Build/Cesium/');
Cesium.BingMapsApi.defaultKey = 'AtIXLwI-EOgRtuDna0r-bcIAfj7G_cN6fb98u3A1DbgEEW-SquLhxEi8KnGrlJkA';
platformBrowserDynamic().bootstrapModule(AppModule/*, options*/);
// });
