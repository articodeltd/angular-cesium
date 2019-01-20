import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'radiansToDegrees'
})
export class RadiansToDegreesPipe implements PipeTransform {

  transform(value: any, args?: any): number {
    return (360 - Math.round(180 * value / Math.PI)) % 360;
  }

}
