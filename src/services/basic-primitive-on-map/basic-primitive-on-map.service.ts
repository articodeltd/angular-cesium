import { OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { SimpleDrawerService } from '../simple-drawer/simple-drawer.service';

/**
 *  the ancestor class for creating components.
 *  extend this class to create desc component.
 */
export class BasicPrimitiveOnMap implements OnInit, OnChanges {
	@Input()
	props: any;

	private selfPrimitive: any;

	private selfPrimitiveIsDraw: boolean;

	constructor(protected _drawer: SimpleDrawerService) {
	}

	ngOnInit(): void {
		this.selfPrimitiveIsDraw = false;
		this.drawOnMap();
	}

	ngOnChanges(changes: SimpleChanges) {
		const props = changes['props'];
		if (props.currentValue !== props.previousValue) {
			this.updateOnMap();
		}
	}

	drawOnMap() {
		this.selfPrimitiveIsDraw =true;
		return this.selfPrimitive = this._drawer.add(this.props);
	}

	removeFromMap() {
		this.selfPrimitiveIsDraw = false;
		return this._drawer.remove(this.selfPrimitive);
	}

	updateOnMap() {
		if (this.selfPrimitiveIsDraw) {
			this.removeFromMap();
			this.drawOnMap();
		}
	}
}
