import { Input, OnChanges, OnDestroy, OnInit, SimpleChanges, Directive } from '@angular/core';
import { BasicDrawerService } from '../drawers/basic-drawer/basic-drawer.service';
import { MapLayersService } from '../map-layers/map-layers.service';

/**
 *  Extend this class to create drawing on map components.
 */
@Directive()
export class EntityOnMapComponent implements OnInit, OnChanges, OnDestroy {
  @Input()
  props: any;

  protected selfPrimitive: any;
  protected selfPrimitiveIsDraw: boolean;
  protected dataSources: any;

  constructor(protected _drawer: BasicDrawerService, private mapLayers: MapLayersService) {
  }

  ngOnInit(): void {
    this.selfPrimitiveIsDraw = false;
    const dataSources = this._drawer.init();
    if (dataSources) {
      this.dataSources = dataSources;
      // this.mapLayers.registerLayerDataSources(dataSources, 0);
    }
    this.drawOnMap();
  }

  ngOnChanges(changes: SimpleChanges) {
    const props = changes['props'];
    if (props.currentValue !== props.previousValue) {
      this.updateOnMap();
    }
  }

  drawOnMap() {
    this.selfPrimitiveIsDraw = true;
    return this.selfPrimitive = this._drawer.add(this.props);
  }

  removeFromMap() {
    this.selfPrimitiveIsDraw = false;
    return this._drawer.remove(this.selfPrimitive);
  }

  updateOnMap() {
    if (this.selfPrimitiveIsDraw) {
      return this._drawer.update(this.selfPrimitive, this.props);
    }
  }

  ngOnDestroy(): void {
    this.mapLayers.removeDataSources(this.dataSources);
    this.removeFromMap();
  }
}
