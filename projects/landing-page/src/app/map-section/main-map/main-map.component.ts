import { AfterViewInit, Component, Input } from '@angular/core';
import { MapMode2D, ScreenSpaceEventType, Cartesian3, HeadingPitchRoll, Cesium3DTileset, IonResource, 
         Cesium3DTileStyle
        } from 'cesium';
import { MapsManagerService, SceneMode, ViewerConfiguration } from '@auscope/angular-cesium';

@Component({
  selector: 'main-map',
  templateUrl: './main-map.component.html',
  providers: [ViewerConfiguration],
  styleUrls: ['./main-map.component.scss']
})
export class MainMapComponent implements AfterViewInit {
  @Input() multiMaps = false

  sceneMode3D = SceneMode.SCENE3D;
  sceneMode2D = SceneMode.PERFORMANCE_SCENE2D;
  Cesium = Cesium;

  constructor(private viewerConf: ViewerConfiguration, private mapsManagerService: MapsManagerService) {
    viewerConf.viewerOptions = {
      selectionIndicator: false,
      infoBox: false,
      baseLayerPicker: false,
      homeButton: false,
      navigationHelpButton: false,
      navigationInstructionsInitiallyVisible: false,
      mapMode2D: MapMode2D.ROTATE,
      timeline: false,
      animation: false,
      shouldAnimate: true,
      fullscreenButton: false,
      // shadows: true,
    };

    viewerConf.viewerModifier = (viewer: any) => {
      viewer.screenSpaceEventHandler.removeInputAction(
        ScreenSpaceEventType.LEFT_DOUBLE_CLICK
      );
      viewer.scene.highDynamicRange = true;

      viewer.scene.globe.enableLighting = true;

      viewer.clock.multiplier = 1000;

      viewer.camera.flyTo({
        destination: new Cartesian3(1333201.265614267, -4656207.315943864, 4137300.0112722577),
        orientation: new HeadingPitchRoll(0.5900541155692771, -0.2936886344551206, 0.0019308789347078914),
      });

      const tileset = new Cesium3DTileset({
        url: IonResource.fromAssetId(1988)
      });

      //   tileset.style = new Cesium3DTileStyle({
      //     color: {
      //         conditions: [
      //             ['${height} >= 300', 'rgba(45, 0, 75, 0.5)'],
      //             ['${height} >= 200', 'rgb(102, 71, 151)'],
      //             ['${height} >= 100', 'rgb(170, 162, 204)'],
      //             ['${height} >= 50', 'rgb(224, 226, 238)'],
      //             ['${height} >= 25', 'rgb(252, 230, 200)'],
      //             ['${height} >= 10', 'rgb(248, 176, 87)'],
      //             ['${height} >= 5', 'rgb(198, 106, 11)'],
      //             ['true', 'rgb(127, 59, 8)']
      //         ]
      //     }
      // });

      viewer.scene.primitives.add(tileset);
    };
  }

  ngAfterViewInit() {
    if (this.multiMaps) {
      setTimeout(() => {
        this.mapsManagerService.getMap('sub-map').getCesiumViewer().camera.flyTo({
          destination: Cartesian3.fromDegrees(-74, 40.5, 10000),
          duration: 1
        });
        this.mapsManagerService.getMap('main-map').getCesiumViewer().camera.flyTo({
          destination: new Cartesian3(1333201.265614267, -4656207.315943864, 4137300.0112722577),
          orientation: new HeadingPitchRoll(0.5900541155692771, -0.2936886344551206, 0.0019308789347078914),
        });
        setTimeout(() => this.mapsManagerService.sync2DMapsCameras([{ id: 'main-map' }, { id: 'sub-map' }]), 2000);
      }, 5000);

      setInterval(() => console.log(this.mapsManagerService.getMap('sub-map').getCesiumViewer().camera.position), 1000)
    }
  }
}
