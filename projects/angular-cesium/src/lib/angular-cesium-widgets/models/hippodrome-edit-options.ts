import { EditorEditOptions } from './editor-edit-options';

export interface HippodromeProps {
  width?: number;
  material?: any;
  outline?: boolean;
  outlineColor?: any;
  outlineWidth?: number;
  fill?: boolean;
  classificationType?: any;
  zIndex?: any;
  shadows?: any;
}

export interface HippodromeEditOptions extends EditorEditOptions {
  hippodromeProps?: HippodromeProps;
}
