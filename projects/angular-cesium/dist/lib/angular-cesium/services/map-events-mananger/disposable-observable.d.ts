import { Observable } from 'rxjs';
export declare class DisposableObservable<T> extends Observable<T> {
    dispose: Function;
}
