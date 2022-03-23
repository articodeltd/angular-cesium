import { EventEmitter, Input, Output, Directive } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../drawers/basic-drawer/basic-drawer.service";
import * as i2 from "../layer-service/layer-service.service";
import * as i3 from "../computation-cache/computation-cache.service";
import * as i4 from "../cesium-properties/cesium-properties.service";
/**
 *  the ancestor class for creating components.
 *  extend this class to create desc component.
 */
export class BasicDesc {
    constructor(_drawer, _layerService, _computationCache, _cesiumProperties) {
        this._drawer = _drawer;
        this._layerService = _layerService;
        this._computationCache = _computationCache;
        this._cesiumProperties = _cesiumProperties;
        this.onDraw = new EventEmitter();
        this.onRemove = new EventEmitter();
        this._cesiumObjectsMap = new Map();
    }
    _propsEvaluator(context) {
        return this._propsEvaluateFn(this._computationCache, context);
    }
    _getPropsAssigner() {
        return (cesiumObject, desc) => this._propsAssignerFn(cesiumObject, desc);
    }
    getLayerService() {
        return this._layerService;
    }
    setLayerService(layerService) {
        this._layerService.unregisterDescription(this);
        this._layerService = layerService;
        this._layerService.registerDescription(this);
        this._propsEvaluateFn = this._cesiumProperties.createEvaluator(this.props, this._layerService.cache, true);
        this._propsAssignerFn = this._cesiumProperties.createAssigner(this.props);
    }
    ngOnInit() {
        if (!this.props) {
            console.error('ac-desc components error: [props] input is mandatory');
        }
        this._layerService.registerDescription(this);
        this._propsEvaluateFn = this._cesiumProperties.createEvaluator(this.props, this._layerService.cache);
        this._propsAssignerFn = this._cesiumProperties.createAssigner(this.props);
    }
    getCesiumObjectsMap() {
        return this._cesiumObjectsMap;
    }
    draw(context, id, entity) {
        const cesiumProps = this._propsEvaluator(context);
        if (!this._cesiumObjectsMap.has(id)) {
            const cesiumObject = this._drawer.add(cesiumProps);
            this.onDraw.emit({
                acEntity: entity,
                cesiumEntity: cesiumObject,
                entityId: id,
            });
            cesiumObject.acEntity = entity; // set the entity on the cesiumObject for later usage
            this._cesiumObjectsMap.set(id, cesiumObject);
        }
        else {
            const cesiumObject = this._cesiumObjectsMap.get(id);
            this.onDraw.emit({
                acEntity: entity,
                cesiumEntity: cesiumObject,
                entityId: id,
            });
            cesiumObject.acEntity = entity; // set the entity on the cesiumObject for later usage
            this._drawer.setPropsAssigner(this._getPropsAssigner());
            this._drawer.update(cesiumObject, cesiumProps);
        }
    }
    remove(id) {
        const cesiumObject = this._cesiumObjectsMap.get(id);
        if (cesiumObject) {
            this.onRemove.emit({
                acEntity: cesiumObject.acEntity,
                cesiumEntity: cesiumObject,
                entityId: id,
            });
            this._drawer.remove(cesiumObject);
            this._cesiumObjectsMap.delete(id);
        }
    }
    removeAll() {
        this._cesiumObjectsMap.clear();
        this._drawer.removeAll();
    }
    ngOnDestroy() {
        this._layerService.unregisterDescription(this);
        this.removeAll();
    }
}
BasicDesc.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: BasicDesc, deps: [{ token: i1.BasicDrawerService }, { token: i2.LayerService }, { token: i3.ComputationCache }, { token: i4.CesiumProperties }], target: i0.ɵɵFactoryTarget.Directive });
BasicDesc.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.0", type: BasicDesc, inputs: { props: "props" }, outputs: { onDraw: "onDraw", onRemove: "onRemove" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: BasicDesc, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: i1.BasicDrawerService }, { type: i2.LayerService }, { type: i3.ComputationCache }, { type: i4.CesiumProperties }]; }, propDecorators: { props: [{
                type: Input
            }], onDraw: [{
                type: Output
            }], onRemove: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzaWMtZGVzYy5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2xpYi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9iYXNpYy1kZXNjL2Jhc2ljLWRlc2Muc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBcUIsTUFBTSxFQUFFLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQzs7Ozs7O0FBYzFGOzs7R0FHRztBQUVILE1BQU0sT0FBTyxTQUFTO0lBY3BCLFlBQXNCLE9BQTJCLEVBQzNCLGFBQTJCLEVBQzNCLGlCQUFtQyxFQUNuQyxpQkFBbUM7UUFIbkMsWUFBTyxHQUFQLE9BQU8sQ0FBb0I7UUFDM0Isa0JBQWEsR0FBYixhQUFhLENBQWM7UUFDM0Isc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFrQjtRQUNuQyxzQkFBaUIsR0FBakIsaUJBQWlCLENBQWtCO1FBWnpELFdBQU0sR0FBK0IsSUFBSSxZQUFZLEVBQWdCLENBQUM7UUFHdEUsYUFBUSxHQUErQixJQUFJLFlBQVksRUFBZ0IsQ0FBQztRQUU5RCxzQkFBaUIsR0FBcUIsSUFBSSxHQUFHLEVBQWUsQ0FBQztJQVF2RSxDQUFDO0lBRVMsZUFBZSxDQUFDLE9BQWU7UUFDdkMsT0FBTyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ2hFLENBQUM7SUFFUyxpQkFBaUI7UUFDekIsT0FBTyxDQUFDLFlBQW9CLEVBQUUsSUFBWSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQzNGLENBQUM7SUFFRCxlQUFlO1FBQ2IsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDO0lBQzVCLENBQUM7SUFFRCxlQUFlLENBQUMsWUFBMEI7UUFDeEMsSUFBSSxDQUFDLGFBQWEs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QUFRLEVBQUUsRUFBRTthQUNiLENBQUMsQ0FBQztZQUNILElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQ2xDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDbkM7SUFDSCxDQUFDO0lBRUQsU0FBUztRQUNQLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUMvQixJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQzNCLENBQUM7SUFFRCxXQUFXO1FBQ1QsSUFBSSxDQUFDLGFBQWEsQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMvQyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDbkIsQ0FBQzs7c0dBcEdVLFNBQVM7MEZBQVQsU0FBUzsyRkFBVCxTQUFTO2tCQURyQixTQUFTO2tNQUdSLEtBQUs7c0JBREosS0FBSztnQkFJTixNQUFNO3NCQURMLE1BQU07Z0JBSVAsUUFBUTtzQkFEUCxNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRXZlbnRFbWl0dGVyLCBJbnB1dCwgT25EZXN0cm95LCBPbkluaXQsIE91dHB1dCwgRGlyZWN0aXZlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IExheWVyU2VydmljZSB9IGZyb20gJy4uL2xheWVyLXNlcnZpY2UvbGF5ZXItc2VydmljZS5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQ29tcHV0YXRpb25DYWNoZSB9IGZyb20gJy4uL2NvbXB1dGF0aW9uLWNhY2hlL2NvbXB1dGF0aW9uLWNhY2hlLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBDZXNpdW1Qcm9wZXJ0aWVzIH0gZnJvbSAnLi4vY2VzaXVtLXByb3BlcnRpZXMvY2VzaXVtLXByb3BlcnRpZXMuc2VydmljZSc7XHJcbmltcG9ydCB7IEFjRW50aXR5IH0gZnJvbSAnLi4vLi4vbW9kZWxzL2FjLWVudGl0eSc7XHJcbmltcG9ydCB7IEJhc2ljRHJhd2VyU2VydmljZSB9IGZyb20gJy4uL2RyYXdlcnMvYmFzaWMtZHJhd2VyL2Jhc2ljLWRyYXdlci5zZXJ2aWNlJztcclxuaW1wb3J0IHsgSURlc2NyaXB0aW9uIH0gZnJvbSAnLi4vLi4vbW9kZWxzL2Rlc2NyaXB0aW9uJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgT25EcmF3UGFyYW1zIHtcclxuICBhY0VudGl0eTogQWNFbnRpdHk7XHJcbiAgZW50aXR5SWQ6IHN0cmluZztcclxuICBjZXNpdW1FbnRpdHk6IGFueTtcclxufVxyXG5cclxuLyoqXHJcbiAqICB0aGUgYW5jZXN0b3IgY2xhc3MgZm9yIGNyZWF0aW5nIGNvbXBvbmVudHMuXHJcbiAqICBleHRlbmQgdGhpcyBjbGFzcyB0byBjcmVhdGUgZGVzYyBjb21wb25lbnQuXHJcbiAqL1xyXG5ARGlyZWN0aXZlKClcclxuZXhwb3J0IGNsYXNzIEJhc2ljRGVzYyBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95LCBJRGVzY3JpcHRpb24ge1xyXG4gIEBJbnB1dCgpXHJcbiAgcHJvcHM6IGFueTtcclxuXHJcbiAgQE91dHB1dCgpXHJcbiAgb25EcmF3OiBFdmVudEVtaXR0ZXI8T25EcmF3UGFyYW1zPiA9IG5ldyBFdmVudEVtaXR0ZXI8T25EcmF3UGFyYW1zPigpO1xyXG5cclxuICBAT3V0cHV0KClcclxuICBvblJlbW92ZTogRXZlbnRFbWl0dGVyPE9uRHJhd1BhcmFtcz4gPSBuZXcgRXZlbnRFbWl0dGVyPE9uRHJhd1BhcmFtcz4oKTtcclxuXHJcbiAgcHJvdGVjdGVkIF9jZXNpdW1PYmplY3RzTWFwOiBNYXA8c3RyaW5nLCBhbnk+ID0gbmV3IE1hcDxzdHJpbmcsIGFueT4oKTtcclxuICBwcml2YXRlIF9wcm9wc0V2YWx1YXRlRm46IEZ1bmN0aW9uO1xyXG4gIHByaXZhdGUgX3Byb3BzQXNzaWduZXJGbjogRnVuY3Rpb247XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBfZHJhd2VyOiBCYXNpY0RyYXdlclNlcnZpY2UsXHJcbiAgICAgICAgICAgICAgcHJvdGVjdGVkIF9sYXllclNlcnZpY2U6IExheWVyU2VydmljZSxcclxuICAgICAgICAgICAgICBwcm90ZWN0ZWQgX2NvbXB1dGF0aW9uQ2FjaGU6IENvbXB1dGF0aW9uQ2FjaGUsXHJcbiAgICAgICAgICAgICAgcHJvdGVjdGVkIF9jZXNpdW1Qcm9wZXJ0aWVzOiBDZXNpdW1Qcm9wZXJ0aWVzKSB7XHJcbiAgfVxyXG5cclxuICBwcm90ZWN0ZWQgX3Byb3BzRXZhbHVhdG9yKGNvbnRleHQ6IE9iamVjdCk6IGFueSB7XHJcbiAgICByZXR1cm4gdGhpcy5fcHJvcHNFdmFsdWF0ZUZuKHRoaXMuX2NvbXB1dGF0aW9uQ2FjaGUsIGNvbnRleHQpO1xyXG4gIH1cclxuXHJcbiAgcHJvdGVjdGVkIF9nZXRQcm9wc0Fzc2lnbmVyKCk6IChjZXNpdW1PYmplY3Q6IE9iamVjdCwgZGVzYzogT2JqZWN0KSA9PiBPYmplY3Qge1xyXG4gICAgcmV0dXJuIChjZXNpdW1PYmplY3Q6IE9iamVjdCwgZGVzYzogT2JqZWN0KSA9PiB0aGlzLl9wcm9wc0Fzc2lnbmVyRm4oY2VzaXVtT2JqZWN0LCBkZXNjKTtcclxuICB9XHJcblxyXG4gIGdldExheWVyU2VydmljZSgpOiBMYXllclNlcnZpY2Uge1xyXG4gICAgcmV0dXJuIHRoaXMuX2xheWVyU2VydmljZTtcclxuICB9XHJcblxyXG4gIHNldExheWVyU2VydmljZShsYXllclNlcnZpY2U6IExheWVyU2VydmljZSkge1xyXG4gICAgdGhpcy5fbGF5ZXJTZXJ2aWNlLnVucmVnaXN0ZXJEZXNjcmlwdGlvbih0aGlzKTtcclxuICAgIHRoaXMuX2xheWVyU2VydmljZSA9IGxheWVyU2VydmljZTtcclxuICAgIHRoaXMuX2xheWVyU2VydmljZS5yZWdpc3RlckRlc2NyaXB0aW9uKHRoaXMpO1xyXG4gICAgdGhpcy5fcHJvcHNFdmFsdWF0ZUZuID0gdGhpcy5fY2VzaXVtUHJvcGVydGllcy5jcmVhdGVFdmFsdWF0b3IodGhpcy5wcm9wcywgdGhpcy5fbGF5ZXJTZXJ2aWNlLmNhY2hlLCB0cnVlKTtcclxuICAgIHRoaXMuX3Byb3BzQXNzaWduZXJGbiA9IHRoaXMuX2Nlc2l1bVByb3BlcnRpZXMuY3JlYXRlQXNzaWduZXIodGhpcy5wcm9wcyk7XHJcbiAgfVxyXG5cclxuICBuZ09uSW5pdCgpOiB2b2lkIHtcclxuICAgIGlmICghdGhpcy5wcm9wcykge1xyXG4gICAgICBjb25zb2xlLmVycm9yKCdhYy1kZXNjIGNvbXBvbmVudHMgZXJyb3I6IFtwcm9wc10gaW5wdXQgaXMgbWFuZGF0b3J5Jyk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5fbGF5ZXJTZXJ2aWNlLnJlZ2lzdGVyRGVzY3JpcHRpb24odGhpcyk7XHJcbiAgICB0aGlzLl9wcm9wc0V2YWx1YXRlRm4gPSB0aGlzLl9jZXNpdW1Qcm9wZXJ0aWVzLmNyZWF0ZUV2YWx1YXRvcih0aGlzLnByb3BzLCB0aGlzLl9sYXllclNlcnZpY2UuY2FjaGUpO1xyXG4gICAgdGhpcy5fcHJvcHNBc3NpZ25lckZuID0gdGhpcy5fY2VzaXVtUHJvcGVydGllcy5jcmVhdGVBc3NpZ25lcih0aGlzLnByb3BzKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBnZXRDZXNpdW1PYmplY3RzTWFwKCk6IE1hcDxzdHJpbmcsIGFueT4ge1xyXG4gICAgcmV0dXJuIHRoaXMuX2Nlc2l1bU9iamVjdHNNYXA7XHJcbiAgfVxyXG5cclxuICBkcmF3KGNvbnRleHQ6IGFueSwgaWQ6IHN0cmluZywgZW50aXR5OiBBY0VudGl0eSk6IHZvaWQge1xyXG4gICAgY29uc3QgY2VzaXVtUHJvcHMgPSB0aGlzLl9wcm9wc0V2YWx1YXRvcihjb250ZXh0KTtcclxuXHJcbiAgICBpZiAoIXRoaXMuX2Nlc2l1bU9iamVjdHNNYXAuaGFzKGlkKSkge1xyXG4gICAgICBjb25zdCBjZXNpdW1PYmplY3QgPSB0aGlzLl9kcmF3ZXIuYWRkKGNlc2l1bVByb3BzKTtcclxuICAgICAgdGhpcy5vbkRyYXcuZW1pdCh7XHJcbiAgICAgICAgYWNFbnRpdHk6IGVudGl0eSxcclxuICAgICAgICBjZXNpdW1FbnRpdHk6IGNlc2l1bU9iamVjdCxcclxuICAgICAgICBlbnRpdHlJZDogaWQsXHJcbiAgICAgIH0pO1xyXG4gICAgICBjZXNpdW1PYmplY3QuYWNFbnRpdHkgPSBlbnRpdHk7IC8vIHNldCB0aGUgZW50aXR5IG9uIHRoZSBjZXNpdW1PYmplY3QgZm9yIGxhdGVyIHVzYWdlXHJcbiAgICAgIHRoaXMuX2Nlc2l1bU9iamVjdHNNYXAuc2V0KGlkLCBjZXNpdW1PYmplY3QpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY29uc3QgY2VzaXVtT2JqZWN0ID0gdGhpcy5fY2VzaXVtT2JqZWN0c01hcC5nZXQoaWQpO1xyXG4gICAgICB0aGlzLm9uRHJhdy5lbWl0KHtcclxuICAgICAgICBhY0VudGl0eTogZW50aXR5LFxyXG4gICAgICAgIGNlc2l1bUVudGl0eTogY2VzaXVtT2JqZWN0LFxyXG4gICAgICAgIGVudGl0eUlkOiBpZCxcclxuICAgICAgfSk7XHJcbiAgICAgIGNlc2l1bU9iamVjdC5hY0VudGl0eSA9IGVudGl0eTsgLy8gc2V0IHRoZSBlbnRpdHkgb24gdGhlIGNlc2l1bU9iamVjdCBmb3IgbGF0ZXIgdXNhZ2VcclxuICAgICAgdGhpcy5fZHJhd2VyLnNldFByb3BzQXNzaWduZXIodGhpcy5fZ2V0UHJvcHNBc3NpZ25lcigpKTtcclxuICAgICAgdGhpcy5fZHJhd2VyLnVwZGF0ZShjZXNpdW1PYmplY3QsIGNlc2l1bVByb3BzKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJlbW92ZShpZDogc3RyaW5nKSB7XHJcbiAgICBjb25zdCBjZXNpdW1PYmplY3QgPSB0aGlzLl9jZXNpdW1PYmplY3RzTWFwLmdldChpZCk7XHJcbiAgICBpZiAoY2VzaXVtT2JqZWN0KSB7XHJcbiAgICAgIHRoaXMub25SZW1vdmUuZW1pdCh7XHJcbiAgICAgICAgYWNFbnRpdHk6IGNlc2l1bU9iamVjdC5hY0VudGl0eSxcclxuICAgICAgICBjZXNpdW1FbnRpdHk6IGNlc2l1bU9iamVjdCxcclxuICAgICAgICBlbnRpdHlJZDogaWQsXHJcbiAgICAgIH0pO1xyXG4gICAgICB0aGlzLl9kcmF3ZXIucmVtb3ZlKGNlc2l1bU9iamVjdCk7XHJcbiAgICAgIHRoaXMuX2Nlc2l1bU9iamVjdHNNYXAuZGVsZXRlKGlkKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJlbW92ZUFsbCgpIHtcclxuICAgIHRoaXMuX2Nlc2l1bU9iamVjdHNNYXAuY2xlYXIoKTtcclxuICAgIHRoaXMuX2RyYXdlci5yZW1vdmVBbGwoKTtcclxuICB9XHJcblxyXG4gIG5nT25EZXN0cm95KCkge1xyXG4gICAgdGhpcy5fbGF5ZXJTZXJ2aWNlLnVucmVnaXN0ZXJEZXNjcmlwdGlvbih0aGlzKTtcclxuICAgIHRoaXMucmVtb3ZlQWxsKCk7XHJcbiAgfVxyXG59XHJcbiJdfQ==