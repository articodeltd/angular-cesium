import { Observable } from 'rxjs/Observable';
import { LabelProps } from './label-props';

export class EditorObservable<T> extends Observable<T> {
  dispose: Function;
  enable: Function;
  disable: Function;
  setLabelsRenderFn: (T) => LabelProps[]
}
