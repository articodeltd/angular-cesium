/**
 * The interface defines the options object that can be passed to AngularCesiumModule on initialization.
 */
import { PipesConfig } from '@auscope/angular2parse';

export interface ModuleConfiguration {
  fixEntitiesShadows?: boolean;
  customPipes: PipesConfig[];
}
