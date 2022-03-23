import { Input, Directive } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../drawers/basic-drawer/basic-drawer.service";
import * as i2 from "../map-layers/map-layers.service";
/**
 *  Extend this class to create drawing on map components.
 */
export class EntityOnMapComponent {
    constructor(_drawer, mapLayers) {
        this._drawer = _drawer;
        this.mapLayers = mapLayers;
    }
    ngOnInit() {
        this.selfPrimitiveIsDraw = false;
        const dataSources = this._drawer.init();
        if (dataSources) {
            this.dataSources = dataSources;
            // this.mapLayers.registerLayerDataSources(dataSources, 0);
        }
        this.drawOnMap();
    }
    ngOnChanges(changes) {
        const props = changes['props'];
        if (props.currentValue !== props.previousValue) {
            this.updateOnMap();
        }
    }
    drawOnMap() {
        this.selfPrimitiveIsDraw = true;
        return this.selfPrimitive = this._drawer.add(this.props);
    }
    removeFromMap() {
        this.selfPrimitiveIsDraw = false;
        return this._drawer.remove(this.selfPrimitive);
    }
    updateOnMap() {
        if (this.selfPrimitiveIsDraw) {
            return this._drawer.update(this.selfPrimitive, this.props);
        }
    }
    ngOnDestroy() {
        this.mapLayers.removeDataSources(this.dataSources);
        this.removeFromMap();
    }
}
EntityOnMapComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: EntityOnMapComponent, deps: [{ token: i1.BasicDrawerService }, { token: i2.MapLayersService }], target: i0.ɵɵFactoryTarget.Directive });
EntityOnMapComponent.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.0", type: EntityOnMapComponent, inputs: { props: "props" }, usesOnChanges: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: EntityOnMapComponent, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: i1.BasicDrawerService }, { type: i2.MapLayersService }]; }, propDecorators: { props: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LW9uLW1hcC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbGliL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2VudGl0eS1vbi1tYXAvZW50aXR5LW9uLW1hcC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLEtBQUssRUFBK0MsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDOzs7O0FBSTlGOztHQUVHO0FBRUgsTUFBTSxPQUFPLG9CQUFvQjtJQVEvQixZQUFzQixPQUEyQixFQUFVLFNBQTJCO1FBQWhFLFlBQU8sR0FBUCxPQUFPLENBQW9CO1FBQVUsY0FBUyxHQUFULFNBQVMsQ0FBa0I7SUFDdEYsQ0FBQztJQUVELFFBQVE7UUFDTixJQUFJLENBQUMsbUJBQW1CLEdBQUcsS0FBSyxDQUFDO1FBQ2pDLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDeEMsSUFBSSxXQUFXLEVBQUU7WUFDZixJQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztZQUMvQiwyREFBMkQ7U0FDNUQ7UUFDRCxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDbkIsQ0FBQztJQUVELFdBQVcsQ0FBQyxPQUFzQjtRQUNoQyxNQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDL0IsSUFBSSxLQUFLLENBQUMsWUFBWSxLQUFLLEtBQUssQ0FBQyxhQUFhLEVBQUU7WUFDOUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1NBQ3BCO0lBQ0gsQ0FBQztJQUVELFNBQVM7UUFDUCxJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxDQUFDO1FBQ2hDLE9BQU8sSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDM0QsQ0FBQztJQUVELGFBQWE7UUFDWCxJQUFJLENBQUMsbUJBQW1CLEdBQUcsS0FBSyxDQUFDO1FBQ2pDLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQ2pELENBQUM7SUFFRCxXQUFXO1FBQ1QsSUFBSSxJQUFJLENBQUMsbUJBQW1CLEVBQUU7WUFDNUIsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUM1RDtJQUNILENBQUM7SUFFRCxXQUFXO1FBQ1QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDbkQsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO0lBQ3ZCLENBQUM7O2lIQS9DVSxvQkFBb0I7cUdBQXBCLG9CQUFvQjsyRkFBcEIsb0JBQW9CO2tCQURoQyxTQUFTO3dJQUdSLEtBQUs7c0JBREosS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElucHV0LCBPbkNoYW5nZXMsIE9uRGVzdHJveSwgT25Jbml0LCBTaW1wbGVDaGFuZ2VzLCBEaXJlY3RpdmUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgQmFzaWNEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vZHJhd2Vycy9iYXNpYy1kcmF3ZXIvYmFzaWMtZHJhd2VyLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBNYXBMYXllcnNTZXJ2aWNlIH0gZnJvbSAnLi4vbWFwLWxheWVycy9tYXAtbGF5ZXJzLnNlcnZpY2UnO1xyXG5cclxuLyoqXHJcbiAqICBFeHRlbmQgdGhpcyBjbGFzcyB0byBjcmVhdGUgZHJhd2luZyBvbiBtYXAgY29tcG9uZW50cy5cclxuICovXHJcbkBEaXJlY3RpdmUoKVxyXG5leHBvcnQgY2xhc3MgRW50aXR5T25NYXBDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcywgT25EZXN0cm95IHtcclxuICBASW5wdXQoKVxyXG4gIHByb3BzOiBhbnk7XHJcblxyXG4gIHByb3RlY3RlZCBzZWxmUHJpbWl0aXZlOiBhbnk7XHJcbiAgcHJvdGVjdGVkIHNlbGZQcmltaXRpdmVJc0RyYXc6IGJvb2xlYW47XHJcbiAgcHJvdGVjdGVkIGRhdGFTb3VyY2VzOiBhbnk7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBfZHJhd2VyOiBCYXNpY0RyYXdlclNlcnZpY2UsIHByaXZhdGUgbWFwTGF5ZXJzOiBNYXBMYXllcnNTZXJ2aWNlKSB7XHJcbiAgfVxyXG5cclxuICBuZ09uSW5pdCgpOiB2b2lkIHtcclxuICAgIHRoaXMuc2VsZlByaW1pdGl2ZUlzRHJhdyA9IGZhbHNlO1xyXG4gICAgY29uc3QgZGF0YVNvdXJjZXMgPSB0aGlzLl9kcmF3ZXIuaW5pdCgpO1xyXG4gICAgaWYgKGRhdGFTb3VyY2VzKSB7XHJcbiAgICAgIHRoaXMuZGF0YVNvdXJjZXMgPSBkYXRhU291cmNlcztcclxuICAgICAgLy8gdGhpcy5tYXBMYXllcnMucmVnaXN0ZXJMYXllckRhdGFTb3VyY2VzKGRhdGFTb3VyY2VzLCAwKTtcclxuICAgIH1cclxuICAgIHRoaXMuZHJhd09uTWFwKCk7XHJcbiAgfVxyXG5cclxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XHJcbiAgICBjb25zdCBwcm9wcyA9IGNoYW5nZXNbJ3Byb3BzJ107XHJcbiAgICBpZiAocHJvcHMuY3VycmVudFZhbHVlICE9PSBwcm9wcy5wcmV2aW91c1ZhbHVlKSB7XHJcbiAgICAgIHRoaXMudXBkYXRlT25NYXAoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGRyYXdPbk1hcCgpIHtcclxuICAgIHRoaXMuc2VsZlByaW1pdGl2ZUlzRHJhdyA9IHRydWU7XHJcbiAgICByZXR1cm4gdGhpcy5zZWxmUHJpbWl0aXZlID0gdGhpcy5fZHJhd2VyLmFkZCh0aGlzLnByb3BzKTtcclxuICB9XHJcblxyXG4gIHJlbW92ZUZyb21NYXAoKSB7XHJcbiAgICB0aGlzLnNlbGZQcmltaXRpdmVJc0RyYXcgPSBmYWxzZTtcclxuICAgIHJldHVybiB0aGlzLl9kcmF3ZXIucmVtb3ZlKHRoaXMuc2VsZlByaW1pdGl2ZSk7XHJcbiAgfVxyXG5cclxuICB1cGRhdGVPbk1hcCgpIHtcclxuICAgIGlmICh0aGlzLnNlbGZQcmltaXRpdmVJc0RyYXcpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuX2RyYXdlci51cGRhdGUodGhpcy5zZWxmUHJpbWl0aXZlLCB0aGlzLnByb3BzKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xyXG4gICAgdGhpcy5tYXBMYXllcnMucmVtb3ZlRGF0YVNvdXJjZXModGhpcy5kYXRhU291cmNlcyk7XHJcbiAgICB0aGlzLnJlbW92ZUZyb21NYXAoKTtcclxuICB9XHJcbn1cclxuIl19