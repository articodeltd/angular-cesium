# Angular-Cesium
<img src="https://preview.ibb.co/cpDuwF/angular_cesium.png" width=150 alt="Drawing" style="margin:10"/>

[![CircleCI](https://circleci.com/gh/TGFTech/angular-cesium.svg?style=shield)](https://circleci.com/gh/TGFTech/angular-cesium)
[![npm version](https://img.shields.io/npm/v/angular-cesium.svg?style=flat-square)](https://www.npmjs.com/package/angular-cesium)

Create map based applications using cesium and angular2 components.
Focusing on high performance with easy usage.  
Check out our [Demo](http://www.angular-cesium.com) that contains small app built with angular-cesium.

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
+ You can try and learn about angular-cesium from our demo: [http://www.angular-cesium.com](http://www.angular-cesium.com) ( most optimized as desktop application ).
+ The demo contains 2 examples
  + Real data: showing real planes using **GraphQL** to warp an exiting REST service.
  + Simulated data: displaying planes data and sending using **Socket.io**. 
    ```
    $ git clone https://github.com/TGFTech/angular-cesium.git
    $ cd angular-cesium
    $ yarn
    $ yarn server
    $ yarn start
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
  
+ Add descriptions components to determine which entity to render, 
  in our example: `ac-billboard` and `ac-label` .
  + This example will render a billboard(icon) and label for each plane in the stream.
  + `props` accepts the same member options as cesium corresponding class.
  For example `ac-billborad-desc` accepts same members as [cesium Billboard](https://cesiumjs.org/refdoc.html).

## AC Layer
[ac-layer](https://tgftech.github.io/angular-cesium/components/AcLayerComponent.html) is a directive which is meant to define a whole layer.
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
`id` - unique entity key, `entity`- the data itself for the entity, `actionType`- presents what happened to the entity.
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
+ `ac-label-desc` - the same as ac-billboard-desc but just for labels.
It should be mentioned that `ac-billboard-desc` & `ac-label-desc` are all exposing the same API as Cesium expose for each map-entity.
  
It is important to mention that angular-cesium doesn't duplicate the description component over the DOM for each different plane in `$plane` (as `ngFor` does).  
why? because  there is no reason to, cesium entities are drawn on the canvas map using javascript API i.e. entities aren't represented as HTML, by doing so we gain a major boost in performance.

After explaining a little bit about `ac-layer` we hope that you may see it's benefits:
+ Easily defining a layer
+ Easily add/update/remove entities - all you have to do is pass a message through the stream and `angular-cesium` will keep track of all the rest.
+ Readable code - when reading your html which describes your layer - it is pretty easy to understand how your layer would look like.
+ Maintainable code.

## Supported Entity types
+ billboard - [`ac-billboard-desc` / `ac-billboard`
+ label - `ac-label-desc` / `ac-label`
+ polyline - `ac-polyline-desc` / `ac-polyline`
+ ellipse - `ac-ellipse-desc` / `ac-ellipse`
+ circle - `ac-circle-desc` / `ac-circle` *Same API as ellipse, but accepting a radius instead of semiMajorAxis and semiMinorAxis 
+ polygon - `ac-polygon-desc` / `ac-polygon`
+ point - `ac-point-desc` / `ac-point`
+ model - `ac-model-desc`
+ box - `ac-box-dec`
+ corridor -`ac-corridor-dec`
+ cylinder - `ac-cylinder-dec`
+ ellipsoid - `ac-ellipsoid-dec`
+ polyline volume - `ac-polyline-volume-dec`
+ wall - `ac-wall-dec`
+ rectangle -`ac-rectangle-dec` 

## `ac-entity-desc` vs `ac-entity`
+ `ac-entity-desc` component is used to describe how each entity in a stream of entities, managed inside `ac-layer`, should be drawn.
+ `ac-entity` component is used to draw an entity directly on the map, and so, can be used directly under `ac-map`.

## Entities API
+ All of the entity components except Polyline (`ac-polyline` & `ac-polyline-desc`) are using a flatten Cesium Entities API.
+ e.g: `ac-billboard` `props` input accepts a JSON which can have all properties found in Cesium Entity plus all properties found in Cesium BillboardGraphics.
+ `ac-polyline` & `ac-polyline-desc` are using the Polyline Primitive API with an extended Material property that accepts Cesium Color Object.

## Map Events
`MapEventsManagerService` is a util service for managing all the map events (Click, Mouse_up...), it expose easy API for entity selection, event priority management 
and adds custom events (drag and drop, long press).

Usage:  
```javascript
@Component(...)
export class SomeComponent{
  constructor(private eventManager: MapEventsManagerService){
    
    // Input about the wanted event 
    const eventRegistration: EventRegistrationInput = {
      event: CesiumEvent.LEFT_CLICK, // event type enum. [required!]
      modifier: CesiumEventModifier.CTRL, // event modifier enum. [optional]
      entityType: AcEntity, // raise event only if AcEntity is clicked. [optional] 
      priority: 0, // event priority, default 0 . [optional]
      pick: PickOptions.PICK_FIRST // entity pick option, default PickOptions.NO_PICK. [optional]
    };
    const clickEvent = this.eventManager.register(eventRegistration).subscribe((result) => {
          // The EventResult will contain: 
          // movement(screen location of the event), entities(your entities) , primitives( cesium primitives, like label,billboard...)
    	  console.log('map click', result.movement, 'primitives:', result.primitives, 'entities', result.entities);
    	});
  } 
}
```  
In the example above we start listing to Click events. according to `eventRegisration` object.
- `eventManager.register()` 
  - Returns RxJs observer  of type `DisposableObservable<EventResult>` that we can subsribe to. 
  - To remove the event registration just do: `resultObserver.dispose()`
- **event:** according to `CesiumEvent` enum. All cesium events are supported, includes additional events like DragNDrop and LongPress
- **entityType:** it is possible to register to events on a specific entities types, e.g raise event only when `TrackEntity` is Clicked.
   - `AcEntity` is the base class for all angular-cesium entities, it is a part of `AcNotification` and is
     required for `MapEventManager` to work properly.
  - All entities should inherit from `AcEntity`  
   e.g `class TrackEntity extends AcEntity {}`
- **Priority:** by setting the priority you can register same events and only the one with the higher priority will be raised. For example 
   lets say when you left_click on the map a context menu should appear but if you in a drag and drop state you want that 
   left_click will raise a drop event only, you can achive this by setting different priority 
   to each event.
- **PickOptions:** according to the `PickOptions` enum, set the different strategies for picking entities on the map:
     *  NO_PICK    - will not pick entities
     *  PICK_FIRST  - first entity will be picked . use Cesium.scene.pick()
     *  PICK_ONE    - in case a few entities are picked plonter is resolved . use Cesium.scene.drillPick()
     *  PICK_ALL    - all entities are picked. use Cesium.scene.drillPick()
     
`MapEventsManagerService` is porivided by `<ac-map/>`, therefor has 2 possibilitis to reach it:
+ In any components under `<ac-map/>` hierarchy as seen in the example above  (recomannded).
+ Using` @viewChild` and ac-map reference: `acMapComponent.getMapEventManagerService()` .  

Checkout [demo/app/components/event-test-layer/event-test-layer.component.ts](https://github.com/TGFTech/angular-cesium/blob/master/demo/app/components/event-test-layer/event-test-layer.component.ts) for more examples.
     
##### All cesium map  events run out side angular zone  
Meaning that the the callback that you pass to map event manager
will be executed outside of angular zone. That is because Cesium run outside of Angular zone
in case for performance reasons , kind of `ON_PUSH` strategy.  
For example if you update your html template for every map event and you want it to render, 
you should use `ChangeDetectorRef` or warp your function with `NgZone.run()`
```javascript
class MyComponent {
  constructor(eventManager: MapEventsManagerService, ngZone: NgZone){
      eventManager.register(eventRegistration).subscribe((result) => {
          ngZone.run(()=>{
              this.textShownInTheTemplateHtml = result.movment;
          }); 
       });
  }
}
```
      
##### Plonter  
In case a two or more entities are in the same location and both are clicked you have a plonter (which entity should be picked?).  
This is resolved according to the `PickOptions` that we pass to the event registration:
-  NO_PICK    - non of the entities will be picked, you only interested in the map location.
-  PICK_FIRST - the first(upper) entity will be picked.
-  PICK_ALL    - all entities are picked and returned. 
-  PICK_ONE    - only one should be picked, a context will appear allowing the client to choose which entity he wants, selected entity will be passed to the eventcall back.

angular-cesium comes with `ac-default-plonter` a basic implementation for the plonter context menu. showing a list of entities names to select from.  
It is possible to create your own plonter context menu just take a look at `ac-default-plonter` implementation, and disable the default plonter:
```html
<ac-map [disableDefaultPlonter]="true"></ac-map>
```


### Map layers
With angular cesium you can define your map provider in a declarative way using `ac-map-layer-provider` :
```html
    <ac-map-layer-provider *ngIf="appSettingsService.showMapLayer" [provider]="MapLayerProviderOptions.ArcGisMapServer"
                           [options]="{
                                url : 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer'
                            }">
    </ac-map-layer-provider>
``` 
- All cesium imagery map layers are supported , defined with `[provider]` according to the `MapLayerProviderOptions` enum
- Pass additional configuration to `[options]` . `url` is mandatory. 
- Support multi map layers, map ordering and map image layer configuration.
- Check out usage example from our demo [here](https://github.com/TGFTech/angular-cesium/blob/master/demo/app/components/maps-layer/maps-layer.component.html)

### 3d Tiles
```html
   <ac-3d-tile-layer
       *ngIf="appSettingsService.show3dtiles"
       [options]="{
         url: 'https://beta.cesium.com/api/assets/1461?access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkYWJmM2MzNS02OWM5LTQ3OWItYjEyYS0xZmNlODM5ZDNkMTYiLCJpZCI6NDQsImFzc2V0cyI6WzE0NjFdLCJpYXQiOjE0OTkyNjQ3NDN9.vuR75SqPDKcggvUrG_vpx0Av02jdiAxnnB1fNf-9f7s'
       }">
   </ac-3d-tile-layer>
```

## Documents
+ #### Check out our api [Docs](https://tgftech.github.io/angular-cesium/)   
 
## License
[Mit License](https://opensource.org/licenses/MIT)
