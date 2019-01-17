import { EntitiesDrawerOptions } from './entities-drawer-options';

export interface LayerOptions {
  ellipse?: EntitiesDrawerOptions;
  circle?: EntitiesDrawerOptions;
  polygon?: EntitiesDrawerOptions;
  model?: EntitiesDrawerOptions;
  box?: EntitiesDrawerOptions;
  corridor?: EntitiesDrawerOptions;
  cylinder?: EntitiesDrawerOptions;
  ellipsoid?: EntitiesDrawerOptions;
  polylineVolume?: EntitiesDrawerOptions;
  rectangle?: EntitiesDrawerOptions;
  wall?: EntitiesDrawerOptions;
}
