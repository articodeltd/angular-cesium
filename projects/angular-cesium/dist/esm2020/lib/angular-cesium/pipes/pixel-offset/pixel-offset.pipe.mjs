import { Pipe } from '@angular/core';
import { Cartesian2 } from 'cesium';
import * as i0 from "@angular/core";
/**
 * @example
 * <ac-label-desc props="{
 *            position: track.position,
 *            pixelOffset : [-15,20] | pixelOffset,
 *            text: track.name,
 *            font: '15px sans-serif'
 *    }">
 * </ac-label-desc>
 */
export class PixelOffsetPipe {
    transform(value, args) {
        return new Cartesian2(value[0], value[1]);
    }
}
PixelOffsetPipe.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: PixelOffsetPipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe });
PixelOffsetPipe.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: PixelOffsetPipe, name: "pixelOffset" });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: PixelOffsetPipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'pixelOffset'
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGl4ZWwtb2Zmc2V0LnBpcGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbGliL2FuZ3VsYXItY2VzaXVtL3BpcGVzL3BpeGVsLW9mZnNldC9waXhlbC1vZmZzZXQucGlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsSUFBSSxFQUFpQixNQUFNLGVBQWUsQ0FBQztBQUNwRCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sUUFBUSxDQUFDOztBQUVwQzs7Ozs7Ozs7O0dBU0c7QUFJSCxNQUFNLE9BQU8sZUFBZTtJQUUxQixTQUFTLENBQUMsS0FBVSxFQUFFLElBQVU7UUFDOUIsT0FBTyxJQUFJLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDNUMsQ0FBQzs7NEdBSlUsZUFBZTswR0FBZixlQUFlOzJGQUFmLGVBQWU7a0JBSDNCLElBQUk7bUJBQUM7b0JBQ0osSUFBSSxFQUFFLGFBQWE7aUJBQ3BCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUGlwZSwgUGlwZVRyYW5zZm9ybSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBDYXJ0ZXNpYW4yIH0gZnJvbSAnY2VzaXVtJztcclxuXHJcbi8qKlxyXG4gKiBAZXhhbXBsZVxyXG4gKiA8YWMtbGFiZWwtZGVzYyBwcm9wcz1cIntcclxuICogICAgICAgICAgICBwb3NpdGlvbjogdHJhY2sucG9zaXRpb24sXHJcbiAqICAgICAgICAgICAgcGl4ZWxPZmZzZXQgOiBbLTE1LDIwXSB8IHBpeGVsT2Zmc2V0LFxyXG4gKiAgICAgICAgICAgIHRleHQ6IHRyYWNrLm5hbWUsXHJcbiAqICAgICAgICAgICAgZm9udDogJzE1cHggc2Fucy1zZXJpZidcclxuICogICAgfVwiPlxyXG4gKiA8L2FjLWxhYmVsLWRlc2M+XHJcbiAqL1xyXG5AUGlwZSh7XHJcbiAgbmFtZTogJ3BpeGVsT2Zmc2V0J1xyXG59KVxyXG5leHBvcnQgY2xhc3MgUGl4ZWxPZmZzZXRQaXBlIGltcGxlbWVudHMgUGlwZVRyYW5zZm9ybSB7XHJcblxyXG4gIHRyYW5zZm9ybSh2YWx1ZTogYW55LCBhcmdzPzogYW55KTogYW55IHtcclxuICAgIHJldHVybiBuZXcgQ2FydGVzaWFuMih2YWx1ZVswXSwgdmFsdWVbMV0pO1xyXG4gIH1cclxuXHJcbn1cclxuIl19