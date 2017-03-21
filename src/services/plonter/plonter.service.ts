import { Injectable, EventEmitter } from '@angular/core';
import { AcEntity } from '../../models/ac-entity';
import { Subject } from 'rxjs/Subject';
import { EventResult } from '../map-events-mananger/map-events-manager';

/**
 * Service for solving plonter.
 * Used by map-event-manager and plonter context component
 */
@Injectable()
export class PlonterService {
	private _plonterShown: boolean;
	private _entitesToPlonter: AcEntity[] = [];
	private _plonterObserver: Subject<EventResult>;
	private _eventResult: EventResult;
	private _plonterChangeNotifier: EventEmitter<any> = new EventEmitter();

	constructor() {
		this._plonterObserver = new Subject<EventResult>();
	}

	get plonterChangeNotifier(): EventEmitter<any> {
		return this._plonterChangeNotifier;
	}

	get plonterShown(): boolean {
		return this._plonterShown;
	}

	get entitesToPlonter(): AcEntity[] {
		return this._entitesToPlonter;
	}

	plonterIt(eventResult: EventResult) {
		this._eventResult = eventResult;
		this._entitesToPlonter = eventResult.entities;
		this._plonterShown = true;

		this._plonterChangeNotifier.emit();
		return this._plonterObserver;
	}

	resolvePlonter(entity: AcEntity) {
		this._plonterShown = false;
		this._eventResult.entities = [entity];

		this._plonterChangeNotifier.emit();
		this._plonterObserver.next(this._eventResult);
	}
}
