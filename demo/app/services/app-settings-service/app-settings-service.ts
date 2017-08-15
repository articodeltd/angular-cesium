export class AppSettingsService {
  get settings(): { numberOfEntities: number; entitiesUpdateRate: number; showTracksLayer: boolean; showMapLayer: boolean; realTracksData: boolean; showVelocityVectors: boolean; showEllipses: boolean } {
    return this._settings;
  }

  set settings(value: { numberOfEntities: number; entitiesUpdateRate: number; showTracksLayer: boolean; showMapLayer: boolean; realTracksData: boolean; showVelocityVectors: boolean; showEllipses: boolean }) {
    this._settings = value;
  }

  private _settings = {
    numberOfEntities: 0,
    entitiesUpdateRate: 0,
    showTracksLayer: true,
    showMapLayer: true,
    realTracksData: false,
    showVelocityVectors: false,
    showEllipses: false
  };

  setSettings(settings) {
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

  get realTracksData(): boolean {
    return this._settings.realTracksData;
  }

  set realTracksData(value: boolean) {
    this._settings.realTracksData = value;
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
}
