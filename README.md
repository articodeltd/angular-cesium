# Angular-Cesium
<img src="https://preview.ibb.co/cpDuwF/angular_cesium.png" width=150 alt="Drawing" style="margin:10"/>

[![CircleCI](https://circleci.com/gh/articodeltd/angular-cesium.svg?style=shield)](https://circleci.com/gh/articodeltd/angular-cesium)
[![npm version](https://img.shields.io/npm/v/angular-cesium.svg?style=flat-square)](https://www.npmjs.com/package/angular-cesium)

Create amazing mapping applications using Cesium and Angular components.
Angular-Cesium is focused on high performance and simple usage.
Check out our [Docs](https://docs.angular-cesium.com) and our blog post [Intro to angular-cesium](https://cesium.com/blog/2019/03/28/angular-cesium/).

## Getting started
#### If you are using Angular CLI, you can add the angular-cesium library using schematics
+ add `angular-cesium`:
  ```bash
  $ ng add angular-cesium
  ```
#### Manual installation details [here](https://docs.angular-cesium.com/getting-started/installation).

## Demo
+ You can try and learn about angular-cesium from our demo.
+ The demo contains many examples, check out the `demo-map.component.ts` file.
+ Run: 
    ```
    $ git clone https://github.com/articodeltd/angular-cesium.git
    $ cd angular-cesium
    $ yarn
    $ yarn demo:start
    $ open http://localhost:4200
    ```
+ More demos:
  + [Angular Cesium Demo](https://github.com/articodeltd/angular-cesium-demo)
  + [GeoStrike](http://geo-strike.com) - [Repository](https://github.com/Webiks/GeoStrike)
  + [GLO](https://glo.now.sh) - [Repository](https://github.com/sofwerx/glo-demo)
  + [Safehouse](https://github.com/sofwerx/safehouse)
  + [IMS](https://github.com/davidyaha/ims-workshop)


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
  For example `ac-billboard-desc` accepts same members as [cesium Billboard](https://cesiumjs.org/refdoc.html).

For better understading check out the [layer guide](https://docs.angular-cesium.com/core-concepts/ac-layer)

## Supported Entity types
+ billboard - [`ac-billboard-desc`](https://articodeltd.github.io/angular-cesium/components/AcBillboardDescComponent.html) / [`ac-billboard`](https://articodeltd.github.io/angular-cesium/components/AcBillboardComponent.html) / [`ac-billboard-primitive-desc`](https://articodeltd.github.io/angular-cesium/components/AcBillboardPrimitiveDescComponent.html) - [stackblitz](https://stackblitz.com/edit/angular-cesium-billboard-example?embed=1&file=src/app/billboard-layer-example/billboard-layer-example.component.ts)
+ label - [`ac-label-desc`](https://articodeltd.github.io/angular-cesium/components/AcLabelDescComponent.html) / [`ac-label`](https://articodeltd.github.io/angular-cesium/components/AcLabelComponent.html) / [`ac-label-primitive-desc`](https://articodeltd.github.io/angular-cesium/components/AcLabelPrimitiveDescComponent.html) - [stackblitz](https://stackblitz.com/edit/angular-cesium-demo-label-example?embed=1&file=src/app/label-layer-example/label-layer-example.component.ts)
+ polyline - [`ac-polyline-desc`](https://articodeltd.github.io/angular-cesium/components/AcPolylineDescComponent.html) / [`ac-polyline`](https://articodeltd.github.io/angular-cesium/components/AcPolylineComponent.html) / [`ac-polyline-primitive-desc`](https://articodeltd.github.io/angular-cesium/components/AcPolylinePrimitiveDescComponent.html) - [stackblitz](https://stackblitz.com/edit/angular-cesium-polyline-example?embed=1&file=src/app/polyline-layer-example/polyline-layer-example.component.ts)
+ point - [`ac-point-desc`](https://articodeltd.github.io/angular-cesium/components/AcPointDescComponent.html) / [`ac-point`](https://articodeltd.github.io/angular-cesium/components/AcPointComponent.html) / [`ac-primitive-point`](https://articodeltd.github.io/angular-cesium/components/AcPointPrimitiveDescComponent.html) - [stackblitz](https://stackblitz.com/edit/angular-cesium-point-example?embed=1&file=src/app/point-layer-example/mock-data-provider.service.ts)
+ ellipse - [`ac-ellipse-desc`](https://articodeltd.github.io/angular-cesium/components/AcEllipseDescComponent.html) / [`ac-ellipse`](https://articodeltd.github.io/angular-cesium/components/AcEllipseComponent.html) - [stackbliz](https://stackblitz.com/edit/angular-cesium-demo-ellipse?embed=1&file=src/app/ellipse-layer/ellipse-layer-example.component.ts) - [stackblitz](https://stackblitz.com/edit/angular-cesium-demo-ellipse?embed=1&file=src/app/ellipse-layer/ellipse-layer-example.component.ts)
+ circle - [`ac-circle-desc`](https://articodeltd.github.io/angular-cesium/components/AcCircleDescComponent.html) / [`ac-circle`](https://articodeltd.github.io/angular-cesium/components/AcCircleComponent.html) - [stackblitz](https://stackblitz.com/edit/angular-cesium-circle-example?embed=1&file=src/app/circle-layer-example/circle-layer-example.component.ts) *Same API as ellipse, but accepting a radius instead of semiMajorAxis and semiMinorAxis - [stackblitz](https://stackblitz.com/edit/angular-cesium-circle-example?embed=1&file=src/app/circle-layer-example/circle-layer-example.component.ts)
+ polygon - [`ac-polygon-desc`](https://articodeltd.github.io/angular-cesium/components/AcPolygonDescComponent.html) / [`ac-polygon`](https://articodeltd.github.io/angular-cesium/components/AcPolygonComponent.html) - [stackblitz](https://stackblitz.com/edit/angular-cesium-polygon-example?embed=1&file=src/app/polygon-layer-example/polygon-layer-example.component.ts) 
+ model - [`ac-model-desc`](https://articodeltd.github.io/angular-cesium/components/AcModelDescComponent.html) - [stackblitz](https://stackblitz.com/edit/angular-cesium-model-example?embed=1&file=src/app/models-layer-example/models-layer-example.component.ts)
+ box - [`ac-box-desc`](https://articodeltd.github.io/angular-cesium/components/AcBoxDescComponent.html) - [stackblitz](https://stackblitz.com/edit/angular-cesium-box-example?embed=1&file=src/app/boxes-layer/boxes-layer.component.ts)
+ corridor -[`ac-corridor-desc`](https://articodeltd.github.io/angular-cesium/components/AcCorridorDescComponent.html) - [stackblitz](https://stackblitz.com/edit/angular-cesium-demo?embed=1&file=src/app/hippodrome-layer/hippodrome-layer-example.component.ts)
+ cylinder - [`ac-cylinder-desc`](https://articodeltd.github.io/angular-cesium/components/AcCylinderDescComponent.html) - [stackblitz](https://stackblitz.com/edit/angular-cesium-cylinder-example?embed=1&file=src/app/cylinder-layer-example/cylinder-layer-example.component.ts)
+ ellipsoid - [`ac-ellipsoid-desc`](https://articodeltd.github.io/angular-cesium/components/AcEllipsoidDescComponent.html) - [stackblitz](https://stackblitz.com/edit/angular-cesium-ellipsoid-example?embed=1&file=src/app/ellipsoid-layer-example/ellipsoid-layer-example.component.ts)
+ polyline volume - [`ac-polyline-volume-desc`](https://articodeltd.github.io/angular-cesium/components/AcPolylineVolumeDescComponent.html) - [stackblitz](https://stackblitz.com/edit/angular-cesium-polyline-volume-example?embed=1&file=src/app/polyline-volume-layer-example/polyline-volume-layer-example.component.ts)
+ wall - [`ac-wall-desc`](https://articodeltd.github.io/angular-cesium/components/AcWallDescComponent.html) - [stackblitz](https://stackblitz.com/edit/angular-cesium-wall-example?embed=1&file=src/app/wall-layer-example/wall-layer-example.component.ts)
+ rectangle -[`ac-rectangle-decc`](https://articodeltd.github.io/angular-cesium/components/AcRectangleDescComponent.html) - [stackblitz](https://stackblitz.com/edit/angular-cesium-rectangle-example?embed=1&file=src/app/rectangle-layer-example/rectangle-layer-example.component.ts)
* html - [`ac-html-desc`](https://articodeltd.github.io/angular-cesium/components/AcHtmlDescComponent.html) / [`ac-html`](https://articodeltd.github.io/angular-cesium/components/AcHtmlComponent.html) - [stackblitz](https://stackblitz.com/edit/angular-cesium-html-example?embed=1&file=src/app/html-layer/html-example.component.ts)
+ arc -[`ac-arc-dec`](https://articodeltd.github.io/angular-cesium/components/AcArcDescComponent.html) - [stackblitz](https://stackblitz.com/edit/angular-cesium-arc-example?embed=1&file=src/app/arc-layer/arc-layer-example.component.ts)
* array - [`ac-array-desc`](https://articodeltd.github.io/angular-cesium/components/AcArrayDescComponent.html) - [stackblitz](https://stackblitz.com/edit/angular-cesium-demo-arrays?embed=1&file=src/app/entities-with-arrays/entities-with-arrays-example.component.ts)
* czmlPacket - [`ac-czml-desc`](https://articodeltd.github.io/angular-cesium/components/AcCzmlDescComponent.html)

## Map Events
`MapEventsManagerService` is a util service for managing all the map events (Click, Mouse_up...), it expose easy API for entity selection, event priority management
and adds custom events (drag and drop, long press).

## MapLayerProviderOptions Updates
`MapboxStyleImageryProvider` has been added to the `MapLayerProviderOptions` enum for mapBox styles support.

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

For further details check the [map events guide](https://docs.angular-cesium.com/guides/map-events)

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
- Check out usage example from our demo [here](https://github.com/TGFTech/angular-cesium/blob/master/demo/app/components/maps-layer/maps-provider-example.component.html)

### 3d Tiles
```html
   <ac-3d-tile-layer
       *ngIf="appSettingsService.show3dtiles"
       [options]="{
         url: 'https://beta.cesium.com/api/assets/1461?access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkYWJmM2MzNS02OWM5LTQ3OWItYjEyYS0xZmNlODM5ZDNkMTYiLCJpZCI6NDQsImFzc2V0cyI6WzE0NjFdLCJpYXQiOjE0OTkyNjQ3NDN9.vuR75SqPDKcggvUrG_vpx0Av02jdiAxnnB1fNf-9f7s'
       }">
   </ac-3d-tile-layer>
```
### Multiple maps support
Angular Cesium supports integration of multiple maps, for more details [here](https://docs.angular-cesium.com/guides/multiple-maps-sync)

### Camera
#### [Camera Keyboard Control Service](https://docs.angular-cesium.com/guides/camera-keyboard-control)
Service that manages keyboard keys and execute actions per request. Inject the keyboard control service into any layer, under your ac-map component, And defined you keyboard handlers using setKeyboardControls.
```javascript
 this.keyboardControlService.setKeyboardControls({
      W: { action: KeyboardAction.CAMERA_FORWARD },
      S: { action: KeyboardAction.CAMERA_BACKWARD },
      D: { action: KeyboardAction.CAMERA_RIGHT },
      A: { action: KeyboardAction.CAMERA_LEFT },
    },

```
#### [CameraService](https://docs.angular-cesium.com/guides/camera-controls)
Util service that wraps cesium camera, exposes the scene's camera and screenSpaceCameraController.


### MapsManagerService
Angular Cesium extends cesium api and expose additional features, but if you want to use pure cesium api you can use [MapsManagerService](https://articodeltd.github.io/angular-cesium/injectables/MapsManagerService.html) to receive cesium [viewer](https://cesiumjs.org/Cesium/Build/Documentation/Viewer.html) or any other util service that was created by `ac-map`.
```typescript
class MyComp {
constructor(mapsManagerService: MapsManagerService)
	const viewer = mapsManagerService.getMap().getCesiumViewer();
	const mapEventManager = mapsManagerService.getMap().getMapEventsManager();
	const cameraService = mapsManagerService.getMap().getCameraService();
}
```
`MapsManagerService` manages all of the maps. The service exposes a `getMap()` function that can be used to retrieve a specific map by id.

#### [ZoomToRectangleService](https://docs.angular-cesium.com/widgets/zoomto-rectangle)
A service that is used to activate a zooming tool that enables the user to draw a rectangle over the map and zoom into the drawn rectangle

### Geometry Editors And Widgets
Part of `AngularCesiumWidgetsModule` are useful geometry editors tool:
+ [`CirlcesEditorService`](https://docs.angular-cesium.com/widgets/shape-editors/circle-editor) - for drawing circles
+ [`EllipsesEditorService`](https://docs.angular-cesium.com/widgets/shape-editors/ellipse-editor) - for drawing ellipses and circles
+ [`PolylinesEditorService`](https://docs.angular-cesium.com/widgets/shape-editors/polyline-editor) - for drawing polylines
+ [`PolygonsEditorService`](https://docs.angular-cesium.com/widgets/shape-editors/polygon-editor) - for drawing polygons
+ [`RectanglesEditorService`](https://docs.angular-cesium.com/widgets/shape-editors/rectangle-editor) - for drawing rectangles
+ [`HippodromeEditorService`](https://docs.angular-cesium.com/widgets/shape-editors/hippodrome-editor) - for drawing hippodromes (path in cesium)

Check out the [Geometry Editors Doc](https://docs.angular-cesium.com/widgets/shape-editors)

### ScreenshotService
Take screenshot of your cesium globe.

### ContextMenuService - [stackblitz](https://stackblitz.com/edit/angular-cesium-context-menu-example?embed=1&file=src/app/context-menu-layer/context-menu-layer.component.ts)
create any custom angular component and anchor it to a map position, [context menu guide](https://docs.angular-cesium.com/guides/context-menu-on-the-map).

## Documents
+ #### Docs https://docs.angular-cesium.com/
+ #### [Api Docs](https://articodeltd.github.io/angular-cesium/)

## License
[Mit License](https://opensource.org/licenses/MIT)

## Support
Angular Cesium is an open source project, feel free to open issues,ask questions and open PRs.
For additional support options contact us: [contact@articode.co](mailto:\\contact@articode.co).

Articode is a software company that specializes in GIS solutions and is the creator and the maintainer of angular-cesium.
Feel free to contact us for consulting or any business endeavors.
