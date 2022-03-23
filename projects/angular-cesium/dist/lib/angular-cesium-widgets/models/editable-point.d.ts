import { CallbackProperty, Cartesian3 } from 'cesium';
import { AcLayerComponent } from '../../angular-cesium/components/ac-layer/ac-layer.component';
import { AcEntity } from '../../angular-cesium/models/ac-entity';
import { CoordinateConverter } from '../../angular-cesium/services/coordinate-converter/coordinate-converter.service';
import { EditPoint } from './edit-point';
import { LabelProps } from './label-props';
import { PointEditOptions, PointProps } from './point-edit-options';
interface PositionWithPointProps {
    position: Cartesian3;
    pointProp?: PointProps;
}
export declare class EditablePoint extends AcEntity {
    private id;
    private pointLayer;
    private coordinateConverter;
    private editOptions;
    private point;
    private _enableEdit;
    private _props;
    private _labels;
    constructor(id: string, pointLayer: AcLayerComponent, coordinateConverter: CoordinateConverter, editOptions: PointEditOptions, position?: Cartesian3);
    get labels(): LabelProps[];
    set labels(labels: LabelProps[]);
    get props(): PointProps;
    set props(value: PointProps);
    get enableEdit(): boolean;
    set enableEdit(value: boolean);
    private createFromExisting;
    private hasPosition;
    setManually(point: PositionWithPointProps | Cartesian3, props?: PointProps): void;
    addLastPoint(position: Cartesian3): void;
    movePoint(toPosition: Cartesian3): void;
    getCurrentPoint(): EditPoint;
    getPosition(): Cartesian3;
    getPositionCallbackProperty(): CallbackProperty;
    private updatePointLayer;
    update(): void;
    dispose(): void;
    getId(): string;
}
export {};
