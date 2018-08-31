import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { fixCesiumEntitiesShadows } from './StaticGeometryColorBatch';

export const ANGULAR_CESIUM_CONFIG = new InjectionToken('ANGULAR_CESIUM_CONFIG');

@Injectable()
export class ConfigurationService {
  constructor(@Optional() @Inject(ANGULAR_CESIUM_CONFIG) private config: any) {
    const fixEntitiesShadows = config ? config.fixEntitiesShadows : true;
    if (fixEntitiesShadows !== false) {
      fixCesiumEntitiesShadows();
    }
  }
}
