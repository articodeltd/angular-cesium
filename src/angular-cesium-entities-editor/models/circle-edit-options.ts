import { EditorEditOptions } from './editor-edit-options';

export interface CircleProps {
  material: any;
  outline: boolean;
  outlineWidth: number;
  outlineColor: any
}

export interface CircleEditOptions extends EditorEditOptions {
  circleProps?: CircleProps;
}
