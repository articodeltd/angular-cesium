export class WebSocketSupplier {
	private _socket = io();

	get(): any {
		return this._socket;
	}
}
