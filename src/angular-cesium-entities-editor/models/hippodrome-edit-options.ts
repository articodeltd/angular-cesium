import { EditorEditOptions } from './editor-edit-options';

export interface HippodromeProps {
  width?: number;
  material?: any;
  outline?: boolean;
  outlineColor?: any;
  outlineWidth?: number;
}

export interface HippodromeEditOptions extends EditorEditOptions {
  hippodromeProps?: HippodromeProps;
}
