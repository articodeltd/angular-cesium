import { Cartesian3 } from 'cesium';
import { EditPoint } from './edit-point';
import { BasicEditUpdate } from './basic-edit-update';
import { HippodromeEditOptions } from './hippodrome-edit-options';

export interface HippodromeEditUpdate extends BasicEditUpdate<HippodromeEditUpdate> {
  positions?: Cartesian3[];
  updatedPosition?: Cartesian3;
  draggedPosition?: Cartesian3;
  points?: EditPoint[];
  width?: number; // meters
  updatedPoint?: EditPoint;
  hippodromeOptions?: HippodromeEditOptions;
}
