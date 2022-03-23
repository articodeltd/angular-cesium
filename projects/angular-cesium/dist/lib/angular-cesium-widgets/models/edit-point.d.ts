import { CallbackProperty, Cartesian3 } from 'cesium';
import { AcEntity } from '../../angular-cesium/models/ac-entity';
import { PointProps } from './point-edit-options';
export declare class EditPoint extends AcEntity {
    static counter: number;
    private id;
    private editedEntityId;
    private position;
    private _virtualEditPoint;
    private pointProps;
    private _show;
    constructor(entityId: string, position: Cartesian3, pointProps?: PointProps, virtualPoint?: boolean);
    get show(): boolean;
    set show(value: boolean);
    get props(): PointProps;
    set props(value: PointProps);
    isVirtualEditPoint(): boolean;
    setVirtualEditPoint(value: boolean): void;
    getEditedEntityId(): string;
    getPosition(): Cartesian3;
    getPositionCallbackProperty(): CallbackProperty;
    setPosition(position: Cartesian3): void;
    getId(): string;
    private generateId;
}
