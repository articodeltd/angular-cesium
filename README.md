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
  
#### Angular cli
+ If you didn't installed [Angular CLI](https://github.com/angular/angular-cli) yet:
    ```bash
    $ npm install -g @angular/cli
    ```
    
+ start new project:
    ```bash
    $ ng new PROJECT_NAME
    $ cd PROJECT_NAME
    ```
+ Import and add `AngularCesiumModule` to your app root module:
    ```javascript
    import { AngularCesiumModule } from 'angular-cesium';
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

###### Cesium configuration
> <sup>In order to use cesium you must serve some assets from cesium package. The following configuration is for angular-cli projects,
for webpack users try [this](https://cesiumjs.org/2016/01/26/Cesium-and-Webpack/).</sup>
+ install `cesium` via:
  ```bash
  $ npm install --save cesium
  ```
  
 + Add cesium assets, script and css in `.angular-cli.json` file:
  ```javascript
	  "assets": [ // ...
	    { "glob": "**/*", "input": "../node_modules/cesium/Build/Cesium", "output": "./assets/cesium" }
	   ],
	  "styles": [ // ...
	    "../node_modules/cesium/Build/Cesium/Widgets/widgets.css"
	  ],
	  "scripts": [ // ...
	    "../node_modules/cesium/Build/Cesium/Cesium.js"
	  ],
  ```
+ Add `CESIUM_BASE_URL` in `main.ts` file , before bootstraping:
  ```javascript
    // ...
    window['CESIUM_BASE_URL'] = '/assets/cesium';
    platformBrowserDynamic().bootstrapModule(AppModule);
    ```

+ Add `declare var Cesium;` to `typing.d.ts` file.

+ You can configure cesium viewer style:
   ```css
   // styles.css
   html, body, #cesiumContainer {
       width: 100%;
       height: 100%;
       margin: 0;
       padding: 0;
       overflow: hidden;
   }
   ```

+ Live long and prosper

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
                      position: plane.position
                    }">
            </ac-billboard-desc>
            <ac-label-desc props="{
                    position: plane.position,
                    text: plane.name
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

## AC Layer
ac-layer is a directive which is meant to define a whole layer.
In case you have previous knowledge about CesiumJs, you would notice that there are lots of map objects e.g. billboard, label, etc'.
In the real world - we would like to merge all of this map objects into a single entity e.g. an airplane consists of a billboard(icon) and a label.
Now, let's create a simple airplanes layer and go through it's definitions:
First of all - the data source for a layer must be an RxJs stream.
Second - every notification on the stream should be of type AcNotification:
```js
export class AcNotification {
	id: number;
	entity?: AcEntity;
	actionType: ActionType;
}
```
id - unique entity key, `entity`- the data itself for the entity, `actionType`- presents what happened to the entity.
`actionType` can be one of those values:
```js
export enum ActionType {
	ADD_UPDATE,
	DELETE
}
```
In case `ADD_UPDATE` is passed - the entity will be created or updated depending on if it exists or not.
In case `DELETE` is passed - the entity will be removed from the map.

Now, assuming that each entity on this stream presents a plane, lets assume that each plane consits of this schema:
+ `position` - which presents the current plan position
+ `name` - which presents the plane name(to be presented on the map).
+ `image` - the PNG or whatever image you may like to use.

Now, Let's look at this piece of code:
  ```html
    <ac-map>
        <ac-layer acFor="let plane of planes$" [context]="this" [store]="true">
            <ac-billboard-desc props="{
                      image: plane.image,
                      position: plane.position
                    }">
            </ac-billboard-desc>
            <ac-label-desc props="{
                    position: plane.position,
                    text: plane.name,
                    fillColor: getColor(plane)
            }">
            </ac-label-desc>
        </ac-layer>
    </ac-map>
  ```
+ `ac-map` - Is a directive which presents the map and create a new Cesium instance.
+ `ac-layer` - Is our current directive which presents a plan layer. Remember that the data source must be a stream? In our case the stream is `planes$`.
+ `acFor` - Is a directive which lets you decide how would you call a single plane(or a single entity on the stream) in order to write the relevant expressions inside the directive(we'll see this in a moment). It should be noticed that the format for acFor is: `let {x} of {our stream}`.
+ `context` - The context of the observable (`planes$`) and the cesium descriptions `props` (same context as `getColor`). Usually it will be the context of the component itself - `this`.
+ `store` - Default: false. Tells Ac-Layer if it should store the entities it receives. The entities stored in the Ac-Layer store are extends by notifications from the stream (`planes$`).The store is an <entity id, entity> map. 
This in an optional basic data store. You can you use any kind of third party data store (e.g. ngrx/store).

Now, after we have defined our layer and decided that each entity on the stream will be called `plane`, let's drill down into the definitions of how an entity should look like.
+ `ac-billboard-desc` - which presents billboard from CesiumJs. This directive allows you to pass props(expressions) to this billboard. You may see that although we do pass props - we actually pass expressions that are based on the `plane` that we defined earlier. Actually we say: 'Dear `angular-cesium`, please create and manage a `billboard` using those expressions for each `plane`'.
Now, when an entity is passed through the stream - based on it's `id`, `actionType` and `entity` - `angular-cesium` will know what to do.
When passing data with the same `id` and `actionType=ADD_UPDATE` - the entity will be updated on the map for every message.
+ `ac-label-desc` - the same as ac-billboard but just for labels.
It should be mentioned that `ac-billboard-desc` & `ac-label-desc` are all exposing the same API as Cesium expose for each map-entity.

After explaining a little bit about `ac-layer` we hope that you may see it's benefits:
+ Easily defining a layer
+ Easily add/update/remove entities - all you have to do is pass a message through the stream and `angular-cesium` will keep track of all the rest.
+ Readable code - when reading your html which describes your layer - it is pretty easy to understand how your layer would look like.
+ Maintainable code.

## Documents
+ #### Check out our api [Docs](https://tgftech.github.io/angular-cesium/)   
 
# License
[Mit License](https://opensource.org/licenses/MIT)
