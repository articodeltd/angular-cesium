import { Injectable } from '@angular/core';

@Injectable()
export class LayerContextService {

	private context: any;

	constructor() {
	}

	getContext() {
		return this.context;
	}

	setContext(value) {
		this.context = value;
	}

}
