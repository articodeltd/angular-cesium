import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { PrimitiveCollection, Cesium3DTileset, Cesium3DTileStyle } from 'cesium';
import { CesiumService } from '../../services/cesium/cesium.service';
import { Checker } from '../../utils/checker';

/**
 *  This component is used for adding a 3d tileset layer to the map (ac-map).
 *  options according to `Cesium3DTileset` definition.
 *  check out: https://cesiumjs.org/Cesium/Build/Documentation/Cesium3DTileset.html
 *
 *
 *  __Usage :__
 *  ```
 *    <ac-3d-tile-layer [options]="optionsObject">
 *    </ac-3d-tile-layer>
 *  ```
 */
@Component({
  selector: 'ac-3d-tile-layer',
  template: '',
})
export class AcTileset3dComponent implements OnInit, OnChanges, OnDestroy {
  /**
   * refer to cesium docs for details https://cesiumjs.org/Cesium/Build/Documentation/Cesium3DTileset.html
   */
  @Input()
  options: { url: any } = { url: null };

  /**
   * index (optional) - The index to add the layer at. If omitted, the layer will added on top of all existing layers.
   */
  @Input()
  index: Number;

  /**
   * show (optional) - Determines if the map layer is shown.
   */
  @Input()
  show = true;

  /**
   * show (optional) - Sets 3Dtiles style.
   */
  @Input()
  style: any;

  public tilesetInstance: any = null;
  private _3dtilesCollection: any;

  constructor(private cesiumService: CesiumService) {
  }

  ngOnInit() {
    if (!Checker.present(this.options.url)) {
      throw new Error('Options must have a url');
    }

    this._3dtilesCollection = new PrimitiveCollection();
    this.cesiumService.getScene().primitives.add(this._3dtilesCollection);

    if (this.show) {
      this.tilesetInstance = this._3dtilesCollection.add(new Cesium3DTileset(this.options), this.index);
      if (this.style) {
        this.tilesetInstance.style = new Cesium3DTileStyle(this.style);
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['show'] && !changes['show'].isFirstChange()) {
      const showValue = changes['show'].currentValue;

      if (showValue) {
        if (this.tilesetInstance) {
          this._3dtilesCollection.add(this.tilesetInstance, this.index);
        } else {
          this.tilesetInstance = this._3dtilesCollection.add(new Cesium3DTileset(this.options), this.index);
          if (this.style) {
            this.tilesetInstance.style = new Cesium3DTileStyle(this.style);
          }
        }
      } else if (this.tilesetInstance) {
        this._3dtilesCollection.remove(this.tilesetInstance, false);
      }
    }
    if (changes['style'] && !changes['style'].isFirstChange()) {
      const styleValue = changes['style'].currentValue;
      if (this.tilesetInstance) {
        this.tilesetInstance.style = new Cesium3DTileStyle(this.style);
      }
    }
  }

  ngOnDestroy(): void {
    if (this.tilesetInstance) {
      this._3dtilesCollection.remove(this.tilesetInstance, false);
    }
  }
}
