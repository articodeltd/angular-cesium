import { Directive, HostListener, Input } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../services/draggable-to-map.service";
/**
 * This directive is used to allow dragging of icons from outside the map over the map
 * while being notified of the dragging position and drop position with an observable exposed from `DraggableToMapService`.
 * @Input {src: string, style?: any} | string -
 * the [src: string | string] should be the image src of the dragged image.
 * The style is an optional style object for the image.
 *
 * example:
 * ```
 * <a href="..." class="..." [draggableToMap]="{src: '../assets/GitHub-Mark-Light.png', style: {width: '50px', height: '50px'}}">
 *     <img class="github" src="../assets/GitHub-Mark-Light.png">
 * </a>
 * ```
 *
 * In order the get notified of the dragging location  and drop state subscribe to `DraggableToMapService.dragUpdates()`
 * ```
 *  this.iconDragService.dragUpdates().subscribe(e => console.log(e));
 * ```
 *
 * In order the cancel dragging use `DraggableToMapService.cancel()`
 * ```
 *  this.iconDragService.cancel();
 * ```
 */
export class DraggableToMapDirective {
    constructor(el, iconDragService) {
        this.iconDragService = iconDragService;
        el.nativeElement.style['user-drag'] = 'none';
        el.nativeElement.style['user-select'] = 'none';
        el.nativeElement.style['-moz-user-select'] = 'none';
        el.nativeElement.style['-webkit-user-drag'] = 'none';
        el.nativeElement.style['-webkit-user-select'] = 'none';
        el.nativeElement.style['-ms-user-select'] = 'none';
    }
    ngOnInit() {
        if (typeof this.draggableToMap === 'string') {
            this.src = this.draggableToMap;
        }
        else {
            this.src = this.draggableToMap.src;
            this.style = this.draggableToMap.style;
        }
    }
    onMouseDown() {
        this.iconDragService.drag(this.src, this.style);
    }
}
DraggableToMapDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: DraggableToMapDirective, deps: [{ token: i0.ElementRef }, { token: i1.DraggableToMapService }], target: i0.ɵɵFactoryTarget.Directive });
DraggableToMapDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.0", type: DraggableToMapDirective, selector: "[draggableToMap]", inputs: { draggableToMap: "draggableToMap" }, host: { listeners: { "mousedown": "onMouseDown()" } }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: DraggableToMapDirective, decorators: [{
            type: Directive,
            args: [{ selector: '[draggableToMap]' }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.DraggableToMapService }]; }, propDecorators: { draggableToMap: [{
                type: Input
            }], onMouseDown: [{
                type: HostListener,
                args: ['mousedown']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJhZ2dhYmxlLXRvLW1hcC5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbGliL2FuZ3VsYXItY2VzaXVtLXdpZGdldHMvZGlyZWN0aXZlcy9kcmFnZ2FibGUtdG8tbWFwLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFjLFlBQVksRUFBRSxLQUFLLEVBQVUsTUFBTSxlQUFlLENBQUM7OztBQUduRjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F1Qkc7QUFHSCxNQUFNLE9BQU8sdUJBQXVCO0lBS2xDLFlBQVksRUFBYyxFQUFVLGVBQXNDO1FBQXRDLG9CQUFlLEdBQWYsZUFBZSxDQUF1QjtRQUN4RSxFQUFFLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsR0FBRyxNQUFNLENBQUM7UUFDN0MsRUFBRSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLEdBQUcsTUFBTSxDQUFDO1FBQy9DLEVBQUUsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLGtCQUFrQixDQUFDLEdBQUcsTUFBTSxDQUFDO1FBQ3BELEVBQUUsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLG1CQUFtQixDQUFDLEdBQUcsTUFBTSxDQUFDO1FBQ3JELEVBQUUsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLHFCQUFxQixDQUFDLEdBQUcsTUFBTSxDQUFDO1FBQ3ZELEVBQUUsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDLEdBQUcsTUFBTSxDQUFDO0lBQ3JELENBQUM7SUFFRCxRQUFRO1FBQ04sSUFBSSxPQUFPLElBQUksQ0FBQyxjQUFjLEtBQUssUUFBUSxFQUFFO1lBQzNDLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQztTQUNoQzthQUFNO1lBQ0wsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQztZQUNuQyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDO1NBQ3hDO0lBQ0gsQ0FBQztJQUdELFdBQVc7UUFDVCxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNsRCxDQUFDOztvSEExQlUsdUJBQXVCO3dHQUF2Qix1QkFBdUI7MkZBQXZCLHVCQUF1QjtrQkFEbkMsU0FBUzttQkFBQyxFQUFDLFFBQVEsRUFBRSxrQkFBa0IsRUFBQztxSUFFOUIsY0FBYztzQkFBdEIsS0FBSztnQkF1Qk4sV0FBVztzQkFEVixZQUFZO3VCQUFDLFdBQVciLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIEhvc3RMaXN0ZW5lciwgSW5wdXQsIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBEcmFnZ2FibGVUb01hcFNlcnZpY2UgfSBmcm9tICcuLi9zZXJ2aWNlcy9kcmFnZ2FibGUtdG8tbWFwLnNlcnZpY2UnO1xyXG5cclxuLyoqXHJcbiAqIFRoaXMgZGlyZWN0aXZlIGlzIHVzZWQgdG8gYWxsb3cgZHJhZ2dpbmcgb2YgaWNvbnMgZnJvbSBvdXRzaWRlIHRoZSBtYXAgb3ZlciB0aGUgbWFwXHJcbiAqIHdoaWxlIGJlaW5nIG5vdGlmaWVkIG9mIHRoZSBkcmFnZ2luZyBwb3NpdGlvbiBhbmQgZHJvcCBwb3NpdGlvbiB3aXRoIGFuIG9ic2VydmFibGUgZXhwb3NlZCBmcm9tIGBEcmFnZ2FibGVUb01hcFNlcnZpY2VgLlxyXG4gKiBASW5wdXQge3NyYzogc3RyaW5nLCBzdHlsZT86IGFueX0gfCBzdHJpbmcgLVxyXG4gKiB0aGUgW3NyYzogc3RyaW5nIHwgc3RyaW5nXSBzaG91bGQgYmUgdGhlIGltYWdlIHNyYyBvZiB0aGUgZHJhZ2dlZCBpbWFnZS5cclxuICogVGhlIHN0eWxlIGlzIGFuIG9wdGlvbmFsIHN0eWxlIG9iamVjdCBmb3IgdGhlIGltYWdlLlxyXG4gKlxyXG4gKiBleGFtcGxlOlxyXG4gKiBgYGBcclxuICogPGEgaHJlZj1cIi4uLlwiIGNsYXNzPVwiLi4uXCIgW2RyYWdnYWJsZVRvTWFwXT1cIntzcmM6ICcuLi9hc3NldHMvR2l0SHViLU1hcmstTGlnaHQucG5nJywgc3R5bGU6IHt3aWR0aDogJzUwcHgnLCBoZWlnaHQ6ICc1MHB4J319XCI+XHJcbiAqICAgICA8aW1nIGNsYXNzPVwiZ2l0aHViXCIgc3JjPVwiLi4vYXNzZXRzL0dpdEh1Yi1NYXJrLUxpZ2h0LnBuZ1wiPlxyXG4gKiA8L2E+XHJcbiAqIGBgYFxyXG4gKlxyXG4gKiBJbiBvcmRlciB0aGUgZ2V0IG5vdGlmaWVkIG9mIHRoZSBkcmFnZ2luZyBsb2NhdGlvbiAgYW5kIGRyb3Agc3RhdGUgc3Vic2NyaWJlIHRvIGBEcmFnZ2FibGVUb01hcFNlcnZpY2UuZHJhZ1VwZGF0ZXMoKWBcclxuICogYGBgXHJcbiAqICB0aGlzLmljb25EcmFnU2VydmljZS5kcmFnVXBkYXRlcygpLnN1YnNjcmliZShlID0+IGNvbnNvbGUubG9nKGUpKTtcclxuICogYGBgXHJcbiAqXHJcbiAqIEluIG9yZGVyIHRoZSBjYW5jZWwgZHJhZ2dpbmcgdXNlIGBEcmFnZ2FibGVUb01hcFNlcnZpY2UuY2FuY2VsKClgXHJcbiAqIGBgYFxyXG4gKiAgdGhpcy5pY29uRHJhZ1NlcnZpY2UuY2FuY2VsKCk7XHJcbiAqIGBgYFxyXG4gKi9cclxuXHJcbkBEaXJlY3RpdmUoe3NlbGVjdG9yOiAnW2RyYWdnYWJsZVRvTWFwXSd9KVxyXG5leHBvcnQgY2xhc3MgRHJhZ2dhYmxlVG9NYXBEaXJlY3RpdmUgaW1wbGVtZW50cyBPbkluaXQge1xyXG4gIEBJbnB1dCgpIGRyYWdnYWJsZVRvTWFwOiB7IHNyYzogc3RyaW5nLCBzdHlsZT86IGFueSB9IHwgc3RyaW5nO1xyXG4gIHByaXZhdGUgc3JjOiBzdHJpbmc7XHJcbiAgcHJpdmF0ZSBzdHlsZTogYW55O1xyXG5cclxuICBjb25zdHJ1Y3RvcihlbDogRWxlbWVudFJlZiwgcHJpdmF0ZSBpY29uRHJhZ1NlcnZpY2U6IERyYWdnYWJsZVRvTWFwU2VydmljZSkge1xyXG4gICAgZWwubmF0aXZlRWxlbWVudC5zdHlsZVsndXNlci1kcmFnJ10gPSAnbm9uZSc7XHJcbiAgICBlbC5uYXRpdmVFbGVtZW50LnN0eWxlWyd1c2VyLXNlbGVjdCddID0gJ25vbmUnO1xyXG4gICAgZWwubmF0aXZlRWxlbWVudC5zdHlsZVsnLW1vei11c2VyLXNlbGVjdCddID0gJ25vbmUnO1xyXG4gICAgZWwubmF0aXZlRWxlbWVudC5zdHlsZVsnLXdlYmtpdC11c2VyLWRyYWcnXSA9ICdub25lJztcclxuICAgIGVsLm5hdGl2ZUVsZW1lbnQuc3R5bGVbJy13ZWJraXQtdXNlci1zZWxlY3QnXSA9ICdub25lJztcclxuICAgIGVsLm5hdGl2ZUVsZW1lbnQuc3R5bGVbJy1tcy11c2VyLXNlbGVjdCddID0gJ25vbmUnO1xyXG4gIH1cclxuXHJcbiAgbmdPbkluaXQoKTogdm9pZCB7XHJcbiAgICBpZiAodHlwZW9mIHRoaXMuZHJhZ2dhYmxlVG9NYXAgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgIHRoaXMuc3JjID0gdGhpcy5kcmFnZ2FibGVUb01hcDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuc3JjID0gdGhpcy5kcmFnZ2FibGVUb01hcC5zcmM7XHJcbiAgICAgIHRoaXMuc3R5bGUgPSB0aGlzLmRyYWdnYWJsZVRvTWFwLnN0eWxlO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgQEhvc3RMaXN0ZW5lcignbW91c2Vkb3duJylcclxuICBvbk1vdXNlRG93bigpIHtcclxuICAgIHRoaXMuaWNvbkRyYWdTZXJ2aWNlLmRyYWcodGhpcy5zcmMsIHRoaXMuc3R5bGUpO1xyXG4gIH1cclxufVxyXG4iXX0=