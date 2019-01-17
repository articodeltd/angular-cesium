import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable()
export class WebSocketSupplier {
  private _socket = io.connect(environment.server);

  get(): any {
    return this._socket;
  }
}
