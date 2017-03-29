import { Injectable } from '@angular/core';

@Injectable()
export class LayerService {
	private _context: any;
	private _entityName: string;
	private _descriptions: any[] = [];

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
		this._descriptions.push(descriptionComponent);
	}

	getDescriptions(): any[] {
		return this._descriptions;
	}
}
