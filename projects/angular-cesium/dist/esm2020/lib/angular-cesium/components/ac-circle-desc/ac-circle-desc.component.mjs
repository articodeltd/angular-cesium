import { Component, forwardRef } from '@angular/core';
import { BasicDesc } from '../../services/basic-desc/basic-desc.service';
import * as i0 from "@angular/core";
import * as i1 from "../../services/drawers/ellipse-drawer/ellipse-drawer.service";
import * as i2 from "../../services/layer-service/layer-service.service";
import * as i3 from "../../services/computation-cache/computation-cache.service";
import * as i4 from "../../services/cesium-properties/cesium-properties.service";
/**
 *  This is a circle implementation.
 *  The element must be a child of ac-layer element.
 *  semiMajorAxis ans semiMinorAxis are replaced with radius property.
 *  All other properties of props are the same as the properties of Entity and EllipseGraphics:
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Entity.html
 *  + https://cesiumjs.org/Cesium/Build/Documentation/EllipseGraphics.html
 *
 *__Usage :__
 *  ```
 *    <ac-circle-desc props="{
 *      position: data.position,
 *      radius: 5
 *      granularity:0.08 // Optional
 *    }">
 *    </ac-circle-desc>
 *  ```
 */
export class AcCircleDescComponent extends BasicDesc {
    constructor(ellipseDrawer, layerService, computationCache, cesiumProperties) {
        super(ellipseDrawer, layerService, computationCache, cesiumProperties);
    }
    _propsEvaluator(context) {
        const cesiumProps = super._propsEvaluator(context);
        cesiumProps.semiMajorAxis = cesiumProps.radius;
        cesiumProps.semiMinorAxis = cesiumProps.radius;
        delete cesiumProps.radius;
        return cesiumProps;
    }
    _getPropsAssigner() {
        return (cesiumObject, desc) => Object.assign(cesiumObject, desc);
    }
}
AcCircleDescComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcCircleDescComponent, deps: [{ token: i1.EllipseDrawerService }, { token: i2.LayerService }, { token: i3.ComputationCache }, { token: i4.CesiumProperties }], target: i0.ɵɵFactoryTarget.Component });
AcCircleDescComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: AcCircleDescComponent, selector: "ac-circle-desc", providers: [{ provide: BasicDesc, useExisting: forwardRef(() => AcCircleDescComponent) }], usesInheritance: true, ngImport: i0, template: '', isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcCircleDescComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ac-circle-desc',
                    template: '',
                    providers: [{ provide: BasicDesc, useExisting: forwardRef(() => AcCircleDescComponent) }],
                }]
        }], ctorParameters: function () { return [{ type: i1.EllipseDrawerService }, { type: i2.LayerService }, { type: i3.ComputationCache }, { type: i4.CesiumProperties }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtY2lyY2xlLWRlc2MuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2xpYi9hbmd1bGFyLWNlc2l1bS9jb21wb25lbnRzL2FjLWNpcmNsZS1kZXNjL2FjLWNpcmNsZS1kZXNjLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUl0RCxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sOENBQThDLENBQUM7Ozs7OztBQUd6RTs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FpQkc7QUFNSCxNQUFNLE9BQU8scUJBQXNCLFNBQVEsU0FBUztJQUNsRCxZQUFZLGFBQW1DLEVBQUUsWUFBMEIsRUFDL0QsZ0JBQWtDLEVBQUUsZ0JBQWtDO1FBQ2hGLEtBQUssQ0FBQyxhQUFhLEVBQUUsWUFBWSxFQUFFLGdCQUFnQixFQUFFLGdCQUFnQixDQUFDLENBQUM7SUFDekUsQ0FBQztJQUVTLGVBQWUsQ0FBQyxPQUFlO1FBQ3ZDLE1BQU0sV0FBVyxHQUFHLEtBQUssQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFbkQsV0FBVyxDQUFDLGFBQWEsR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDO1FBQy9DLFdBQVcsQ0FBQyxhQUFhLEdBQUcsV0FBVyxDQUFDLE1BQU0sQ0FBQztRQUMvQyxPQUFPLFdBQVcsQ0FBQyxNQUFNLENBQUM7UUFFMUIsT0FBTyxXQUFXLENBQUM7SUFDckIsQ0FBQztJQUVTLGlCQUFpQjtRQUN6QixPQUFPLENBQUMsWUFBb0IsRUFBRSxJQUFZLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ25GLENBQUM7O2tIQWxCVSxxQkFBcUI7c0dBQXJCLHFCQUFxQix5Q0FGckIsQ0FBQyxFQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsV0FBVyxFQUFFLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxxQkFBcUIsQ0FBQyxFQUFDLENBQUMsaURBRDdFLEVBQUU7MkZBR0QscUJBQXFCO2tCQUxqQyxTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxnQkFBZ0I7b0JBQzFCLFFBQVEsRUFBRSxFQUFFO29CQUNaLFNBQVMsRUFBRSxDQUFDLEVBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxXQUFXLEVBQUUsVUFBVSxDQUFDLEdBQUcsRUFBRSxzQkFBc0IsQ0FBQyxFQUFDLENBQUM7aUJBQ3hGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBmb3J3YXJkUmVmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IENlc2l1bVByb3BlcnRpZXMgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9jZXNpdW0tcHJvcGVydGllcy9jZXNpdW0tcHJvcGVydGllcy5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQ29tcHV0YXRpb25DYWNoZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2NvbXB1dGF0aW9uLWNhY2hlL2NvbXB1dGF0aW9uLWNhY2hlLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBMYXllclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9sYXllci1zZXJ2aWNlL2xheWVyLXNlcnZpY2Uuc2VydmljZSc7XHJcbmltcG9ydCB7IEJhc2ljRGVzYyB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2Jhc2ljLWRlc2MvYmFzaWMtZGVzYy5zZXJ2aWNlJztcclxuaW1wb3J0IHsgRWxsaXBzZURyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL2VsbGlwc2UtZHJhd2VyL2VsbGlwc2UtZHJhd2VyLnNlcnZpY2UnO1xyXG5cclxuLyoqXHJcbiAqICBUaGlzIGlzIGEgY2lyY2xlIGltcGxlbWVudGF0aW9uLlxyXG4gKiAgVGhlIGVsZW1lbnQgbXVzdCBiZSBhIGNoaWxkIG9mIGFjLWxheWVyIGVsZW1lbnQuXHJcbiAqICBzZW1pTWFqb3JBeGlzIGFucyBzZW1pTWlub3JBeGlzIGFyZSByZXBsYWNlZCB3aXRoIHJhZGl1cyBwcm9wZXJ0eS5cclxuICogIEFsbCBvdGhlciBwcm9wZXJ0aWVzIG9mIHByb3BzIGFyZSB0aGUgc2FtZSBhcyB0aGUgcHJvcGVydGllcyBvZiBFbnRpdHkgYW5kIEVsbGlwc2VHcmFwaGljczpcclxuICogICsgaHR0cHM6Ly9jZXNpdW1qcy5vcmcvQ2VzaXVtL0J1aWxkL0RvY3VtZW50YXRpb24vRW50aXR5Lmh0bWxcclxuICogICsgaHR0cHM6Ly9jZXNpdW1qcy5vcmcvQ2VzaXVtL0J1aWxkL0RvY3VtZW50YXRpb24vRWxsaXBzZUdyYXBoaWNzLmh0bWxcclxuICpcclxuICpfX1VzYWdlIDpfX1xyXG4gKiAgYGBgXHJcbiAqICAgIDxhYy1jaXJjbGUtZGVzYyBwcm9wcz1cIntcclxuICogICAgICBwb3NpdGlvbjogZGF0YS5wb3NpdGlvbixcclxuICogICAgICByYWRpdXM6IDVcclxuICogICAgICBncmFudWxhcml0eTowLjA4IC8vIE9wdGlvbmFsXHJcbiAqICAgIH1cIj5cclxuICogICAgPC9hYy1jaXJjbGUtZGVzYz5cclxuICogIGBgYFxyXG4gKi9cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdhYy1jaXJjbGUtZGVzYycsXHJcbiAgdGVtcGxhdGU6ICcnLFxyXG4gIHByb3ZpZGVyczogW3twcm92aWRlOiBCYXNpY0Rlc2MsIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IEFjQ2lyY2xlRGVzY0NvbXBvbmVudCl9XSxcclxufSlcclxuZXhwb3J0IGNsYXNzIEFjQ2lyY2xlRGVzY0NvbXBvbmVudCBleHRlbmRzIEJhc2ljRGVzYyB7XHJcbiAgY29uc3RydWN0b3IoZWxsaXBzZURyYXdlcjogRWxsaXBzZURyYXdlclNlcnZpY2UsIGxheWVyU2VydmljZTogTGF5ZXJTZXJ2aWNlLFxyXG4gICAgICAgICAgICAgIGNvbXB1dGF0aW9uQ2FjaGU6IENvbXB1dGF0aW9uQ2FjaGUsIGNlc2l1bVByb3BlcnRpZXM6IENlc2l1bVByb3BlcnRpZXMpIHtcclxuICAgIHN1cGVyKGVsbGlwc2VEcmF3ZXIsIGxheWVyU2VydmljZSwgY29tcHV0YXRpb25DYWNoZSwgY2VzaXVtUHJvcGVydGllcyk7XHJcbiAgfVxyXG5cclxuICBwcm90ZWN0ZWQgX3Byb3BzRXZhbHVhdG9yKGNvbnRleHQ6IE9iamVjdCk6IGFueSB7XHJcbiAgICBjb25zdCBjZXNpdW1Qcm9wcyA9IHN1cGVyLl9wcm9wc0V2YWx1YXRvcihjb250ZXh0KTtcclxuXHJcbiAgICBjZXNpdW1Qcm9wcy5zZW1pTWFqb3JBeGlzID0gY2VzaXVtUHJvcHMucmFkaXVzO1xyXG4gICAgY2VzaXVtUHJvcHMuc2VtaU1pbm9yQXhpcyA9IGNlc2l1bVByb3BzLnJhZGl1cztcclxuICAgIGRlbGV0ZSBjZXNpdW1Qcm9wcy5yYWRpdXM7XHJcblxyXG4gICAgcmV0dXJuIGNlc2l1bVByb3BzO1xyXG4gIH1cclxuXHJcbiAgcHJvdGVjdGVkIF9nZXRQcm9wc0Fzc2lnbmVyKCk6IChjZXNpdW1PYmplY3Q6IE9iamVjdCwgZGVzYzogT2JqZWN0KSA9PiBPYmplY3Qge1xyXG4gICAgcmV0dXJuIChjZXNpdW1PYmplY3Q6IE9iamVjdCwgZGVzYzogT2JqZWN0KSA9PiBPYmplY3QuYXNzaWduKGNlc2l1bU9iamVjdCwgZGVzYyk7XHJcbiAgfVxyXG59XHJcbiJdfQ==