/**
 * Angular Cesium parent entity, all entities should inherit from it.
 * ```typescript
 * entity= new AcEntity({
 *  	id: 0,
 *  	name: 'click me',
 *  	position: Cartesian3.fromRadians(0.5, 0.5),
 * });
 * ```
 */
export declare class AcEntity {
    /**
     * Creates entity from a json
     * @param json entity object
     * @returns entity as AcEntity
     */
    static create(json?: any): any;
    /**
     * Creates entity from a json
     * @param json (Optional) entity object
     */
    constructor(json?: any);
}
