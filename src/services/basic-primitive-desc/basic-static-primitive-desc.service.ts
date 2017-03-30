import {Input, OnInit} from '@angular/core';
import { BasicDesc } from '../basic-desc/basic-desc.service';
import { LayerService } from '../layer-service/layer-service.service';
import { ComputationCache } from '../computation-cache/computation-cache.service';
import { CesiumProperties } from '../cesium-properties/cesium-properties.service';
import { StaticPrimitiveDrawer } from '../drawers/static-primitive-drawer/static-primitive-drawer.service';
import { AcEntity } from '../../models/ac-entity';

export class BasicStaticPrimitiveDesc extends BasicDesc implements OnInit {
	@Input()
	geometryProps: any;
	@Input()
	instanceProps: any;
	@Input()
	primitiveProps: any;

	private _geometryPropsEvaluator: Function;
	private _instancePropsEvaluator: Function;
	private _primitivePropsEvaluator: Function;

	constructor(protected _staticPrimitiveDrawer: StaticPrimitiveDrawer, layerService: LayerService,
	            computationCache: ComputationCache, cesiumProperties: CesiumProperties) {
		super(_staticPrimitiveDrawer, layerService, computationCache, cesiumProperties);
	}

	ngOnInit(): void {
		this._layerService.registerDescription(this);

		this._geometryPropsEvaluator = this._cesiumProperties.createEvaluator(this.geometryProps);
		this._instancePropsEvaluator = this._cesiumProperties.createEvaluator(this.instanceProps);
		this._primitivePropsEvaluator = this._cesiumProperties.createEvaluator(this.primitiveProps);
	}

	draw(context, id, entity: AcEntity): any {
		const geometryProps = this._geometryPropsEvaluator(this._computationCache, context);
		const instanceProps = this._instancePropsEvaluator(this._computationCache, context);
		const primitiveProps = this._primitivePropsEvaluator(this._computationCache, context);

		if (!this._primitiveMap.has(id)) {
			const primitive = this._staticPrimitiveDrawer.add(geometryProps, instanceProps, primitiveProps);
			primitive.acEntity = entity; // set the entity on the primitive for later usage
			this._primitiveMap.set(id, primitive);
		} else {
			const primitive = this._primitiveMap.get(id);
			this._staticPrimitiveDrawer.update(primitive, geometryProps, instanceProps, primitiveProps);
		}
	}
}
