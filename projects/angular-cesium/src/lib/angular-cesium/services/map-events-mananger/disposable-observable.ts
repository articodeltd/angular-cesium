import { Observable } from 'rxjs';

export class DisposableObservable<T> extends Observable<T> {
  dispose: Function;
}
