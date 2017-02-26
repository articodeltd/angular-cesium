/**
 * Angular2Cesium entity implementation.
 * @example
 * entity= AcEntity.create({
 *  	id: 0,
 *  	name: 'click me',
 *  	position: Cesium.Cartesian3.fromRadians(0.5, 0.5),
 * });
 */
export class AcEntity {
	static create(json?: any) {
		if (json) {
			return Object.assign(new AcEntity(), json);
		}
		return new AcEntity();
	}
}
