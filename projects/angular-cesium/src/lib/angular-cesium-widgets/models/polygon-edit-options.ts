import { PolylineEditOptions } from './polyline-edit-options';

export interface PolygonProps {
  material?: any;
  fill?: boolean;
  classificationType?: any;
  zIndex?: any;
}

export interface PolygonEditOptions extends PolylineEditOptions {
  polygonProps?: PolygonProps;
}
