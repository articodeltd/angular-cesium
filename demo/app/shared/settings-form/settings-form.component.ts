import { Observable } from 'rxjs';
import 'rxjs/add/operator/catch';
import { MdSnackBar } from '@angular/material';
import { Http, Response } from '@angular/http';
import { Component, Output, EventEmitter } from '@angular/core';
import { AppSettingsService } from '../../services/app-settings-service/app-settings-service';
import { WebSocketSupplier } from '../../../utils/services/webSocketSupplier/webSocketSupplier';

@Component({
	selector: 'settings-form',
	templateUrl: 'settings-form.component.html',
	styleUrls: ['settings-form.component.css']
})
export class SettingsFormComponent {
	@Output() cleanMap = new EventEmitter();
	@Output() showEvent = new EventEmitter();

	constructor(private http: Http,
							public settingsService: AppSettingsService,
							private snackBar: MdSnackBar,
							webSocket: WebSocketSupplier
							) {
		webSocket.get().on('connect', () => {
			this.getServerSettings().subscribe((data) => {
				this.settingsService.numOfEntities = data.numOfEntities;
				this.settingsService.entitiesUpdateRate = data.interval;
			});
		});
	}

	private getServerSettings() {
		return this.http.get(`${process.env.SERVER}/data`).catch(this.handleError).map((res: Response) => {
				const body = res.json();
				return body || {};
			}
		);
	}

	applySettings() {
		this.http.post(`${process.env.SERVER}/change`,
			{
				rate: this.settingsService.entitiesUpdateRate,
				numOfEntities: this.settingsService.numOfEntities,
				sendOption: 'chunk'
			}).catch(this.handleError)
			.subscribe(() => {
				this.cleanMap.emit();
				this.snackBar.open(' Changed successfully','ok',{duration: 2000});
			});
	}


	private handleError(error: Response | any) {
		let errMsg: string;
		if (error instanceof Response) {
			const body = error.json() || '';
			const err = body.error || JSON.stringify(body);
			errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
		} else {
			errMsg = error.message ? error.message : error.toString();
		}
		console.log(`error connecting to the server: ${errMsg}`);
		return Observable.throw(errMsg);
	}
}
