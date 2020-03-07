import { Input, OnInit, Directive } from '@angular/core';
import { BasicDesc } from '../basic-desc/basic-desc.service';
import { LayerService } from '../layer-service/layer-service.service';
import { ComputationCache } from '../computation-cache/computation-cache.service';
import { CesiumProperties } from '../cesium-properties/cesium-properties.service';
import { StaticPrimitiveDrawer } from '../drawers/static-dynamic/static-primitive-drawer/static-primitive-drawer.service';
import { AcEntity } from '../../models/ac-entity';

@Directive()
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

  draw(context: any, id: string, entity: AcEntity): any {
    const geometryProps = this._geometryPropsEvaluator(this._computationCache, context);
    const instanceProps = this._instancePropsEvaluator(this._computationCache, context);
    const primitiveProps = this._primitivePropsEvaluator(this._computationCache, context);

    if (!this._cesiumObjectsMap.has(id)) {
      const primitive = this._staticPrimitiveDrawer.add(geometryProps, instanceProps, primitiveProps);
      primitive.acEntity = entity; // set the entity on the primitive for later usage
      this._cesiumObjectsMap.set(id, primitive);
    } else {
      const primitive = this._cesiumObjectsMap.get(id);
      this._staticPrimitiveDrawer.update(primitive, geometryProps, instanceProps, primitiveProps);
    }
  }
}
