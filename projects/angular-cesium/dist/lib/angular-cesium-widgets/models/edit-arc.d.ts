import { Cartesian3 } from 'cesium';
import { AcEntity } from '../../angular-cesium/models/ac-entity';
import { PolylineProps } from './polyline-edit-options';
export declare class EditArc extends AcEntity {
    private _arcProps;
    static counter: number;
    private id;
    private editedEntityId;
    private _center;
    private _radius;
    private _delta;
    private _angle;
    constructor(entityId: string, center: Cartesian3, radius: number, delta: number, angle: number, _arcProps: PolylineProps);
    get props(): PolylineProps;
    set props(props: PolylineProps);
    get angle(): number;
    set angle(value: number);
    get delta(): number;
    set delta(value: number);
    get radius(): number;
    set radius(value: number);
    get center(): Cartesian3;
    set center(value: Cartesian3);
    updateCenter(center: Cartesian3): void;
    getId(): string;
    private generateId;
}
