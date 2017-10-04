import { Observable } from 'rxjs/Observable';
import { PolygonEditUpdate } from './polygon-edit-update';

export class EditorObservable<T> extends Observable<T> {
  dispose: Function;
  enable: Function;
  disable: Function;
	polygonEditValue: () => PolygonEditUpdate
}
