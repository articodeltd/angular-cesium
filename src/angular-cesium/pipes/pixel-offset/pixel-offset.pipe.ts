import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'pixelOffset'
})
export class PixelOffsetPipe implements PipeTransform {

	transform(value: any, args?: any): any {
		return new Cesium.Cartesian2(value[0], value[1]);
	}

}
