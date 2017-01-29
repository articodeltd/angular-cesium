import {Injectable} from "@angular/core";
import {AcEntity} from "../../models/ac-entity";
import {Subject} from "rxjs";
import {EventResult} from "../map-events-mananger/map-events-manager";

@Injectable()
export class PlonterService {
    private _plonterShown: boolean;
    private _entitesToPlonter: AcEntity[] = [];
    private plonterObserver: Subject<EventResult>;
    private eventResult: EventResult;

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

        return this.plonterObserver;
    }

    resolvePlonter(entity: AcEntity) {
        this._plonterShown = false;
        this.eventResult.entities = [entity];
        this.plonterObserver.next(this.eventResult);
    }
}