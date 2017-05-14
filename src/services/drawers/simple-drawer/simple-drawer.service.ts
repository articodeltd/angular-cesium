import { CesiumService } from '../../cesium/cesium.service';

/**
 *  This is abstract drawer who provides some implementation for other drawers that extends it.
 */
export abstract class SimpleDrawerService {
	protected _showAll = true;

	private _cesiumCollection: any;
	private _propsAssigner: Function;

	constructor(drawerType: any, cesiumService: CesiumService) {
		this._cesiumCollection = new drawerType();
		cesiumService.getScene().primitives.add(this._cesiumCollection);
	}

	setPropsAssigner(assigner: Function) {
		this._propsAssigner = assigner;
	}

	add(cesiumProps: any, ...moreProps): any {
		// Todo: Take care of show = false
		if (!this._showAll) {
			cesiumProps.show = this._showAll;
		}
		return this._cesiumCollection.add(cesiumProps);
	}

	update(primitive: any, cesiumProps: any, ...moreProps) {
		if (!this._showAll) {
			cesiumProps.show = this._showAll;
		}
		if (this._propsAssigner) {
			this._propsAssigner(primitive, cesiumProps);
		}
		else {
			Object.assign(primitive, cesiumProps);
		}
	}

	remove(primitive: any) {
		this._cesiumCollection.remove(primitive);
	}

	removeAll() {
		this._cesiumCollection.removeAll();
	}

	setShow(showValue: boolean) {
		this._showAll = showValue;
		for (let i = 0; i < this._cesiumCollection.length; i++) {
			const primitive = this._cesiumCollection.get(i);
			primitive.show = showValue;
		}
	}
}
