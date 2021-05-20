import { Observable } from 'rxjs';
import { LabelProps } from './label-props';

export class EditorObservable<T> extends Observable<T> {
  dispose: Function;
  enable: Function;
  disable: Function;
  getLabels: () => LabelProps[];
  getEditValue: () => T;
  setLabelsRenderFn: (func: (update: T, labels: LabelProps[]) => LabelProps[]) => void;
  updateLabels: (labels: LabelProps[]) => void;
  finishCreation: () => boolean;
}
