import { Injectable } from '@angular/core';

interface AppSettings {
  show3dtiles: boolean;
  numberOfEntities: number;
  entitiesUpdateRate: number;
  showTracksLayer: boolean;
  showMapLayer: boolean;
  showVelocityVectors: boolean;
  showEllipses: boolean;
  keyboardControl: boolean;
  tracksDataType: TracksType;

}

export enum TracksType {
  REAL_DATA,
  SIM_DATA,
  MODELS_3D,
}

@Injectable()
export class AppSettingsService {
  get settings(): AppSettings {
    return this._settings;
  }

  set settings(value: AppSettings) {
    this._settings = value;
  }

  private _settings: AppSettings = {
    numberOfEntities: 0,
    entitiesUpdateRate: 0,
    showTracksLayer: true,
    showMapLayer: true,
    showVelocityVectors: false,
    showEllipses: false,
    show3dtiles: false,
    keyboardControl: false,
    tracksDataType: TracksType.MODELS_3D,
  };

  setSettings(settings: AppSettings) {
    Object.assign(this._settings, settings);
  }

  get showMapLayer(): boolean {
    return this._settings.showMapLayer;
  }

  get showVelocityVectors(): boolean {
    return this._settings.showVelocityVectors;
  }

  set showVelocityVectors(value: boolean) {
    this._settings.showVelocityVectors = value;
  }

  get showEllipses(): boolean {
    return this._settings.showEllipses;
  }

  set showEllipses(value: boolean) {
    this._settings.showEllipses = value;
  }

  set showMapLayer(value: boolean) {
    this._settings.showMapLayer = value;
  }

  get tracksDataType(): TracksType {
    return this._settings.tracksDataType;
  }

  set tracksDataType(value: TracksType) {
    this._settings.tracksDataType = value;
  }

  get showTracksLayer(): boolean {
    return this._settings.showTracksLayer;
  }

  set showTracksLayer(value: boolean) {
    this._settings.showTracksLayer = value;
  }

  get entitiesUpdateRate(): number {
    return this._settings.entitiesUpdateRate;
  }

  set entitiesUpdateRate(value: number) {
    this._settings.entitiesUpdateRate = value;
  }

  get numOfEntities(): number {
    return this._settings.numberOfEntities;
  }

  set numOfEntities(value: number) {
    this._settings.numberOfEntities = value;
  }

  get show3dtiles() {
    return this._settings.show3dtiles;
  }

  set show3dtiles(value: boolean) {
    this._settings.show3dtiles = value;
  }

  get keyboardControl() {
    return this._settings.keyboardControl;
  }

  set keyboardControl(value: boolean) {
    this._settings.keyboardControl = value;
  }
}
