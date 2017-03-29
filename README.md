# Angular-Cesium
<img src="https://preview.ibb.co/cpDuwF/angular_cesium.png" width=150 alt="Drawing" style="margin:10"/>

[![CircleCI](https://circleci.com/gh/TGFTech/angular-cesium.svg?style=shield)](https://circleci.com/gh/TGFTech/angular-cesium)
[![npm version](https://img.shields.io/npm/v/angular-cesium.svg?style=flat-square)](https://www.npmjs.com/package/angular-cesium)

Create map based applications using cesium and angular2 components.
Focusing on high performance with easy usage.

## Getting started
+ install `angular-cesium`:
  ```bash
  $ npm install --save angular-cesium
  ```
  
##### Angular cli
+ If you didn't installed [Angular CLI](https://github.com/angular/angular-cli) yet:
    ```bash
    $ npm install -g @angular/cli
    ```
    
+ start new project:
    ```bash
    $ ng new PROJECT_NAME
    $ cd PROJECT_NAME
    ```
    
+ install `cesium` via:
  ```bash
  $ npm install --save cesium
  ```

+ Import and add `AngularCesiumModule` to your app root module:
    ```typescript
    import { AngularCesiumModule } from 'angular-cesium/angular-cesium.module';
    // ....
    @NgModule({
    	declarations: [],
    	imports: [
    		// ...
    		AngularCesiumModule
    	],
    	bootstrap: [AppComponent]
    })
    export class AppModule {
    }
    ```

+ Add `"../node_modules/cesium/Build/Cesium/Cesium.js"`
to `scripts` in `.angular-cli.json` file.

+ Add `declare var Cesium;` to `typing.d.ts` file

## Demo
+ You can try and learn about angular-cesium from our demo:
    ```
    $ git clone https://github.com/TGFTech/angular-cesium.git
    $ cd angular-cesium
    $ npm install
    $ npm run test-server
    $ npm start
    $ open http://localhost:8080
    ```
  
## Basic example

+ In your HTML file :
  ```html
    <ac-map>
        <ac-layer acFor="let plane of planes$" [show]="showTracks" [context]="this">
            <ac-billboard-desc props="{
                      image: plane.image,
                      position: plane.position,
                    }">
            </ac-billboard-desc>
            <ac-label-desc props="{
                    position: plane.position,
                    text: plane.name,
            }">
            </ac-label-desc>
        </ac-layer>
    </ac-map>
  ```
+ `ac-map` creates the map
+ `ac-layer` component represent an array of entities that will be displayed on the map.
  + `acFor` attribute accepts an RxObserver `planes$` , `ac-layer` will subscribe to the observer
  and will handle all updates for you. 
  
+ Add descriptions components to determine which primitives to render, 
  in our example: `ac-billboard` and `ac-label` .
  + This example will render a billboard(icon) and label for each plane in the stream.
  + `props` accepts the same member options as cesium corresponding class.
  For example `ac-billborad-desc` accepts same members as [cesium Billboard](https://cesiumjs.org/refdoc.html).

+ Add to `style.css`:
  ```typescript
    @import url(/node_modules/cesium/Build/Cesium/Widgets/widgets.css);
    html, body, #cesiumContainer {
      width: 100%;
      height: 100%;
      margin: 0;
      padding: 0;
      overflow: hidden;
    }
  ```

## Documents
+ #### Check out our api [Docs](https://tgftech.github.io/angular-cesium/)   
 
# License
[Mit License](https://opensource.org/licenses/MIT)
