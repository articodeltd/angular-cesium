import { PolygonEditOptions } from './polygon-edit-options';

export interface RectangleProps {
  material?: any;
  fill?: boolean;
  classificationType?: any;
  zIndex?: any;
  outline?: boolean;
  outlineColor?: any;
  outlineWidth?: number;
  height?: number;
  extrudedHeight?: number;
}

export interface RectangleEditOptions extends PolygonEditOptions {
  rectangleProps?: RectangleProps;
}

