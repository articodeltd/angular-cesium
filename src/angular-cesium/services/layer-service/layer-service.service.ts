import { Injectable } from '@angular/core';

@Injectable()
export class LayerService {
	private descriptions: any[] = [];

	registerDescription(descriptionComponent: any) {
		this.descriptions.push(descriptionComponent);
	}

	getDescriptions(): any[] {
		return this.descriptions;
	}
}
