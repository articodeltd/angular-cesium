import { ModuleWithProviders, NgModule } from '@angular/core';
import { ConfigurationService } from './ConfigurationService';
import { ModuleConfiguration } from '../models/module-options';

@NgModule()
export class CesiumEnhancementsModule {
  static forRoot(config?: ModuleConfiguration): ModuleWithProviders {
    return {
      ngModule: CesiumEnhancementsModule,
      providers: [ConfigurationService, {provide: 'config', useValue: config}]
    };
  }
}
