import { Observable } from 'rxjs/Observable';

export class DisposableObservable<T> extends Observable<T> {
	dispose: Function;
}
