import { Injectable } from '@angular/core';

import { MapSelectionService } from '../map-selection-service/map-selection.service';
import { MultiSelectionInput } from './MultiSelectionInput.model';
import { CesiumService } from '../cesium/cesium.service';
import { CesiumEvent } from '../map-events-mananger/consts/cesium-event.enum';
import { MapEventsManagerService } from '../map-events-mananger/map-events-manager';
import { PlonterService } from '../plonter/plonter.service';
import * as _ from 'lodash';

/**
 * Manages multi-selection events.
 * __Notice__: If registering to the same event more then once, the array of picks will reset.
 * __usage:__
 * ```
 * MapSelectionService.select({event, modifier, priority, entityType, PickOptions.MULTI_PICK}).subscribe()
 * ```
 * __param:__ {CesiumEvent} event
 * __param:__ {CesiumEventModifier} modifier
 * __param:__ priority - the bigger the number the bigger the priority. default : 0.
 * __param:__ entityType - entity type class that you are interested like (Track). the class must extends AcEntity
 * __param:__ pickOption - self explained
 */
@Injectable()
export class MultiSelectionService extends MapSelectionService {
	private multiPickEventMap = new Map<CesiumEvent, Array<{ primitive: any }>>();
	private event: CesiumEvent;

	constructor(cesiumService: CesiumService,
	            mapEventsManagerService: MapEventsManagerService,
	            plonterService: PlonterService) {
		super(cesiumService, mapEventsManagerService, plonterService);
		this.triggerPickJson['MULTI_PICK'] = this.triggerMultiPick.bind(this);
	}

	select(input: MultiSelectionInput) {
		this.event = input.event;
		this.multiPickEventMap.set(input.event, []);

		return super.select(input);
	}

	private triggerMultiPick(movement: any) {
		const newPick = this.scene.pick(movement.endPosition);
		if (newPick) {
			const indexInArray = _.findIndex(this.multiPickEventMap.get(this.event), (entity) => {
				return entity.primitive.acEntity.id === newPick.primitive.acEntity.id;
			});
			if (indexInArray === -1) {
				this.multiPickEventMap.get(this.event).push(newPick);
			}
			else {
				this.multiPickEventMap.get(this.event).splice(indexInArray, 1);
			}
		}

		return {movement: movement, primitives: this.multiPickEventMap.get(this.event)};
	}
}
