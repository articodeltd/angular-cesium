import { Inject, Injectable } from '@angular/core';
import { fixCesiumEntitiesShadows } from './StaticGeometryColorBatch';

@Injectable()
export class ConfigurationService {
  constructor(@Inject('config') private config: any) {
    const fixEntitiesShadows = config ? config.fixEntitiesShadows : true;
    if (fixEntitiesShadows !== false) {
      fixCesiumEntitiesShadows();
    }
  }
}
