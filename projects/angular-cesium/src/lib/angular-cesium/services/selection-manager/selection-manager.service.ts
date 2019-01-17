import { filter, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { AcEntity } from '../../models/ac-entity';
import { CesiumEvent } from '../map-events-mananger/consts/cesium-event.enum';
import { MapEventsManagerService } from '../map-events-mananger/map-events-manager';
import { PickOptions } from '../map-events-mananger/consts/pickOptions.enum';
import { CesiumEventModifier } from '../map-events-mananger/consts/cesium-event-modifier.enum';
import { MapsManagerService } from '../maps-manager/maps-manager.service';


export interface SelectionOptions {
  event?: CesiumEvent;
  modifier?: CesiumEventModifier;
  entityType?: any;
}

/**
 * Manages entity selection service for any given mouse event and modifier
 * the service will manage the list of selected items.
 * check out the example
 * you must provide the service yourself
 *
 *  __Usage :__
 * ```
 * // provide the service in some component
 * @Component({
 * //...
 *  providers: [SelectionManagerService]
 * }
 *
 * // Usage example:
 * // init selection
 * const selectedIndicator = ture; // optional default true, if true a boolean "selected" property will be added to the selected entity
 * selectionManagerService.initSelection({ event: CesiumEvent.LEFT_CLICK,
 * 																			modifier: CesiumEventModifier.CTRL
 * 																		},selectedIndicator);
 * // Get selected
 * const selected = selectionManagerService.selected();
 *
 * // Or as observer
 * const selected$ = selectionManagerService.selected$();
 *
 * ```
 *
 */
@Injectable()
export class SelectionManagerService {
  selectedEntitiesItems$: BehaviorSubject<AcEntity[]> = new BehaviorSubject<AcEntity[]>([]);
  selectedEntitySubject$: Subject<AcEntity> = new Subject<AcEntity>();
  private mapEventsManagerService: MapEventsManagerService;

  constructor(private mapsManager: MapsManagerService) {
  }

  selectedEntities$(): Observable<AcEntity[]> {
    return this.selectedEntitiesItems$.asObservable();
  }

  selectedEntities(): AcEntity[] {
    return this.selectedEntitiesItems$.getValue();
  }

  selectedEntity$() {
    return this.selectedEntitySubject$;
  }

  toggleSelection(entity: AcEntity, addSelectedIndicator: boolean) {
    const current = this.selectedEntities();
    if (current.indexOf(entity) === -1) {
      this.addToSelected(entity, addSelectedIndicator);
    } else {
      this.removeSelected(entity, addSelectedIndicator);
    }
  }

  private addToSelected(entity: AcEntity, addSelectedIndicator: boolean) {
    if (addSelectedIndicator) {
      entity['selected'] = true;
    }

    const current = this.selectedEntities();
    this.selectedEntitySubject$.next(entity);
    this.selectedEntitiesItems$.next([...current, entity]);
  }

  private removeSelected(entity: AcEntity, addSelectedIndicator: boolean) {
    if (addSelectedIndicator) {
      entity['selected'] = false;
    }

    const current = this.selectedEntities();
    const entityIndex = current.indexOf(entity);
    if (entityIndex !== -1) {
      current.splice(entityIndex, 1);
      this.selectedEntitiesItems$.next(current);
      this.selectedEntitySubject$.next(entity);
    }
  }

  initSelection(selectionOptions?: SelectionOptions, addSelectedIndicator = true, eventPriority?: number, mapId?: string) {
    const mapComponent = this.mapsManager.getMap(mapId);
    if (!mapComponent) {
      return;
    }

    this.mapEventsManagerService = mapComponent.getMapEventsManager();

    if (!selectionOptions) {
      Object.assign(selectionOptions, {event: CesiumEvent.LEFT_CLICK});
    }

    const eventSubscription = this.mapEventsManagerService.register({
      event: selectionOptions.event,
      pick: PickOptions.PICK_ONE,
      modifier: selectionOptions.modifier,
      entityType: selectionOptions.entityType,
      priority: eventPriority,
    });

    eventSubscription.pipe(
      map(result => result.entities),
      filter(entities => entities && entities.length > 0))
      .subscribe(entities => {
        const entity = entities[0];
        this.toggleSelection(entity, addSelectedIndicator);
      });
  }
}
