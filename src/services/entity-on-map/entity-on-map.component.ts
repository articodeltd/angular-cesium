import { Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { BasicDrawerService } from '../drawers/basic-drawer/basic-drawer.service';

/**
 *  Extend this class to create drawing on map components.
 */
export class EntityOnMapComponent implements OnInit, OnChanges, OnDestroy {
  @Input()
  props: any;

  protected selfPrimitive: any;

  protected selfPrimitiveIsDraw: boolean;

  constructor(protected _drawer: BasicDrawerService) {
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
    this.removeFromMap();
  }
}
