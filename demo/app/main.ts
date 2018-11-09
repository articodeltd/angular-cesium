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
Cesium.BingMapsApi.defaultKey = 'Am8FCQ4k7r4ngrHuGL6wtJTREJIBIGwDVPbUhRA1vR4n0DiZARj8jHXxazLiS1j_';
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2YTY1NDYzYS01YzgxLT' +
  'Q2MGUtODBiYy0zODRmY2MwOGY4MDIiLCJpZCI6MjA1LCJpYXQiOjE1MDQ3MjQ1Njh9.rKgXUKAfFiiSAm_b9T8bpsDVdj0YyZeqGxNpzLlhxpk';
platformBrowserDynamic().bootstrapModule(AppModule/*, options*/);
// });
