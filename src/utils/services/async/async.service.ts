import {Injectable} from '@angular/core';

function *arrayIterator(array: Array<any>, callback: Function, bulkSize: number, doneCallback: Function, nextCallback: Function) {
    let i = 0;
    let len = array.length;
    while (i < len) {
        for (let j = i, end = Math.min(i + bulkSize, len); j < end; j++) {
            callback(array[j]);
        }
        i += bulkSize;
        yield setTimeout(()=> nextCallback(), 0);
    }
    if (doneCallback) {
        yield doneCallback();
    }
}

@Injectable()
export class AsyncService {

    constructor() {
    }

    forEach(array: Array<any>, callback: Function, bulkSize: number = 1, doneCallback: Function = undefined) {
        let it = arrayIterator(array, callback, bulkSize, doneCallback, () => it.next());
        it.next();
    }

}
