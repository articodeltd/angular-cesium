import { Cartesian3 } from 'cesium';
import { CoordinateConverter } from '../../../../angular-cesium/services/coordinate-converter/coordinate-converter.service';
import { AcLayerComponent } from '../../../../angular-cesium/components/ac-layer/ac-layer.component';
import { PointEditOptions } from '../../../models/point-edit-options';
import { EditablePoint } from '../../../models/editable-point';
import * as i0 from "@angular/core";
export declare class PointsManagerService {
    points: Map<string, EditablePoint>;
    createEditablePoint(id: string, editPointLayer: AcLayerComponent, coordinateConverter: CoordinateConverter, editOptions?: PointEditOptions, position?: Cartesian3): void;
    enableAll(): void;
    disableAll(): void;
    dispose(id: string): void;
    get(id: string): EditablePoint;
    clear(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<PointsManagerService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<PointsManagerService>;
}
