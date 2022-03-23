import { Component, Input } from '@angular/core';
import { EntityOnMapComponent } from '../../services/entity-on-map/entity-on-map.component';
import * as i0 from "@angular/core";
import * as i1 from "../../services/drawers/arc-drawer/arc-drawer.service";
import * as i2 from "../../services/map-layers/map-layers.service";
/**
 *  This is an implementation of an arc.
 *  The element must be a child of ac-map element.
 *  An arc is not natively implemented in cesium.
 *
 *  __Usage :__
 *  ```
 *    <ac-arc-desc geometryProps="{
 *          center: arc.center,
 *          angle: arc.angle,
 *          delta: arc.delta,
 *          radius: arc.radius
 *       }"
 *       instanceProps="{
 *          attributes: arc.attributes
 *       }"
 *       primitiveProps="{
 *          appearance: arc.appearance
 *       }">
 *    </ac-arc-desc>
 *    ```
 */
export class AcArcComponent extends EntityOnMapComponent {
    constructor(arcDrawer, mapLayers) {
        super(arcDrawer, mapLayers);
    }
    updateOnMap() {
        if (this.selfPrimitiveIsDraw) {
            this.removeFromMap();
            this.drawOnMap();
        }
    }
    drawOnMap() {
        this.selfPrimitiveIsDraw = true;
        return this.selfPrimitive = this._drawer.add(this.geometryProps, this.instanceProps, this.primitiveProps);
    }
    ngOnChanges(changes) {
        const geometryProps = changes['geometryProps'];
        const instanceProps = changes['instanceProps'];
        const primitiveProps = changes['primitiveProps'];
        if (geometryProps.currentValue !== geometryProps.previousValue ||
            instanceProps.currentValue !== instanceProps.previousValue ||
            primitiveProps.currentValue !== primitiveProps.previousValue) {
            this.updateOnMap();
        }
    }
}
AcArcComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcArcComponent, deps: [{ token: i1.ArcDrawerService }, { token: i2.MapLayersService }], target: i0.ɵɵFactoryTarget.Component });
AcArcComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: AcArcComponent, selector: "ac-arc", inputs: { geometryProps: "geometryProps", instanceProps: "instanceProps", primitiveProps: "primitiveProps" }, usesInheritance: true, usesOnChanges: true, ngImport: i0, template: '', isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcArcComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ac-arc',
                    template: '',
                }]
        }], ctorParameters: function () { return [{ type: i1.ArcDrawerService }, { type: i2.MapLayersService }]; }, propDecorators: { geometryProps: [{
                type: Input
            }], instanceProps: [{
                type: Input
            }], primitiveProps: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtYXJjLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9saWIvYW5ndWxhci1jZXNpdW0vY29tcG9uZW50cy9hYy1hcmMvYWMtYXJjLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBNEIsTUFBTSxlQUFlLENBQUM7QUFDM0UsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sc0RBQXNELENBQUM7Ozs7QUFJNUY7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXFCRztBQU1ILE1BQU0sT0FBTyxjQUFlLFNBQVEsb0JBQW9CO0lBU3RELFlBQVksU0FBMkIsRUFBRSxTQUEyQjtRQUNsRSxLQUFLLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFFRCxXQUFXO1FBQ1QsSUFBSSxJQUFJLENBQUMsbUJBQW1CLEVBQUU7WUFDNUIsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1lBQ3JCLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztTQUNsQjtJQUNILENBQUM7SUFFRCxTQUFTO1FBQ1AsSUFBSSxDQUFDLG1CQUFtQixHQUFHLElBQUksQ0FBQztRQUNoQyxPQUFPLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUM1RyxDQUFDO0lBRUQsV0FBVyxDQUFDLE9BQXNCO1FBQ2hDLE1BQU0sYUFBYSxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUMvQyxNQUFNLGFBQWEsR0FBRyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDL0MsTUFBTSxjQUFjLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFDakQsSUFBSSxhQUFhLENBQUMsWUFBWSxLQUFLLGFBQWEsQ0FBQyxhQUFhO1lBQzVELGFBQWEsQ0FBQyxZQUFZLEtBQUssYUFBYSxDQUFDLGFBQWE7WUFDMUQsY0FBYyxDQUFDLFlBQVksS0FBSyxjQUFjLENBQUMsYUFBYSxFQUFFO1lBQzlELElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztTQUNwQjtJQUNILENBQUM7OzJHQWxDVSxjQUFjOytGQUFkLGNBQWMsd01BRmYsRUFBRTsyRkFFRCxjQUFjO2tCQUoxQixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxRQUFRO29CQUNsQixRQUFRLEVBQUUsRUFBRTtpQkFDYjtzSUFJQyxhQUFhO3NCQURaLEtBQUs7Z0JBR04sYUFBYTtzQkFEWixLQUFLO2dCQUdOLGNBQWM7c0JBRGIsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQsIE9uQ2hhbmdlcywgU2ltcGxlQ2hhbmdlcyB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBFbnRpdHlPbk1hcENvbXBvbmVudCB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2VudGl0eS1vbi1tYXAvZW50aXR5LW9uLW1hcC5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBBcmNEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9hcmMtZHJhd2VyL2FyYy1kcmF3ZXIuc2VydmljZSc7XHJcbmltcG9ydCB7IE1hcExheWVyc1NlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9tYXAtbGF5ZXJzL21hcC1sYXllcnMuc2VydmljZSc7XHJcblxyXG4vKipcclxuICogIFRoaXMgaXMgYW4gaW1wbGVtZW50YXRpb24gb2YgYW4gYXJjLlxyXG4gKiAgVGhlIGVsZW1lbnQgbXVzdCBiZSBhIGNoaWxkIG9mIGFjLW1hcCBlbGVtZW50LlxyXG4gKiAgQW4gYXJjIGlzIG5vdCBuYXRpdmVseSBpbXBsZW1lbnRlZCBpbiBjZXNpdW0uXHJcbiAqXHJcbiAqICBfX1VzYWdlIDpfX1xyXG4gKiAgYGBgXHJcbiAqICAgIDxhYy1hcmMtZGVzYyBnZW9tZXRyeVByb3BzPVwie1xyXG4gKiAgICAgICAgICBjZW50ZXI6IGFyYy5jZW50ZXIsXHJcbiAqICAgICAgICAgIGFuZ2xlOiBhcmMuYW5nbGUsXHJcbiAqICAgICAgICAgIGRlbHRhOiBhcmMuZGVsdGEsXHJcbiAqICAgICAgICAgIHJhZGl1czogYXJjLnJhZGl1c1xyXG4gKiAgICAgICB9XCJcclxuICogICAgICAgaW5zdGFuY2VQcm9wcz1cIntcclxuICogICAgICAgICAgYXR0cmlidXRlczogYXJjLmF0dHJpYnV0ZXNcclxuICogICAgICAgfVwiXHJcbiAqICAgICAgIHByaW1pdGl2ZVByb3BzPVwie1xyXG4gKiAgICAgICAgICBhcHBlYXJhbmNlOiBhcmMuYXBwZWFyYW5jZVxyXG4gKiAgICAgICB9XCI+XHJcbiAqICAgIDwvYWMtYXJjLWRlc2M+XHJcbiAqICAgIGBgYFxyXG4gKi9cclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnYWMtYXJjJyxcclxuICB0ZW1wbGF0ZTogJycsXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBBY0FyY0NvbXBvbmVudCBleHRlbmRzIEVudGl0eU9uTWFwQ29tcG9uZW50IGltcGxlbWVudHMgT25DaGFuZ2VzIHtcclxuXHJcbiAgQElucHV0KClcclxuICBnZW9tZXRyeVByb3BzOiBhbnk7XHJcbiAgQElucHV0KClcclxuICBpbnN0YW5jZVByb3BzOiBhbnk7XHJcbiAgQElucHV0KClcclxuICBwcmltaXRpdmVQcm9wczogYW55O1xyXG5cclxuICBjb25zdHJ1Y3RvcihhcmNEcmF3ZXI6IEFyY0RyYXdlclNlcnZpY2UsIG1hcExheWVyczogTWFwTGF5ZXJzU2VydmljZSkge1xyXG4gICAgc3VwZXIoYXJjRHJhd2VyLCBtYXBMYXllcnMpO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlT25NYXAoKSB7XHJcbiAgICBpZiAodGhpcy5zZWxmUHJpbWl0aXZlSXNEcmF3KSB7XHJcbiAgICAgIHRoaXMucmVtb3ZlRnJvbU1hcCgpO1xyXG4gICAgICB0aGlzLmRyYXdPbk1hcCgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZHJhd09uTWFwKCkge1xyXG4gICAgdGhpcy5zZWxmUHJpbWl0aXZlSXNEcmF3ID0gdHJ1ZTtcclxuICAgIHJldHVybiB0aGlzLnNlbGZQcmltaXRpdmUgPSB0aGlzLl9kcmF3ZXIuYWRkKHRoaXMuZ2VvbWV0cnlQcm9wcywgdGhpcy5pbnN0YW5jZVByb3BzLCB0aGlzLnByaW1pdGl2ZVByb3BzKTtcclxuICB9XHJcblxyXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcclxuICAgIGNvbnN0IGdlb21ldHJ5UHJvcHMgPSBjaGFuZ2VzWydnZW9tZXRyeVByb3BzJ107XHJcbiAgICBjb25zdCBpbnN0YW5jZVByb3BzID0gY2hhbmdlc1snaW5zdGFuY2VQcm9wcyddO1xyXG4gICAgY29uc3QgcHJpbWl0aXZlUHJvcHMgPSBjaGFuZ2VzWydwcmltaXRpdmVQcm9wcyddO1xyXG4gICAgaWYgKGdlb21ldHJ5UHJvcHMuY3VycmVudFZhbHVlICE9PSBnZW9tZXRyeVByb3BzLnByZXZpb3VzVmFsdWUgfHxcclxuICAgICAgaW5zdGFuY2VQcm9wcy5jdXJyZW50VmFsdWUgIT09IGluc3RhbmNlUHJvcHMucHJldmlvdXNWYWx1ZSB8fFxyXG4gICAgICBwcmltaXRpdmVQcm9wcy5jdXJyZW50VmFsdWUgIT09IHByaW1pdGl2ZVByb3BzLnByZXZpb3VzVmFsdWUpIHtcclxuICAgICAgdGhpcy51cGRhdGVPbk1hcCgpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iXX0=