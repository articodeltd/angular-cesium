import { Input } from '@angular/core';

import { BasicDesc } from '../basic-desc/basic-desc.service';
import { LayerService } from '../layer-service/layer-service.service';
import { ComputationCache } from '../computation-cache/computation-cache.service';
import { CesiumProperties } from '../cesium-properties/cesium-properties.service';
import { StaticPrimitiveDrawer } from '../static-primitive-drawer/static-primitive-drawer.service';

export class BasicStaticPrimitiveDesc extends BasicDesc {
	@Input()
	geometryProps: any;
	@Input()
	instanceProps: any;
	@Input()
	primitiveProps: any;

	private _geometryPropsFn: Function;
	private _instancePropsFn: Function;
	private _primitivePropsFn: Function;

	constructor(protected _staticPrimitiveDrawer: StaticPrimitiveDrawer, layerService: LayerService,
	            computationCache: ComputationCache, cesiumProperties: CesiumProperties) {
		super(_staticPrimitiveDrawer, layerService, computationCache, cesiumProperties);
	}

	ngOnInit(): void {
		this._layerService.registerDescription(this);
		this._geometryPropsFn = this._cesiumProperties.createEvaluator(this.geometryProps);
		this._instancePropsFn = this._cesiumProperties.createEvaluator(this.instanceProps);
		this._primitivePropsFn = this._cesiumProperties.createEvaluator(this.primitiveProps);
	}

	draw(context, id): any {
		const geometryProps = this._specificPropsEvaluator(context, this._geometryPropsFn);
		const instanceProps = this._specificPropsEvaluator(context, this._instancePropsFn);
		const primitiveProps = this._specificPropsEvaluator(context, this._primitivePropsFn);

		if (!this._primitiveMap.has(id)) {
			const primitive = this._staticPrimitiveDrawer.add(geometryProps, instanceProps, primitiveProps);

			this._primitiveMap.set(id, primitive);
		} else {
			const primitive = this._primitiveMap.get(id);
			this._staticPrimitiveDrawer.update(primitive, geometryProps, instanceProps, primitiveProps);
		}
		else {
			const primitive = this._primitiveMap.get(id);
			this._staticPrimitiveDrawer.update(primitive, geometryProps, instanceProps, primitiveProps);
		}
	}

	private _specificPropsEvaluator(context: Object, propFn: Function) {
		return propFn(this._computationCache, context);
	}
}
