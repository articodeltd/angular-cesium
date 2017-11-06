import { EditPoint } from './edit-point';
import { Cartesian3 } from '../../angular-cesium/models/cartesian3';
import { BasicEditUpdate } from './basic-edit-update';
import { PolygonEditOptions } from './polygon-edit-options';

export interface PolygonEditUpdate extends BasicEditUpdate<PolygonEditUpdate> {
  positions?: Cartesian3[];
  updatedPosition?: Cartesian3;
  draggedPosition?: Cartesian3;
  points?: EditPoint[];
  updatedPoint?: EditPoint;
  polygonOptions?: PolygonEditOptions;
}
