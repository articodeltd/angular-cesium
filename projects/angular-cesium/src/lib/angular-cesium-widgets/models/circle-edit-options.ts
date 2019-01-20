import { EditorEditOptions } from './editor-edit-options';
import { EllipseProps } from './ellipse-edit-options';

export interface CircleEditOptions extends EditorEditOptions {
  circleProps?: EllipseProps;
}
