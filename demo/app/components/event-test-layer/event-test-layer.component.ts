import { Component, OnInit, ViewChild, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AcNotification } from '../../../../src/models/ac-notification';
import { ActionType } from '../../../../src/models/action-type.enum';
import { MapEventsManagerService } from '../../../../src/services/map-events-mananger/map-events-manager';
import { AcEntity } from '../../../../src/models/ac-entity';
import { AcLayerComponent } from '../../../../src/components/ac-layer/ac-layer.component';
import { CesiumEvent } from '../../../../src/services/map-events-mananger/consts/cesium-event.enum';
import { PickOptions } from '../../../../src/services/map-events-mananger/consts/pickOptions.enum';
import { PlonterService } from '../../../../src/services/plonter/plonter.service';
import { GeoUtilsService } from '../../../../src/services/geo-utils/geo-utils.service';

@Component({
	selector: 'event-test-layer',
	templateUrl: 'event-test-layer.component.html',
	styleUrls: ['event-test-layer.component.css'],
	providers: [GeoUtilsService]
})
export class EventTestLayerComponent implements OnInit {
	@ViewChild(AcLayerComponent) layer: AcLayerComponent;
	tracks$: Observable<AcNotification>;
	@Output() mouseMove = new EventEmitter();

	constructor(private eventManager: MapEventsManagerService,
							public  plonterService: PlonterService,
							private cd: ChangeDetectorRef,
							private geoUtilsService: GeoUtilsService) {
		const track1: AcNotification = {
			id: '0',
			actionType: ActionType.ADD_UPDATE,
			entity: AcEntity.create({
				id: '0',
				name: 'click me',
				position: Cesium.Cartesian3.fromRadians(0.5, 0.5),
			})
		};
		const track2: AcNotification = {
			id: '1',
			actionType: ActionType.ADD_UPDATE,
			entity: AcEntity.create({
				id: '1',
				name: 'choose me',
				position: Cesium.Cartesian3.fromRadians(0.7, 0.7),
			})
		};
		const track3: AcNotification = {
			id: '2',
			actionType: ActionType.ADD_UPDATE,
			entity: AcEntity.create({
				id: '2',
				name: 'click me too',
				position: Cesium.Cartesian3.fromRadians(0.71, 0.7),
			})
		};

		const trackArray = [track1, track2, track3];
		this.tracks$ = Observable.from(trackArray);
	}

	ngOnInit(): void {
		// Pass event only if clicked and contains at least one entity.
		this.eventManager.register({ event: CesiumEvent.LEFT_CLICK }).subscribe((pos) => {
			console.log('click2', pos.movement, 'primitives:', pos.primitives, 'entities', pos.entities);
		});

		// Send mouse location
		this.eventManager.register({ event: CesiumEvent.RIGHT_CLICK }).subscribe((pos) => {

			const screenPositionCartesian = this.geoUtilsService.screenPositionToCartesian3(pos.movement.endPosition);
			if (screenPositionCartesian) {
				const screenPositionCartographic = Cesium.Cartographic.fromCartesian(screenPositionCartesian);
				screenPositionCartographic.latitude = screenPositionCartographic.latitude * 180 / Math.PI;
				screenPositionCartographic.longitude = screenPositionCartographic.longitude * 180 / Math.PI;
				this.mouseMove.emit(screenPositionCartographic);
			}
			else {
				console.log('The mouse is outside of the map');
			}
		});

		// Example for Priority change
		// this.testPriority();

		// Example for click and change entity color
		this.testColorChange();

		// Example for long left down
		// this.testLongPress();

		// Example for plonter
		this.testPlonter();
	}

	testPlonter() {
		this.plonterService.plonterChangeNotifier.subscribe(() => this.cd.detectChanges());
		this.eventManager.register({ event: CesiumEvent.LEFT_CLICK, pick: PickOptions.PICK_ONE })
			.map((result) => result.entities)
			.filter(entities => entities && (entities[0].id === '1' || entities[0].id === '2'))
			.subscribe((result) => {
				console.log('plonter result: ' + JSON.stringify(result));
				alert('picked: ' + JSON.stringify(result));
			});
	}

	chooseEntity(entity) {
		this.plonterService.resolvePlonter(entity);
	}

	testLongPress() {
		this.eventManager.register({
			event: CesiumEvent.LONG_LEFT_PRESS,
			pick: PickOptions.PICK_ALL
		}).subscribe((pos) => {
			console.log('long left', pos.movement, 'primitives:', pos.primitives, 'entities', pos.entities);
		});
	}

	testPriority() {
		const o1 = this.eventManager.register({ event: CesiumEvent.LEFT_CLICK, priority: 1 });
		o1.subscribe((pos) => {
			console.log('click1P1', pos.movement, 'primitives:', pos.primitives, 'entities', pos.entities);
		}, err => null, () => console.log('complete'));
		const o2 = this.eventManager.register({ event: CesiumEvent.LEFT_CLICK, priority: 2 });
		o2.subscribe((pos) => {
			console.log('click2P2', pos.movement, 'primitives:', pos.primitives, 'entities', pos.entities);
		});
		const o3 = this.eventManager.register({ event: CesiumEvent.LEFT_CLICK, priority: 2 });
		o3.subscribe((pos) => {
			console.log('click3P2', pos.movement, 'primitives:', pos.primitives, 'entities', pos.entities);
		});
		const o4 = this.eventManager.register({ event: CesiumEvent.LEFT_CLICK, priority: 3 });
		o4.subscribe((pos) => {
			console.log('click4P3', pos.movement, 'primitives:', pos.primitives, 'entities', pos.entities);
		});

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
		const inputConf = { event: CesiumEvent.LEFT_CLICK, pick: PickOptions.PICK_FIRST, entityType: AcEntity };
		this.eventManager.register(inputConf).map((result) => result.entities[0]).filter((entity) => entity.id === '0').subscribe((entity) => {
			console.log('click3', 'toggle color');
			entity.color = entity.color === Cesium.Color.GREEN ? Cesium.Color.WHITE : Cesium.Color.GREEN;
			this.layer.updateNotification({ actionType: ActionType.ADD_UPDATE, entity: entity, id: entity.id });
		});
		// this.eventManager.register(inputConf).subscribe((result) => {
		// 	console.log('click3', result.movement, 'primitives:', result.primitives, 'entities', result.entities);
		// 	if (result.entities.length === 1) {
		// 		const entity = result.entities[0];
		// 		entity.color = entity.color === Cesium.Color.GREEN ? Cesium.Color.WHITE : Cesium.Color.GREEN;
		// 		this.layer.updateNotification({ actionType: ActionType.ADD_UPDATE, entity: entity, id: entity.id });
		// 	}
		// });
	}

}
