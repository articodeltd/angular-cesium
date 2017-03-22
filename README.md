# angular2cesium
[![CircleCI](https://circleci.com/gh/TGFTech/angular2cesium.svg?style=shield)](https://circleci.com/gh/TGFTech/angular2cesium)
[![npm version](https://img.shields.io/npm/v/angular2-cesium.svg?style=flat-square)](https://www.npmjs.com/package/angular2-cesium)

Create map based applications using cesium and angular components.
Focusing on high performance with easy usage.

## Getting started
+ install `angular2-cesium`:
  ```bash
  $ npm install --save angular2-cesium
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
+ You can try and learn about angular2-cesium from our demo:
    ```
    $ git clone https://github.com/TGFTech/angular2cesium.git
    $ cd angular2cesium
    $ npm install
    $ npm run test-server
    $ npm start
    $ open http://localhost:8080
    ```

## Usage
Anuglar-Cesium allow you to write your cesium map application using angular components  
#### Basic example

+ In your HTML file use `ac-map` tag to show the map:
  ```html
  <ac-map></ac-map>
  ```
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
+ Add a `ac-layer` to represent an array of entities that will be displayed on the map.
  + `acFor` attribute accepts an RxObserver `planes$` , `ac-layer` will subscribe to the observer
  and will handle all updates for you. 
  ```html
  <ac-map>
      <ac-layer acFor="let plane of planes$" [context]="this">
       // ...
      </ac-layer>
  </ac-map>
  ```
+ Add descriptions components to determine which primitives to render
  ```html
  <ac-map>
      <ac-layer acFor="let plane of planes$" [show]="showTracks" [context]="this">
          <ac-billboard-desc props="{
                    image: plane.image,
                    position: track.position,
                  }">
          </ac-billboard-desc>
          <ac-label-desc props="{
                  position: plane.position,
                  text: track.name,
          }">
          </ac-label-desc>
      </ac-layer>
  </ac-map>
  ```
  + This example will render an icon and a label for each plane in the stream.
  + `props` accepts the same member options as cesium corresponding class.
  For example `ac-biilborad-desc` accepts same members as [cesium Billboard](https://cesiumjs.org/refdoc.html).

# License
[Mit License](https://opensource.org/licenses/MIT)
    
