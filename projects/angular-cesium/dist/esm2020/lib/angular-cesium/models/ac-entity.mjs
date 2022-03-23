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
export class AcEntity {
    /**
     * Creates entity from a json
     * @param json entity object
     * @returns entity as AcEntity
     */
    static create(json) {
        if (json) {
            return Object.assign(new AcEntity(), json);
        }
        return new AcEntity();
    }
    /**
     * Creates entity from a json
     * @param json (Optional) entity object
     */
    constructor(json) {
        Object.assign(this, json);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtZW50aXR5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2xpYi9hbmd1bGFyLWNlc2l1bS9tb2RlbHMvYWMtZW50aXR5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7R0FTRztBQUNILE1BQU0sT0FBTyxRQUFRO0lBRW5COzs7O09BSUc7SUFDSCxNQUFNLENBQUMsTUFBTSxDQUFDLElBQVU7UUFDdEIsSUFBSSxJQUFJLEVBQUU7WUFDUixPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxRQUFRLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztTQUM1QztRQUNELE9BQU8sSUFBSSxRQUFRLEVBQUUsQ0FBQztJQUN4QixDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsWUFBWSxJQUFVO1FBQ3BCLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQzVCLENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBBbmd1bGFyIENlc2l1bSBwYXJlbnQgZW50aXR5LCBhbGwgZW50aXRpZXMgc2hvdWxkIGluaGVyaXQgZnJvbSBpdC5cclxuICogYGBgdHlwZXNjcmlwdFxyXG4gKiBlbnRpdHk9IG5ldyBBY0VudGl0eSh7XHJcbiAqICBcdGlkOiAwLFxyXG4gKiAgXHRuYW1lOiAnY2xpY2sgbWUnLFxyXG4gKiAgXHRwb3NpdGlvbjogQ2FydGVzaWFuMy5mcm9tUmFkaWFucygwLjUsIDAuNSksXHJcbiAqIH0pO1xyXG4gKiBgYGBcclxuICovXHJcbmV4cG9ydCBjbGFzcyBBY0VudGl0eSB7XHJcblxyXG4gIC8qKlxyXG4gICAqIENyZWF0ZXMgZW50aXR5IGZyb20gYSBqc29uXHJcbiAgICogQHBhcmFtIGpzb24gZW50aXR5IG9iamVjdFxyXG4gICAqIEByZXR1cm5zIGVudGl0eSBhcyBBY0VudGl0eVxyXG4gICAqL1xyXG4gIHN0YXRpYyBjcmVhdGUoanNvbj86IGFueSkge1xyXG4gICAgaWYgKGpzb24pIHtcclxuICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24obmV3IEFjRW50aXR5KCksIGpzb24pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG5ldyBBY0VudGl0eSgpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ3JlYXRlcyBlbnRpdHkgZnJvbSBhIGpzb25cclxuICAgKiBAcGFyYW0ganNvbiAoT3B0aW9uYWwpIGVudGl0eSBvYmplY3RcclxuICAgKi9cclxuICBjb25zdHJ1Y3Rvcihqc29uPzogYW55KSB7XHJcbiAgICBPYmplY3QuYXNzaWduKHRoaXMsIGpzb24pO1xyXG4gIH1cclxufVxyXG4iXX0=