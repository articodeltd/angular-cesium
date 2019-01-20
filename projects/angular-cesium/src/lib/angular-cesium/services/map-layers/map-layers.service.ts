import { CesiumService } from '../cesium/cesium.service';
import { Injectable } from '@angular/core';

@Injectable()
export class MapLayersService {

  private layersDataSources: any[] = [];

  constructor(private cesiumService: CesiumService) {

  }

  registerLayerDataSources(dataSources: any[], zIndex: number) {
    dataSources.forEach(ds => {
      ds.zIndex = zIndex;
      this.layersDataSources.push(ds);
    });
  }

  drawAllLayers() {
    this.layersDataSources.sort((a, b) => a.zIndex - b.zIndex);

    this.layersDataSources.forEach((dataSource) => {
      this.cesiumService.getViewer().dataSources.add(dataSource);
    });
  }

  updateAndRefresh(dataSources: any[], newZIndex: number) {
    if (dataSources && dataSources.length) {
      dataSources.forEach((ds) => {
        const index = this.layersDataSources.indexOf(ds);
        if (index !== -1) {
          this.layersDataSources[index].zIndex = newZIndex;
        }
      });

      this.cesiumService.getViewer().dataSources.removeAll();
      this.drawAllLayers();
    }
  }

  removeDataSources(dataSources: any[]) {
    dataSources.forEach(ds => {
      const index = this.layersDataSources.indexOf(ds);
      if (index !== -1) {
        this.layersDataSources.splice(index, 1);
        this.cesiumService.getViewer().dataSources.remove(ds, true);
      }
    });
  }
}
