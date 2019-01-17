import { PolylineEditOptions } from './polyline-edit-options';

export interface PolygonProps {
  material?: any;
}

export interface PolygonEditOptions extends PolylineEditOptions {
  polygonProps?: PolygonProps;
}
