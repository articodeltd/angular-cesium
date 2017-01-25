import { OnInit, Input } from "@angular/core";
import { LayerService } from "../layer-service/layer-service.service";
import { SimpleDrawerService } from "../simple-drawer/simple-drawer.service";
import { ComputationCache } from "../computation-cache/computation-cache.service";
import { CesiumProperties } from "../cesium-properties/cesium-properties.service";

export class BasicDesc implements OnInit {
	@Input()
	props: any;

	protected _primitiveMap = new Map();

	private _propsEvaluateFn: Function;

	constructor(protected _drawer: SimpleDrawerService,
	            protected _layerService: LayerService,
	            protected _computationCache: ComputationCache,
	            protected _cesiumProperties: CesiumProperties,) {
	}

	private _propsEvaluator(context: Object): any {
		return this._propsEvaluateFn(this._computationCache, context);
	}

	ngOnInit(): void {
		this._layerService.registerDescription(this);
		this._propsEvaluateFn = this._cesiumProperties.createEvaluator(this.props);
		this._drawer.setPropsAssigner(this._cesiumProperties.createAssigner(this.props));
	}

	draw(context, id): any {
		const cesiumProps = this._propsEvaluator(context);
		if (!this._primitiveMap.has(id)) {
			const primitive = this._drawer.add(cesiumProps);
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
}