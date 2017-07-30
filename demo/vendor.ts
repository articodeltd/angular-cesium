// Angular
import '@angular/platform-browser';
import '@angular/platform-browser-dynamic';
import '@angular/core';
import '@angular/common';
import '@angular/http';
// RxJS
import 'rxjs';

// Other vendors for example jQuery, Lodash or Bootstrap
// You can import js, ts, css, sass, ...
window['CESIUM_BASE_URL'] = '/node_modules/cesium/Build/Cesium';
require('../node_modules/cesium/Build/CesiumUnminified/Cesium.js');
require('../node_modules/primitive-primitives/dist/main');
require('../node_modules/socket.io-client');

import './css/main.css';
import './css/loading.css';
