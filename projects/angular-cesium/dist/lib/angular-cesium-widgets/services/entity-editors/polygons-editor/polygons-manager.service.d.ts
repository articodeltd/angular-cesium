import { Cartesian3 } from 'cesium';
import { EditablePolygon } from '../../../models/editable-polygon';
import { PolygonEditOptions } from '../../../models/polygon-edit-options';
import { AcLayerComponent } from '../../../../angular-cesium/components/ac-layer/ac-layer.component';
import { CoordinateConverter } from '../../../../angular-cesium/services/coordinate-converter/coordinate-converter.service';
import * as i0 from "@angular/core";
export declare class PolygonsManagerService {
    polygons: Map<string, EditablePolygon>;
    createEditablePolygon(id: string, editPolygonsLayer: AcLayerComponent, editPointsLayer: AcLayerComponent, editPolylinesLayer: AcLayerComponent, coordinateConverter: CoordinateConverter, polygonOptions?: PolygonEditOptions, positions?: Cartesian3[]): void;
    dispose(id: string): void;
    get(id: string): EditablePolygon;
    clear(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<PolygonsManagerService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<PolygonsManagerService>;
}
