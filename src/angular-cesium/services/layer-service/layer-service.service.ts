import { Injectable } from '@angular/core';
import { IDescription } from '../../models/description';

@Injectable()
export class LayerService {
	private _context: any;
	private _entityName: string;
	private descriptions: IDescription[] = [];

	getContext(): any {
		return this._context;
	}

	setContext(context) {
		this._context = context;
	}

	setEntityName(name: string) {
		this._entityName = name;
	}

	getEntityName(): string {
		return this._entityName;
	}

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
