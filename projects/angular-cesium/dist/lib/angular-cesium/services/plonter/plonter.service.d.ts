import { EventEmitter } from '@angular/core';
import { AcEntity } from '../../models/ac-entity';
import { Subject } from 'rxjs';
import { EventResult, Movement } from '../map-events-mananger/map-events-manager';
import * as i0 from "@angular/core";
/**
 * Service for solving plonter.
 * Used by map-event-manager and plonter context component
 */
export declare class PlonterService {
    private _plonterShown;
    private _entitesToPlonter;
    private _plonterObserver;
    private _eventResult;
    private _plonterChangeNotifier;
    constructor();
    get plonterChangeNotifier(): EventEmitter<any>;
    get plonterShown(): boolean;
    get entitesToPlonter(): AcEntity[];
    get plonterClickPosition(): Movement;
    plonterIt(eventResult: EventResult): Subject<EventResult>;
    resolvePlonter(entity: AcEntity): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<PlonterService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<PlonterService>;
}
