import { Injectable } from '@angular/core';
import { CzmlDataSource } from 'cesium';
import { CesiumService } from '../../cesium/cesium.service';
import { BasicDrawerService } from '../basic-drawer/basic-drawer.service';
import { EntitiesDrawerOptions } from '../../../models/entities-drawer-options';

/**
 *  This drawer is responsible for drawing czml dataSources.
 */
@Injectable()
export class CzmlDrawerService extends BasicDrawerService {

  czmlStream: any;

  constructor(
    private cesiumService: CesiumService,
  ) {
    super();
  }


  init(options?: EntitiesDrawerOptions) {
    const dataSources = [];

    this.czmlStream = new CzmlDataSource('czml');

    dataSources.push(this.czmlStream);

    this.cesiumService.getViewer().dataSources.add(this.czmlStream);

    return dataSources;
  }

  // returns the packet, provided by the stream
  add(cesiumProps: any): any {

    this.czmlStream.process(cesiumProps.czmlPacket);

    return cesiumProps;
  }

  update(entity: any, cesiumProps: any) {
    this.czmlStream.process(cesiumProps.czmlPacket);
  }

  remove(entity: any) {
    this.czmlStream.entities.removeById(entity.acEntity.id);
  }

  removeAll() {
    this.czmlStream.entities.removeAll();
  }

  setShow(showValue: boolean) {
    this.czmlStream.entities.show = showValue;
  }

}


