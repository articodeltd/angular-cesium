/**
 * Angular Cesium parent entity, all entities should inherit from it.
 * ```typescript
 * entity= AcEntity.create({
 *  	id: 0,
 *  	name: 'click me',
 *  	position: Cesium.Cartesian3.fromRadians(0.5, 0.5),
 * });
 * ```
 */
export class AcEntity {

	/**
	 * Creates entity from a json
	 * @param json
	 * @returns {AcEntity} entity
	 */
	static create(json?: any) {
		if (json) {
			return Object.assign(new AcEntity(), json);
		}
		return new AcEntity();
	}
}
