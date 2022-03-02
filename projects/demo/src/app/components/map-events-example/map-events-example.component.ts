import { from as observableFrom, Observable } from 'rxjs';

import { filter, map, tap } from 'rxjs/operators';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Color, Cartesian3 } from 'cesium';
import {
  AcEntity,
  AcLayerComponent,
  AcNotification,
  ActionType,
  CameraService,
  CesiumEvent,
  CoordinateConverter,
  MapEventsManagerService,
  PickOptions
} from 'angular-cesium';

@Component({
  selector: 'map-events-example',
  templateUrl: 'map-events-example.component.html',
  styleUrls: ['map-events-example.component.css'],
  providers: [CoordinateConverter],
})
export class MapEventsExampleComponent implements OnInit {
  @ViewChild(AcLayerComponent) layer: AcLayerComponent;
  tracks$: Observable<AcNotification>;
  @Output() mouseMove = new EventEmitter();

  constructor(
    private eventManager: MapEventsManagerService,
    private cameraService: CameraService,
    private geoConverter: CoordinateConverter,
  ) {
    const track1: AcNotification = {
      id: '0',
      actionType: ActionType.ADD_UPDATE,
      entity: AcEntity.create({
        id: '0',
        name: 'click me',
        color: Color.BLUE,
        position: Cartesian3.fromDegrees(-95, 40),
      }),
    };
    const track2: AcNotification = {
      id: '1',
      actionType: ActionType.ADD_UPDATE,
      entity: AcEntity.create({
        id: '1',
        name: 'choose me',
        color: Color.AQUA,
        position: Cartesian3.fromDegrees(-85, 35),
      }),
    };
    const track10: AcNotification = {
      id: '10',
      actionType: ActionType.ADD_UPDATE,
      entity: AcEntity.create({
        id: '10',
        name: 'click me now please!',
        color: Color.BLUE,
        position: Cartesian3.fromDegrees(-84, 35),
      }),
    };
    const track11: AcNotification = {
      id: '11',
      actionType: ActionType.ADD_UPDATE,
      entity: AcEntity.create({
        id: '11',
        name: 'choose me too :)',
        color: Color.CORNFLOWERBLUE,
        position: Cartesian3.fromDegrees(-86, 35.5),
      }),
    };
    const track3: AcNotification = {
      id: '2',
      actionType: ActionType.ADD_UPDATE,
      entity: AcEntity.create({
        id: '2',
        name: 'click me too',
        color: Color.DARKBLUE,
        position: Cartesian3.fromDegrees(-84, 35),
      }),
    };
    const track4: AcNotification = {
      id: '3',
      actionType: ActionType.ADD_UPDATE,
      entity: AcEntity.create({
        id: '3',
        name: 'Drag me',
        color: Color.BLUE,
        position: Cartesian3.fromDegrees(-110, 40),
      }),
    };

    const trackArray = [track1, track2, track3, track4, track10, track11];
    this.tracks$ = observableFrom(trackArray);
  }

  ngOnInit(): void {
    // Pass event only if clicked
    // this.eventManager.register({ event: CesiumEvent.LEFT_CLICK }).subscribe((result) => {
    // 	console.log('map click', result.movement, 'cesiumEntities:', result.cesiumEntities, 'entities', result.entities);
    // });

    // Example for Priority change
    // this.testPriority();

    // Example for click and change entity color
    this.testColorChange();

    // Example for long left down
    // this.testLongPress();

    // Example for plonter
    this.testPlonter();

    // Example for drag and drop
    this.testDrag();
  }

  testDrag() {
    this.eventManager
      .register({event: CesiumEvent.LEFT_CLICK_DRAG, pick: PickOptions.PICK_FIRST, entityType: AcEntity})
      .pipe(
        filter(result => result.entities && result.entities[0].name === 'Drag me'),
        tap(result => {
          // disable camera rotation when dragging
          if (!result.movement.drop) {
            this.cameraService.enableInputs(false);
          } else {
            this.cameraService.enableInputs(true);
          }
        }),
        map(result => {
          const entity = result.entities[0];
          const nextPos = this.geoConverter.screenToCartesian3(result.movement.endPosition, false);
          if (nextPos) {
            entity.position = nextPos;
          }
          return entity;
        }),
      )
      .subscribe(entity => {
        this.layer.update(entity, entity.id);
      });
  }

  testPlonter() {
    this.eventManager
      .register({
        event: CesiumEvent.LEFT_CLICK,
        pick: PickOptions.PICK_ONE,
        pickFilter: entity => entity.id === '1' || entity.id === '2' || entity.id === '11' || entity.id === '10',
      })
      .pipe(map(result => result.entities))
      .subscribe(result => {
        console.log('plonter result: ' + JSON.stringify(result));
        alert('picked: ' + JSON.stringify(result));
      });
  }

  testLongPress() {
    this.eventManager
      .register({
        event: CesiumEvent.LONG_LEFT_PRESS,
        pick: PickOptions.PICK_ALL,
      })
      .subscribe(pos => {
        console.log('long left', pos.movement, 'cesiumEntities:', pos.cesiumEntities, 'entities', pos.entities);
      });
  }

  testPriority() {
    const o1 = this.eventManager.register({event: CesiumEvent.LEFT_CLICK, priority: 1});
    o1.subscribe(
      result => {
        console.log('click1 Priority 1', result.movement, 'cesiumEntities:', result.cesiumEntities, 'entities', result.entities);
      },
      err => null,
      () => console.log('complete'),
    );
    const o2 = this.eventManager.register({event: CesiumEvent.LEFT_CLICK, priority: 2});
    o2.subscribe(result => {
      console.log('click2 Priority 2', result.movement, 'cesiumEntities:', result.cesiumEntities, 'entities', result.entities);
    });
    const o3 = this.eventManager.register({event: CesiumEvent.LEFT_CLICK, priority: 2});
    o3.subscribe(result => {
      console.log('click3 Priority 2', result.movement, 'cesiumEntities:', result.cesiumEntities, 'entities', result.entities);
    });
    const o4 = this.eventManager.register({event: CesiumEvent.LEFT_CLICK, priority: 3});
    o4.subscribe(
      pos => {
        console.log('click4 Priority 3', pos.movement, 'cesiumEntities:', pos.cesiumEntities, 'entities', pos.entities);
      },
      () => console.log('error'),
      () => console.log('compelete'),
    );

    setTimeout(() => {
      console.log('first dispose o4');
      o4.dispose();
    }, 8000);
    setTimeout(() => {
      console.log('second dispose o3 o2');
      o3.dispose();
      o2.dispose();
    }, 15000);
  }

  testColorChange() {
    const inputConf = {event: CesiumEvent.LEFT_CLICK, pick: PickOptions.PICK_FIRST, entityType: AcEntity};
    this.eventManager
      .register(inputConf)
      .pipe(
        map(result => result.entities[0]),
        filter(entity => entity.id === '0'),
      )
      .subscribe(entity => {
        console.log('click3', 'toggle color');
        entity.color = entity.color === Color.GREEN ? Color.BLUE : Color.GREEN;
        this.layer.update(entity, entity.id);
      });
  }
}
