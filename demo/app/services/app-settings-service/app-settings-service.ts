export class AppSettingsService {

	private settings = {
		numberOfEntities: 0,
		entitiesUpdateRate: 0,
		showTracksLayer: true,
		showMapLayer: true,
		realTracksData: false,
		showVelocityVectors: false,
	};

	setSettings(settings) {
		Object.assign(this.settings, settings);
	}

	get showMapLayer(): boolean {
		return this.settings.showMapLayer;
	}

	get showVelocityVectors(): boolean {
		return this.settings.showVelocityVectors;
	}

	set showVelocityVectors(value: boolean) {
		this.settings.showVelocityVectors = value;
	}

	set showMapLayer(value: boolean) {
		this.settings.showMapLayer = value;
	}

	get realTracksData(): boolean {
		return this.settings.realTracksData;
	}

	set realTracksData(value: boolean) {
		this.settings.realTracksData = value;
	}

	get showTracksLayer(): boolean {
		return this.settings.showTracksLayer;
	}

	set showTracksLayer(value: boolean) {
		this.settings.showTracksLayer = value;
	}

	get entitiesUpdateRate(): number {
		return this.settings.entitiesUpdateRate;
	}

	set entitiesUpdateRate(value: number) {
		this.settings.entitiesUpdateRate = value;
	}

	get numOfEntities(): number {
		return this.settings.numberOfEntities;
	}

	set numOfEntities(value: number) {
		this.settings.numberOfEntities = value;
	}
}
