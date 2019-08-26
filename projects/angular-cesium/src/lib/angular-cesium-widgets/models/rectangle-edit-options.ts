import { PolygonEditOptions } from './polygon-edit-options';

export interface RectangleProps {
  material?: any;
  fill?: boolean;
  classificationType?: any;
  zIndex?: any;
}

export interface RectangleEditOptions extends PolygonEditOptions {
  rectangleProps?: RectangleProps;
}

