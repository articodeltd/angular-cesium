import { Observable } from 'rxjs/Observable';
import { LabelProps } from './label-props';

export class EditorObservable<T> extends Observable<T> {
  dispose: Function;
  enable: Function;
  disable: Function;
  setLabelsRenderFn: (func: (update: T, labels: LabelProps[]) => LabelProps[]) => void;
  updateLabels: (func: (update: T, labels: LabelProps[]) => LabelProps[]) => void;
}
