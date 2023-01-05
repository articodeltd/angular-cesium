import { Injectable } from '@angular/core';
import { EditablePolygon } from '../../../models/editable-polygon';
import { Cartesian3 } from '../../../../angular-cesium/models/cartesian3';
import { PolygonEditOptions } from '../../../models/polygon-edit-options';
import { AcLayerComponent } from '../../../../angular-cesium/components/ac-layer/ac-layer.component';
import { CoordinateConverter } from '../../../../angular-cesium/services/coordinate-converter/coordinate-converter.service';
import {CesiumService} from '../../../../angular-cesium';

@Injectable()
export class PolygonsManagerService {
  polygons: Map<string, EditablePolygon> = new Map<string, EditablePolygon>();

  constructor(private cesiumService: CesiumService) {
  }

  createEditablePolygon(id: string, editPolygonsLayer: AcLayerComponent, editPointsLayer: AcLayerComponent,
                        editPolylinesLayer: AcLayerComponent, coordinateConverter: CoordinateConverter,
                        polygonOptions?: PolygonEditOptions, positions: Cartesian3[] = [], useGroundPrimitiveOutline= false) {
    const editablePolygon = new EditablePolygon(
      id,
      editPolygonsLayer,
      editPointsLayer,
      editPolylinesLayer,
      coordinateConverter,
      polygonOptions,
      positions || null,
      this.cesiumService,
      useGroundPrimitiveOutline
    );
    this.polygons.set(id, editablePolygon
    );
  }

  dispose(id: string) {
    this.polygons.get(id).dispose();
    this.polygons.delete(id);
  }

  get(id: string): EditablePolygon {
    return this.polygons.get(id);
  }

  clear() {
    this.polygons.forEach(polygon => polygon.dispose());
    this.polygons.clear();
  }
}
