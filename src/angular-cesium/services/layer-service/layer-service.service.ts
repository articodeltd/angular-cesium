import { Injectable } from '@angular/core';
import { IDescription } from '../../models/description';

@Injectable()
export class LayerService {
	private descriptions: IDescription[] = [];

	registerDescription(descriptionComponent: IDescription) {
		this.descriptions.push(descriptionComponent);
	}

	unregisterDescription(descriptionComponent: IDescription) {
		const index = this.descriptions.indexOf(descriptionComponent);
		if (index > -1) {
			this.descriptions.splice(index, 1);
		}
	}

	getDescriptions(): IDescription[] {
		return this.descriptions;
	}
}
