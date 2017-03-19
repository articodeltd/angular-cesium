# angular2cesium
Create map based applications using cesium and angular components.
Focusing on high performance with easy usage.

## Getting started

+ If you didn't installed [Angular CLI](https://github.com/angular/angular-cli) yet:
    ```
    $ npm install -g @angular/cli
    ```
    
+ start new project:
    ```
    $ ng new PROJECT_NAME
    $ cd PROJECT_NAME
    ```
    
+ install `angular2-cesium` and `cesium` via:
  ```
  $ npm install --save angular2-cesium
  $ npm install --save cesium
  ```

+ Import our main module:
    ```
    import { AngularCesiumModule } from 'angular-cesium/angular-cesium.module';
    ```

+ Add `"../node_modules/cesium/Build/Cesium/Cesium.js"`
to `scripts` in `.angular-cli.json` file.

+ Add `declare var Cesium;` to `typing.d.ts` file

### Usage

+ In your HTML file use `ac-map` tag to show the map:
  ```
  <ac-map></ac-map>
  ```
  
+ Add to `style.css`:
  ```
  @import url(/node_modules/cesium/Build/Cesium/Widgets/widgets.css);
  html, body, #cesiumContainer {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    overflow: hidden;
  }
  ```

## Demo
+ You can try and learn about angular2-cesium from our demo:
    ```
    $ git clone https://github.com/TGFTech/angular2cesium.git
    $ cd angular2cesium
    $ npm install
    $ npm run test-server
    $ npm start
    $ open http://localhost:8080
    ```
    