import { Injectable } from '@angular/core';

@Injectable()
export class LayerService {
	private descriptions: any[] = [];

	registerDescription(descriptionComponent: any) {
		this.descriptions.push(descriptionComponent);
	}

	unregisterDescription(descriptionComponent: any) {
		const index = this.descriptions.indexOf(descriptionComponent);
		if (index > -1) {
			this.descriptions.splice(index, 1);
		}
	}

	getDescriptions(): any[] {
		return this.descriptions;
	}
}
