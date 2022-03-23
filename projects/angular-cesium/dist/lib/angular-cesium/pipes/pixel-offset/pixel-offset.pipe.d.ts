import { PipeTransform } from '@angular/core';
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
export declare class PixelOffsetPipe implements PipeTransform {
    transform(value: any, args?: any): any;
    static ɵfac: i0.ɵɵFactoryDeclaration<PixelOffsetPipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<PixelOffsetPipe, "pixelOffset">;
}
