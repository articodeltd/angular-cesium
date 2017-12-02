import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ActionType } from '../../../../src/angular-cesium/models/action-type.enum';
import { convertToCesiumObj } from '../dataCovertor/convertToCesiumObject';
import { WebSocketSupplier } from '../webSocketSupplier/webSocketSupplier';
import { Subscriber } from 'rxjs/Subscriber';

@Injectable()
export class TracksDataProvider {
	private _socket: SocketIO.Socket;

	constructor(webSocketSupplier: WebSocketSupplier) {
		this._socket = webSocketSupplier.get();
	}

	get() {
		return Observable.create((observer: Subscriber<any>) => {
			this._socket.on('birds', (data: any) => {
				data.forEach(
					(acNotification: any) => {
						let action;
						if (acNotification.action === 'ADD_OR_UPDATE') {
							action = ActionType.ADD_UPDATE;
						}
						else if (acNotification.action === 'DELETE') {
							action = ActionType.DELETE;
						}
						acNotification.actionType = action;
						acNotification.entity = convertToCesiumObj(acNotification.entity);
						observer.next(acNotification);
					});
			});
		});
	}
}
