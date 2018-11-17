import { EditorEditOptions } from './editor-edit-options';

export interface EllipseProps {
  material?: any;
  outline: boolean;
  outlineWidth?: number;
  outlineColor?: any
  granularity?: number;
  fill?: any;
}

export interface EllipseEditOptions extends EditorEditOptions {
  ellipseProps?: EllipseProps;
}
