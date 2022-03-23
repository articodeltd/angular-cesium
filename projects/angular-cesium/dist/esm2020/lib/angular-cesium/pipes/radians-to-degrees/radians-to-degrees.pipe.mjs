import { Pipe } from '@angular/core';
import * as i0 from "@angular/core";
export class RadiansToDegreesPipe {
    transform(value, args) {
        return (360 - Math.round(180 * value / Math.PI)) % 360;
    }
}
RadiansToDegreesPipe.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: RadiansToDegreesPipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe });
RadiansToDegreesPipe.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: RadiansToDegreesPipe, name: "radiansToDegrees" });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: RadiansToDegreesPipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'radiansToDegrees'
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFkaWFucy10by1kZWdyZWVzLnBpcGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbGliL2FuZ3VsYXItY2VzaXVtL3BpcGVzL3JhZGlhbnMtdG8tZGVncmVlcy9yYWRpYW5zLXRvLWRlZ3JlZXMucGlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsSUFBSSxFQUFpQixNQUFNLGVBQWUsQ0FBQzs7QUFLcEQsTUFBTSxPQUFPLG9CQUFvQjtJQUUvQixTQUFTLENBQUMsS0FBVSxFQUFFLElBQVU7UUFDOUIsT0FBTyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxLQUFLLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDO0lBQ3pELENBQUM7O2lIQUpVLG9CQUFvQjsrR0FBcEIsb0JBQW9COzJGQUFwQixvQkFBb0I7a0JBSGhDLElBQUk7bUJBQUM7b0JBQ0osSUFBSSxFQUFFLGtCQUFrQjtpQkFDekIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQaXBlLCBQaXBlVHJhbnNmb3JtIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5AUGlwZSh7XHJcbiAgbmFtZTogJ3JhZGlhbnNUb0RlZ3JlZXMnXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBSYWRpYW5zVG9EZWdyZWVzUGlwZSBpbXBsZW1lbnRzIFBpcGVUcmFuc2Zvcm0ge1xyXG5cclxuICB0cmFuc2Zvcm0odmFsdWU6IGFueSwgYXJncz86IGFueSk6IG51bWJlciB7XHJcbiAgICByZXR1cm4gKDM2MCAtIE1hdGgucm91bmQoMTgwICogdmFsdWUgLyBNYXRoLlBJKSkgJSAzNjA7XHJcbiAgfVxyXG5cclxufVxyXG4iXX0=