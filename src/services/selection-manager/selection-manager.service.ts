import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AcEntity } from '../../models/ac-entity';
import { Observable } from 'rxjs/Observable';
import { MapEventsManagerService } from '../map-events-mananger/map-events-manager';
import { CesiumEvent } from '../map-events-mananger/consts/cesium-event.enum';
import { PickOptions } from '../map-events-mananger/consts/pickOptions.enum';

@Injectable()
export class SelectionManagerService {
	selectedEntities$: BehaviorSubject<AcEntity[]> = new BehaviorSubject<AcEntity[]>([]);
	
	selected$(): Observable<AcEntity[]> {
		return this.selectedEntities$.asObservable();
	}
	
	selected(): AcEntity[] {
		return this.selectedEntities$.getValue();
	}
	
	addToSelected(entity: AcEntity) {
		const current = this.selected();
		this.selectedEntities$.next([...current, entity]);
	}
	
	removeSelected(entity: AcEntity) {
		const current = this.selected();
		const entityIndex = current.indexOf(entity);
		if (entityIndex !== -1) {
			current.splice(entityIndex, 1);
			this.selectedEntities$.next(current);
		}
		
		this.selectedEntities$.next([...current, entity]);
	}
	
	initSelected({event = CesiumEvent.LEFT_CLICK, modifier, entityType}, addSelectedIndicator = true) {
		
		const mapEventMap: MapEventsManagerService = new MapEventsManagerService(null, null, null);
		const eventSubscription = mapEventMap.register({
			event : CesiumEvent.LEFT_CLICK,
			pick : PickOptions.PICK_ONE,
			modifier,
			entityType,
		});
		
		eventSubscription
			.map(result => result.entities)
			.filter(entities => entities && entities.length > 0)
			.subscribe(entities => {
				const entity = entities[0];
				const current = this.selected();
				if (current.indexOf(entity) === -1) {
					this.addToSelected(entity);
				} else {
					this.removeSelected(entity)
				}
			});
	}
}