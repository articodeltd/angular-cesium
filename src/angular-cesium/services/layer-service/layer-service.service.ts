import { EventEmitter, Injectable } from '@angular/core';
import { IDescription } from '../../models/description';
import { LayerOptions } from '../../models/layer-options';

@Injectable()
export class LayerService {
  private _context: any;
  private _options: LayerOptions;
  private _show: boolean;
  private _zIndex: number;
  private _entityName: string;
  private _cache = true;
  private descriptions: IDescription[] = [];
  private layerUpdate = new EventEmitter();

  get cache(): boolean {
    return this._cache;
  }

  set cache(value: boolean) {
    this._cache = value;
  }

  get zIndex(): number {
    return this._zIndex;
  }

  set zIndex(value: number) {
    if (value !== this._zIndex) {
      this.layerUpdate.emit();
    }
    this._zIndex = value;
  }

  get show(): boolean {
    return this._show;
  }

  set show(value: boolean) {
    if (value !== this._show) {
      this.layerUpdate.emit();
    }
    this._show = value;
  }

  get options(): LayerOptions {
    return this._options;
  }

  set options(value: LayerOptions) {
    this._options = value;
    this.layerUpdate.emit();
  }

  get context(): any {
    return this._context;
  }

  set context(context) {
    this._context = context;
    this.layerUpdate.emit();
  }

  setEntityName(name: string) {
    this._entityName = name;
  }

  getEntityName(): string {
    return this._entityName;
  }

  registerDescription(descriptionComponent: IDescription) {
    if (this.descriptions.indexOf(descriptionComponent) < 0) {
      this.descriptions.push(descriptionComponent);
    }
  }

  unregisterDescription(descriptionComponent: IDescription) {
    const index = this.descriptions.indexOf(descriptionComponent);
    if (index > -1) {
      this.descriptions.splice(index, 1);
    }
  }

  getDescriptions(): IDescription[] {
    return this.descriptions;
  }

  layerUpdates(): EventEmitter<any> {
    return this.layerUpdate;
  }
}
