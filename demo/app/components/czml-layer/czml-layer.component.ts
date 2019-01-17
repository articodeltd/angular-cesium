import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';

import { AcEntity, AcLayerComponent, AcNotification, ActionType, MapsManagerService } from 'angular-cesium';

@Component({
  selector: 'czml-layer',
  templateUrl: 'czml-layer.component.html',
})
export class CzmlLayerComponent implements OnInit {
  @ViewChild(AcLayerComponent) layer: AcLayerComponent;

  czmlPackets$: Observable<AcNotification>;
  show = true;
  updater = new Subscriber<AcNotification>();

  constructor(private mapsManagerService: MapsManagerService) {
  }

  ngOnInit() {

    const document = {
      'id': 'document',
      'version': '1.0'
    };

    const packet1 = {
      'id': 'point_1',
      'availability': '2012-08-04T16:00:00Z/2012-08-04T16:05:00Z',
      'position': {
        'epoch': '2012-08-04T16:00:00Z',
        'cartographicDegrees': [
          0, -70, 20, 150000,
          100, -80, 44, 150000,
          200, -90, 18, 150000,
          300, -98, 52, 150000
        ]
      },
      'point': {
        'color': {
          'rgba': [255, 255, 255, 200]
        },
        'outlineColor': {
          'rgba': [255, 0, 0, 200]
        },
        'outlineWidth': 3,
        'pixelSize': 15
      }
    };

    const packet2 = {
      'id': 'point_2',
      'availability': '2012-08-04T16:00:00Z/2012-08-04T16:05:00Z',
      'position': {
        'epoch': '2012-08-04T16:00:00Z',
        'cartographicDegrees': [
          0, -70, 25, 150000,
          100, -80, 44, 150000,
          200, -90, 18, 150000,
          300, -98, 52, 150000
        ]
      },
      'point': {
        'color': {
          'rgba': [255, 255, 255, 200]
        },
        'outlineColor': {
          'rgba': [0, 255, 0, 200]
        },
        'outlineWidth': 3,
        'pixelSize': 15
      }
    };


    this.czmlPackets$ = new Observable(observer => {
      this.updater = observer;

      // Attention, first packet needs to be a document
      // Example: https://cesiumjs.org/Cesium/Apps/Sandcastle/index.html?src=CZML%20Point%20-%20Time%20Dynamic.html&label=CZML
      this.updater.next({
        id: document.id,
        entity: new AcEntity(document),
        actionType: ActionType.ADD_UPDATE
      });

      // add point 1
      this.updater.next({
        id: packet1.id,
        entity: new AcEntity(packet1),
        actionType: ActionType.ADD_UPDATE
      });

      // add point 2
      this.updater.next({
        id: packet2.id,
        entity: new AcEntity(packet2),
        actionType: ActionType.ADD_UPDATE
      });

      // after 4 seconds, remove point 1
      setTimeout(() => {
        this.layer.remove('point_1');
      }, 4000);

      // after 5 seconds, update color and reset outlineColor of point 2
      setTimeout(() => {

        // changing the initial packet2
        packet2.point.color.rgba = [0, 0, 255, 200];

        this.updater.next({
          id: packet2.id,
          entity: new AcEntity(packet2),
          actionType: ActionType.ADD_UPDATE
        });

      }, 5000);

      // after 6 seconds add point 1 again
      setTimeout(() => {

        // add point 1
        this.updater.next({
          id: packet1.id,
          entity: new AcEntity(packet1),
          actionType: ActionType.ADD_UPDATE
        });

      }, 6000);

      // after 7 seconds, hide the layer
      setTimeout(() => {
        this.show = false;
      }, 7000);

      // after 8 seconds, show the layer
      setTimeout(() => {
        this.show = true;
      }, 8000);

      // after 9 seconds, remove all
      setTimeout(() => {
        this.layer.removeAll();
      }, 9000);

      // after 10 seconds add points 1 and 2 again
      setTimeout(() => {

        // add point 1
        this.updater.next({
          id: packet1.id,
          entity: new AcEntity(packet1),
          actionType: ActionType.ADD_UPDATE
        });

        // add point 2
        this.updater.next({
          id: packet2.id,
          entity: new AcEntity(packet2),
          actionType: ActionType.ADD_UPDATE
        });

      }, 10000);

      // after 11 seconds, update outlineColor of point 2
      setTimeout(() => {

        // providing an object that only contains the diff
        const updatePoint2 = {
          id: 'point_2',
          point: {
            outlineColor: {
              rgba: [0, 0, 255, 200]
            }
          }
        };

        this.updater.next({
          id: updatePoint2.id,
          entity: new AcEntity(updatePoint2),
          actionType: ActionType.ADD_UPDATE
        });

        this.zoomOnDataSource();
      }, 11000);

    });

  }


  zoomOnDataSource() {
    const czmlDataSources = this.layer.getDrawerDataSourcesByName('czml');
    const viewer = this.mapsManagerService.getMap().getCesiumViewer();
    viewer.flyTo(czmlDataSources[0].entities);
  }
}
