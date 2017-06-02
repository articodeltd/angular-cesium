import { OnInit, Input, OnDestroy } from '@angular/core';
import { LayerService } from '../layer-service/layer-service.service';
import { SimpleDrawerService } from '../drawers/simple-drawer/simple-drawer.service';
import { ComputationCache } from '../computation-cache/computation-cache.service';
import { CesiumProperties } from '../cesium-properties/cesium-properties.service';
import { AcEntity } from '../../models/ac-entity';

/**
 *  the ancestor class for creating components.
 *  extend this class to create desc component.
 */
export class BasicDesc implements OnInit, OnDestroy {
	@Input()
	props: any;

	protected _primitiveMap = new Map();
	private _propsEvaluateFn: Function;
	private _propsAssignerFn: Function;

	constructor(protected _drawer: SimpleDrawerService,
	            protected _layerService: LayerService,
	            protected _computationCache: ComputationCache,
	            protected _cesiumProperties: CesiumProperties) {
	}

	protected _propsEvaluator(context: Object): any {
		return this._propsEvaluateFn(this._computationCache, context);
	}

	protected _getPropsAssigner(): (primitive: Object, desc: Object) => Object {
		return (primitive: Object, desc: Object) => this._propsAssignerFn(primitive, desc);
	}

	ngOnInit(): void {
		this._layerService.registerDescription(this);
		this._propsEvaluateFn = this._cesiumProperties.createEvaluator(this.props);
		this._propsAssignerFn = this._cesiumProperties.createAssigner(this.props);
	}

	draw(context: any, id: number, entity: AcEntity): any {
		const cesiumProps = this._propsEvaluator(context);
		if (!this._primitiveMap.has(id)) {
			const primitive = this._drawer.add(cesiumProps);
			primitive.acEntity = entity; // set the entity on the primitive for later usage
			this._primitiveMap.set(id, primitive);
		} else {
			const primitive = this._primitiveMap.get(id);
      		primitive.acEntity = entity; // set the entity on the primitive for later usage
			this._drawer.setPropsAssigner(this._getPropsAssigner());
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

	ngOnDestroy() {
		this._layerService.unregisterDescription(this);
		this.removeAll();
	}
}
