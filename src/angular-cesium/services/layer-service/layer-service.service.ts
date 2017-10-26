import { Injectable } from '@angular/core';

@Injectable()
export class LayerService {
	private _context: any;
	private _entityName: string;
	private descriptions: any[] = [];

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
