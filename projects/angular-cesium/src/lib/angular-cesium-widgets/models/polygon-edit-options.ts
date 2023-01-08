import { PolylineEditOptions } from './polyline-edit-options';

export interface PolygonProps {
  material?: any;
  fill?: boolean;
  classificationType?: any;
  zIndex?: any;
  useGroundPrimitiveOutline?: boolean;
}

export interface PolygonEditOptions extends PolylineEditOptions {
  polygonProps?: PolygonProps;
}
