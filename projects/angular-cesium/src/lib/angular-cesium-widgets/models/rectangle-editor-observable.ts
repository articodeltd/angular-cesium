import { EditPoint } from './edit-point';
import { EditorObservable } from './editor-observable';
import { RectangleEditUpdate } from './rectangle-edit-update';
import { Rectangle } from '../../angular-cesium/models/rectangle';
import { RectangleProps } from './rectangle-edit-options';


export class RectangleEditorObservable extends EditorObservable<RectangleEditUpdate> {
  setManually: (coordinates: Rectangle,
                rectangleProps?: RectangleProps) => void;
  getCurrentPoints: () => EditPoint[];
}

