import { Pipe, PipeTransform } from '@angular/core';

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
@Pipe({
	name: 'pixelOffset'
})
export class PixelOffsetPipe implements PipeTransform {

	transform(value: any, args?: any): any {
		return new Cesium.Cartesian2(value[0], value[1]);
	}

}
