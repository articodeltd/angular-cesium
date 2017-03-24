import { OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { LayerService } from '../layer-service/layer-service.service';
import { SimpleDrawerService } from '../simple-drawer/simple-drawer.service';
import { ComputationCache } from '../computation-cache/computation-cache.service';
import { CesiumProperties } from '../cesium-properties/cesium-properties.service';
import { AcEntity } from '../../models/ac-entity';

/**
 *  the ancestor class for creating components.
 *  extend this class to create desc component.
 */
export class BasicDesc implements OnInit {
	@Input()
	props: any;

	@Input()
	isOnMap: boolean = false;

	private selfPrimitive: any;

	private selfPrimitiveIsDraw: boolean;

	protected _primitiveMap = new Map();

	private _propsEvaluateFn: Function;

	constructor(protected _drawer: SimpleDrawerService,
	            protected _layerService: LayerService,
	            protected _computationCache: ComputationCache,
	            protected _cesiumProperties: CesiumProperties) {
	}

	protected _propsEvaluator(context: Object): any {
		return this._propsEvaluateFn(this._computationCache, context);
	}

	ngOnInit(): void {
		if (this.isOnMap) {
			this.selfPrimitiveIsDraw = false;
			this.drawOnMap();
			return;
		}
		this._layerService.registerDescription(this);
		this._propsEvaluateFn = this._cesiumProperties.createEvaluator(this.props);
		this._drawer.setPropsAssigner(this._cesiumProperties.createAssigner(this.props));
	}

	ngOnChanges(changes: SimpleChanges) {
		const props = changes['props'];
		if (props.currentValue !== props.previousValue) {
			this.updateOnMap();
		}
	}

	draw(context: any, id: number, entity: AcEntity): any {
		const cesiumProps = this._propsEvaluator(context);
		if (!this._primitiveMap.has(id)) {
			const primitive = this._drawer.add(cesiumProps);
			primitive.acEntity = entity; // set the entity on the primitive for later usage
			this._primitiveMap.set(id, primitive);
		} else {
			const primitive = this._primitiveMap.get(id);
			this._drawer.update(primitive, cesiumProps);
		}
	}

	remove(id) {
		const primitive = this._primitiveMap.get(id);
		this._drawer.remove(primitive);
		this._primitiveMap.delete(id);
	}

	removeAll() {
		this._primitiveMap.clear();
		this._drawer.removeAll();
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
