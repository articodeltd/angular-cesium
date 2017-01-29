import { Injectable, EventEmitter } from '@angular/core';
import { AcEntity } from '../../models/ac-entity';
import { Subject } from 'rxjs';
import { EventResult } from '../map-events-mananger/map-events-manager';

@Injectable()
export class PlonterService {
    private _plonterShown: boolean;
    private _entitesToPlonter: AcEntity[] = [];
    private plonterObserver: Subject<EventResult>;
    private eventResult: EventResult;

    public notifyPlonterChange: EventEmitter<any> = new EventEmitter();

    constructor() {
        this.plonterObserver = new Subject<EventResult>();

    }

    get plonterShown(): boolean {
        return this._plonterShown;
    }

    get entitesToPlonter(): AcEntity[] {
        return this._entitesToPlonter;
    }

    plonterIt(eventResult: EventResult) {
        this.eventResult = eventResult;
        this._entitesToPlonter = eventResult.entities;
        this._plonterShown = true;

        this.notifyPlonterChange.emit(0);
        return this.plonterObserver;
    }

    resolvePlonter(entity: AcEntity) {
        this._plonterShown = false;
        this.eventResult.entities = [entity];

        this.notifyPlonterChange.emit(0);
        this.plonterObserver.next(this.eventResult);
    }

}