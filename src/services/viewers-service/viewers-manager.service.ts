import { Injectable } from '@angular/core';

@Injectable()
export class ViewersManagerService {
  
  private defaultIdCounter = 0;
  private _viewersMap = new Map<string, any>();
  
  constructor() {
  }
  
  getViewer(id: string) {
    return this._viewersMap.get(id);
  }
  
  setViewer(id: string, viewer: any) {
    const mapId = id ? id : this.generateDefaultId();
    this._viewersMap.set(mapId, viewer);
  }
  
  private generateDefaultId(): string {
    this.defaultIdCounter++;
    return 'default-map-id-' + this.defaultIdCounter;
  }
}
