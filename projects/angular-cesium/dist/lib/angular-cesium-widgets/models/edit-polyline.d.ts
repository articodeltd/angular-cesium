import { CallbackProperty, Cartesian3 } from 'cesium';
import { AcEntity } from '../../angular-cesium/models/ac-entity';
import { PolylineProps } from './polyline-edit-options';
export declare class EditPolyline extends AcEntity {
    static counter: number;
    private editedEntityId;
    private id;
    private positions;
    private _polylineProps;
    constructor(entityId: string, startPosition: Cartesian3, endPosition: Cartesian3, polylineProps?: PolylineProps);
    get props(): PolylineProps;
    set props(value: PolylineProps);
    getEditedEntityId(): string;
    getPositions(): any[];
    getPositionsCallbackProperty(): CallbackProperty;
    validatePositions(): boolean;
    getStartPosition(): Cartesian3;
    getEndPosition(): Cartesian3;
    setStartPosition(position: Cartesian3): void;
    setEndPosition(position: Cartesian3): void;
    getId(): string;
    private generateId;
}
