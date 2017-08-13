import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ActionType } from '../../../../src/models/action-type.enum';
import { convertToCesiumObj } from '../dataCovertor/convertToCesiumObject';
import { WebSocketSupplier } from '../webSocketSupplier/webSocketSupplier';

@Injectable()
export class TracksDataProvider {
	private _socket;

	constructor(webSocketSupplier: WebSocketSupplier) {
		this._socket = webSocketSupplier.get();
	}

	get() {
		return Observable.create((observer) => {
			this._socket.on('birds', (data) => {
				data.forEach(
					(acNotification) => {
						observer.next(acNotification);
					});
			});
		});
	}
}