import { Cartesian3 } from 'cesium';
import { EditableHippodrome } from '../../../models/editable-hippodrome';
import { HippodromeEditOptions } from '../../../models/hippodrome-edit-options';
import { AcLayerComponent } from '../../../../angular-cesium/components/ac-layer/ac-layer.component';
import { CoordinateConverter } from '../../../../angular-cesium/services/coordinate-converter/coordinate-converter.service';
import * as i0 from "@angular/core";
export declare class HippodromeManagerService {
    hippodromes: Map<string, EditableHippodrome>;
    createEditableHippodrome(id: string, editHippodromeLayer: AcLayerComponent, editPointsLayer: AcLayerComponent, coordinateConverter: CoordinateConverter, hippodromeEditOptions?: HippodromeEditOptions, positions?: Cartesian3[]): void;
    get(id: string): EditableHippodrome;
    clear(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<HippodromeManagerService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<HippodromeManagerService>;
}
