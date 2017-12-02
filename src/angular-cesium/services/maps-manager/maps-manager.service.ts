import { Injectable } from '@angular/core';
import { AcMapComponent } from '../../components/ac-map/ac-map.component';

/**
 *  The service manages `ac-map` instances. `ac-map` register itself to this service.
 *  This allows retrieval of maps provided services outside of `ac-map` scope.
 */
@Injectable()
export class MapsManagerService {

  private defaultIdCounter = 0;
  private _Maps = new Map<string, AcMapComponent>();
  private firstMap: any;

  constructor() {
  }

  getMap(id?: string): AcMapComponent {
    if (!id) {
      return this.firstMap;
    }
    return this._Maps.get(id);
  }

  registerMap(id: string, acMap: AcMapComponent) {
    if (!this.firstMap) {
      this.firstMap = acMap
    }
    const mapId = id ? id : this.generateDefaultId();
    this._Maps.set(mapId, acMap);
  }

  private generateDefaultId(): string {
    this.defaultIdCounter++;
    return 'default-map-id-' + this.defaultIdCounter;
  }
}
