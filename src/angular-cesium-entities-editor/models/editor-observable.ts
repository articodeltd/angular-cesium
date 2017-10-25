import { Observable } from 'rxjs/Observable';
import { PolygonEditUpdate } from './polygon-edit-update';
import { EditPoint } from './edit-point';

export class EditorObservable<T> extends Observable<T> {
  dispose: Function;
  enable: Function;
  disable: Function;
	setPointsManually: (points: EditPoint[]) => void;
	polygonEditValue: () => PolygonEditUpdate;
	getCurrentPoints: () => EditPoint[];
}
