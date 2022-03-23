import { Component, Input } from '@angular/core';
import { buildModuleUrl } from 'cesium';
import { Checker } from '../../utils/checker';
import { MapLayerProviderOptions } from '../../models';
import * as i0 from "@angular/core";
import * as i1 from "../../services/cesium/cesium.service";
/**
 *  This component is used for adding a map provider service to the map (ac-map)
 *  options according to selected map provider MapLayerProviderOptions enum.
 *  additional setting can be done with cesium imageryLayer (exposed as class member)
 *  check out: https://cesiumjs.org/Cesium/Build/Documentation/ImageryLayer.html
 *  and: https://cesiumjs.org/Cesium/Build/Documentation/ImageryLayerCollection.html
 *
 *
 *  __Usage :__
 *  ```
 *    <ac-map-layer-provider [options]="optionsObject" [provider]="myProvider">
 *    </ac-map-layer-provider>
 *  ```
 */
export class AcMapLayerProviderComponent {
    constructor(cesiumService) {
        this.cesiumService = cesiumService;
        /**
         * refer to cesium docs for details https://cesiumjs.org/Cesium/Build/Documentation/ImageryProvider.html
         */
        this.options = {};
        /**
         * the provider
         */
        this.provider = MapLayerProviderOptions.OFFLINE;
        /**
         * show (optional) - Determines if the map layer is shown.
         */
        this.show = true;
        /**
         * The alpha blending value of this layer: 0.0 to 1.0
         */
        this.alpha = 1.0;
        /**
         * The brightness of this layer: 0.0 to 1.0
         */
        this.brightness = 1.0;
        /**
         * The contrast of this layer: 0.0 to 1.0
         */
        this.contrast = 1.0;
        this.imageryLayersCollection = this.cesiumService.getScene().imageryLayers;
    }
    createOfflineMapProvider() {
        return Cesium.createTileMapServiceImageryProvider({
            url: buildModuleUrl('Assets/Textures/NaturalEarthII')
        });
    }
    ngOnInit() {
        if (!Checker.present(this.options.url) && this.provider !== MapLayerProviderOptions.OFFLINE) {
            throw new Error('options must have a url');
        }
        switch (this.provider) {
            case MapLayerProviderOptions.WebMapService:
            case MapLayerProviderOptions.WebMapTileService:
            case MapLayerProviderOptions.ArcGisMapServer:
            case MapLayerProviderOptions.SingleTileImagery:
            case MapLayerProviderOptions.BingMaps:
            case MapLayerProviderOptions.GoogleEarthEnterpriseMaps:
            case MapLayerProviderOptions.MapBox:
            case MapLayerProviderOptions.MapboxStyleImageryProvider:
            case MapLayerProviderOptions.UrlTemplateImagery:
            case MapLayerProviderOptions.MapTileService:
            case MapLayerProviderOptions.OpenStreetMap:
                this.layerProvider = new this.provider(this.options);
                break;
            case MapLayerProviderOptions.OFFLINE:
                this.layerProvider = this.createOfflineMapProvider();
                break;
            default:
                console.log('ac-map-layer-provider: [provider] wasn\'t found. setting OFFLINE provider as default');
                this.layerProvider = this.createOfflineMapProvider();
                break;
        }
        if (this.show) {
            this.imageryLayer = this.imageryLayersCollection.addImageryProvider(this.layerProvider, this.index);
            this.imageryLayer.alpha = this.alpha;
            this.imageryLayer.contrast = this.contrast;
            this.imageryLayer.brightness = this.brightness;
        }
    }
    ngOnChanges(changes) {
        if (changes['show'] && !changes['show'].isFirstChange()) {
            const showValue = changes['show'].currentValue;
            if (showValue) {
                if (this.imageryLayer) {
                    this.imageryLayersCollection.add(this.imageryLayer, this.index);
                }
                else {
                    this.imageryLayer = this.imageryLayersCollection.addImageryProvider(this.layerProvider, this.index);
                    this.imageryLayer.alpha = this.alpha;
                    this.imageryLayer.contrast = this.contrast;
                    this.imageryLayer.brightness = this.brightness;
                }
            }
            else if (this.imageryLayer) {
                this.imageryLayersCollection.remove(this.imageryLayer, false);
            }
        }
        if (changes['alpha'] && !changes['alpha'].isFirstChange() && this.imageryLayer) {
            this.imageryLayer.alpha = this.alpha;
        }
        if (changes['contrast'] && !changes['contrast'].isFirstChange() && this.imageryLayer) {
            this.imageryLayer.contrast = this.contrast;
        }
        if (changes['brightness'] && !changes['brightness'].isFirstChange() && this.imageryLayer) {
            this.imageryLayer.brightness = this.brightness;
        }
    }
    ngOnDestroy() {
        if (this.imageryLayer) {
            this.imageryLayersCollection.remove(this.imageryLayer, true);
        }
    }
}
AcMapLayerProviderComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcMapLayerProviderComponent, deps: [{ token: i1.CesiumService }], target: i0.ɵɵFactoryTarget.Component });
AcMapLayerProviderComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: AcMapLayerProviderComponent, selector: "ac-map-layer-provider", inputs: { options: "options", provider: "provider", index: "index", show: "show", alpha: "alpha", brightness: "brightness", contrast: "contrast" }, usesOnChanges: true, ngImport: i0, template: '', isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcMapLayerProviderComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ac-map-layer-provider',
                    template: '',
                }]
        }], ctorParameters: function () { return [{ type: i1.CesiumService }]; }, propDecorators: { options: [{
                type: Input
            }], provider: [{
                type: Input
            }], index: [{
                type: Input
            }], show: [{
                type: Input
            }], alpha: [{
                type: Input
            }], brightness: [{
                type: Input
            }], contrast: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtbWFwLWxheWVyLXByb3ZpZGVyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9saWIvYW5ndWxhci1jZXNpdW0vY29tcG9uZW50cy9hYy1tYXAtbGF5ZXItcHJvdmlkZXIvYWMtbWFwLWxheWVyLXByb3ZpZGVyLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBK0MsTUFBTSxlQUFlLENBQUM7QUFDOUYsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLFFBQVEsQ0FBQztBQUV4QyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDOUMsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sY0FBYyxDQUFDOzs7QUFHdkQ7Ozs7Ozs7Ozs7Ozs7R0FhRztBQUtILE1BQU0sT0FBTywyQkFBMkI7SUFnRHRDLFlBQW9CLGFBQTRCO1FBQTVCLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBOUNoRDs7V0FFRztRQUVILFlBQU8sR0FBcUIsRUFBRSxDQUFDO1FBRS9COztXQUVHO1FBRUgsYUFBUSxHQUFRLHVCQUF1QixDQUFDLE9BQU8sQ0FBQztRQVFoRDs7V0FFRztRQUVILFNBQUksR0FBRyxJQUFJLENBQUM7UUFFWjs7V0FFRztRQUVILFVBQUssR0FBRyxHQUFHLENBQUM7UUFFWjs7V0FFRztRQUVILGVBQVUsR0FBRyxHQUFHLENBQUM7UUFFakI7O1dBRUc7UUFFSCxhQUFRLEdBQUcsR0FBRyxDQUFDO1FBT2IsSUFBSSxDQUFDLHVCQUF1QixHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFLENBQUMsYUFBYSxDQUFDO0lBQzdFLENBQUM7SUFFTyx3QkFBd0I7UUFDOUIsT0FBTyxNQUFNLENBQUMsbUNBQW1DLENBQUM7WUFDaEQsR0FBRyxFQUFFLGNBQWMsQ0FBQyxnQ0FBZ0MsQ0FBQztTQUN0RCxDQUFD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UCxLQUFLO2dCQU9OLEtBQUs7c0JBREosS0FBSztnQkFPTixJQUFJO3NCQURILEtBQUs7Z0JBT04sS0FBSztzQkFESixLQUFLO2dCQU9OLFVBQVU7c0JBRFQsS0FBSztnQkFPTixRQUFRO3NCQURQLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIElucHV0LCBPbkNoYW5nZXMsIE9uRGVzdHJveSwgT25Jbml0LCBTaW1wbGVDaGFuZ2VzIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IGJ1aWxkTW9kdWxlVXJsIH0gZnJvbSAnY2VzaXVtJztcclxuaW1wb3J0IHsgQ2VzaXVtU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2Nlc2l1bS9jZXNpdW0uc2VydmljZSc7XHJcbmltcG9ydCB7IENoZWNrZXIgfSBmcm9tICcuLi8uLi91dGlscy9jaGVja2VyJztcclxuaW1wb3J0IHsgTWFwTGF5ZXJQcm92aWRlck9wdGlvbnMgfSBmcm9tICcuLi8uLi9tb2RlbHMnO1xyXG5kZWNsYXJlIHZhciBDZXNpdW06IGFueTtcclxuXHJcbi8qKlxyXG4gKiAgVGhpcyBjb21wb25lbnQgaXMgdXNlZCBmb3IgYWRkaW5nIGEgbWFwIHByb3ZpZGVyIHNlcnZpY2UgdG8gdGhlIG1hcCAoYWMtbWFwKVxyXG4gKiAgb3B0aW9ucyBhY2NvcmRpbmcgdG8gc2VsZWN0ZWQgbWFwIHByb3ZpZGVyIE1hcExheWVyUHJvdmlkZXJPcHRpb25zIGVudW0uXHJcbiAqICBhZGRpdGlvbmFsIHNldHRpbmcgY2FuIGJlIGRvbmUgd2l0aCBjZXNpdW0gaW1hZ2VyeUxheWVyIChleHBvc2VkIGFzIGNsYXNzIG1lbWJlcilcclxuICogIGNoZWNrIG91dDogaHR0cHM6Ly9jZXNpdW1qcy5vcmcvQ2VzaXVtL0J1aWxkL0RvY3VtZW50YXRpb24vSW1hZ2VyeUxheWVyLmh0bWxcclxuICogIGFuZDogaHR0cHM6Ly9jZXNpdW1qcy5vcmcvQ2VzaXVtL0J1aWxkL0RvY3VtZW50YXRpb24vSW1hZ2VyeUxheWVyQ29sbGVjdGlvbi5odG1sXHJcbiAqXHJcbiAqXHJcbiAqICBfX1VzYWdlIDpfX1xyXG4gKiAgYGBgXHJcbiAqICAgIDxhYy1tYXAtbGF5ZXItcHJvdmlkZXIgW29wdGlvbnNdPVwib3B0aW9uc09iamVjdFwiIFtwcm92aWRlcl09XCJteVByb3ZpZGVyXCI+XHJcbiAqICAgIDwvYWMtbWFwLWxheWVyLXByb3ZpZGVyPlxyXG4gKiAgYGBgXHJcbiAqL1xyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2FjLW1hcC1sYXllci1wcm92aWRlcicsXHJcbiAgdGVtcGxhdGU6ICcnLFxyXG59KVxyXG5leHBvcnQgY2xhc3MgQWNNYXBMYXllclByb3ZpZGVyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMsIE9uRGVzdHJveSB7XHJcblxyXG4gIC8qKlxyXG4gICAqIHJlZmVyIHRvIGNlc2l1bSBkb2NzIGZvciBkZXRhaWxzIGh0dHBzOi8vY2VzaXVtanMub3JnL0Nlc2l1bS9CdWlsZC9Eb2N1bWVudGF0aW9uL0ltYWdlcnlQcm92aWRlci5odG1sXHJcbiAgICovXHJcbiAgQElucHV0KClcclxuICBvcHRpb25zOiB7IHVybD86IHN0cmluZyB9ID0ge307XHJcblxyXG4gIC8qKlxyXG4gICAqIHRoZSBwcm92aWRlclxyXG4gICAqL1xyXG4gIEBJbnB1dCgpXHJcbiAgcHJvdmlkZXI6IGFueSA9IE1hcExheWVyUHJvdmlkZXJPcHRpb25zLk9GRkxJTkU7XHJcblxyXG4gIC8qKlxyXG4gICAqIGluZGV4IChvcHRpb25hbCkgLSBUaGUgaW5kZXggdG8gYWRkIHRoZSBsYXllciBhdC4gSWYgb21pdHRlZCwgdGhlIGxheWVyIHdpbGwgYWRkZWQgb24gdG9wIG9mIGFsbCBleGlzdGluZyBsYXllcnMuXHJcbiAgICovXHJcbiAgQElucHV0KClcclxuICBpbmRleDogTnVtYmVyO1xyXG5cclxuICAvKipcclxuICAgKiBzaG93IChvcHRpb25hbCkgLSBEZXRlcm1pbmVzIGlmIHRoZSBtYXAgbGF5ZXIgaXMgc2hvd24uXHJcbiAgICovXHJcbiAgQElucHV0KClcclxuICBzaG93ID0gdHJ1ZTtcclxuXHJcbiAgLyoqXHJcbiAgICogVGhlIGFscGhhIGJsZW5kaW5nIHZhbHVlIG9mIHRoaXMgbGF5ZXI6IDAuMCB0byAxLjBcclxuICAgKi9cclxuICBASW5wdXQoKVxyXG4gIGFscGhhID0gMS4wO1xyXG5cclxuICAvKipcclxuICAgKiBUaGUgYnJpZ2h0bmVzcyBvZiB0aGlzIGxheWVyOiAwLjAgdG8gMS4wXHJcbiAgICovXHJcbiAgQElucHV0KClcclxuICBicmlnaHRuZXNzID0gMS4wO1xyXG5cclxuICAvKipcclxuICAgKiBUaGUgY29udHJhc3Qgb2YgdGhpcyBsYXllcjogMC4wIHRvIDEuMFxyXG4gICAqL1xyXG4gIEBJbnB1dCgpXHJcbiAgY29udHJhc3QgPSAxLjA7XHJcblxyXG4gIHB1YmxpYyBpbWFnZXJ5TGF5ZXI6IGFueTtcclxuICBwdWJsaWMgaW1hZ2VyeUxheWVyc0NvbGxlY3Rpb246IGFueTtcclxuICBwdWJsaWMgbGF5ZXJQcm92aWRlcjogYW55O1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGNlc2l1bVNlcnZpY2U6IENlc2l1bVNlcnZpY2UpIHtcclxuICAgIHRoaXMuaW1hZ2VyeUxheWVyc0NvbGxlY3Rpb24gPSB0aGlzLmNlc2l1bVNlcnZpY2UuZ2V0U2NlbmUoKS5pbWFnZXJ5TGF5ZXJzO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBjcmVhdGVPZmZsaW5lTWFwUHJvdmlkZXIoKSB7XHJcbiAgICByZXR1cm4gQ2VzaXVtLmNyZWF0ZVRpbGVNYXBTZXJ2aWNlSW1hZ2VyeVByb3ZpZGVyKHtcclxuICAgICAgdXJsOiBidWlsZE1vZHVsZVVybCgnQXNzZXRzL1RleHR1cmVzL05hdHVyYWxFYXJ0aElJJylcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgbmdPbkluaXQoKSB7XHJcbiAgICBpZiAoIUNoZWNrZXIucHJlc2VudCh0aGlzLm9wdGlvbnMudXJsKSAmJiB0aGlzLnByb3ZpZGVyICE9PSBNYXBMYXllclByb3ZpZGVyT3B0aW9ucy5PRkZMSU5FKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignb3B0aW9ucyBtdXN0IGhhdmUgYSB1cmwnKTtcclxuICAgIH1cclxuICAgIHN3aXRjaCAodGhpcy5wcm92aWRlcikge1xyXG4gICAgICBjYXNlIE1hcExheWVyUHJvdmlkZXJPcHRpb25zLldlYk1hcFNlcnZpY2U6XHJcbiAgICAgIGNhc2UgTWFwTGF5ZXJQcm92aWRlck9wdGlvbnMuV2ViTWFwVGlsZVNlcnZpY2U6XHJcbiAgICAgIGNhc2UgTWFwTGF5ZXJQcm92aWRlck9wdGlvbnMuQXJjR2lzTWFwU2VydmVyOlxyXG4gICAgICBjYXNlIE1hcExheWVyUHJvdmlkZXJPcHRpb25zLlNpbmdsZVRpbGVJbWFnZXJ5OlxyXG4gICAgICBjYXNlIE1hcExheWVyUHJvdmlkZXJPcHRpb25zLkJpbmdNYXBzOlxyXG4gICAgICBjYXNlIE1hcExheWVyUHJvdmlkZXJPcHRpb25zLkdvb2dsZUVhcnRoRW50ZXJwcmlzZU1hcHM6XHJcbiAgICAgIGNhc2UgTWFwTGF5ZXJQcm92aWRlck9wdGlvbnMuTWFwQm94OlxyXG4gICAgICBjYXNlIE1hcExheWVyUHJvdmlkZXJPcHRpb25zLk1hcGJveFN0eWxlSW1hZ2VyeVByb3ZpZGVyOlxyXG4gICAgICBjYXNlIE1hcExheWVyUHJvdmlkZXJPcHRpb25zLlVybFRlbXBsYXRlSW1hZ2VyeTpcclxuICAgICAgY2FzZSBNYXBMYXllclByb3ZpZGVyT3B0aW9ucy5NYXBUaWxlU2VydmljZTpcclxuICAgICAgY2FzZSBNYXBMYXllclByb3ZpZGVyT3B0aW9ucy5PcGVuU3RyZWV0TWFwOlxyXG4gICAgICAgIHRoaXMubGF5ZXJQcm92aWRlciA9IG5ldyB0aGlzLnByb3ZpZGVyKHRoaXMub3B0aW9ucyk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgTWFwTGF5ZXJQcm92aWRlck9wdGlvbnMuT0ZGTElORTpcclxuICAgICAgICB0aGlzLmxheWVyUHJvdmlkZXIgPSB0aGlzLmNyZWF0ZU9mZmxpbmVNYXBQcm92aWRlcigpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBkZWZhdWx0OlxyXG4gICAgICAgIGNvbnNvbGUubG9nKCdhYy1tYXAtbGF5ZXItcHJvdmlkZXI6IFtwcm92aWRlcl0gd2FzblxcJ3QgZm91bmQuIHNldHRpbmcgT0ZGTElORSBwcm92aWRlciBhcyBkZWZhdWx0Jyk7XHJcbiAgICAgICAgdGhpcy5sYXllclByb3ZpZGVyID0gdGhpcy5jcmVhdGVPZmZsaW5lTWFwUHJvdmlkZXIoKTtcclxuICAgICAgICBicmVhaztcclxuICAgIH1cclxuICAgIGlmICh0aGlzLnNob3cpIHtcclxuICAgICAgdGhpcy5pbWFnZXJ5TGF5ZXIgPSB0aGlzLmltYWdlcnlMYXllcnNDb2xsZWN0aW9uLmFkZEltYWdlcnlQcm92aWRlcih0aGlzLmxheWVyUHJvdmlkZXIsIHRoaXMuaW5kZXgpO1xyXG4gICAgICB0aGlzLmltYWdlcnlMYXllci5hbHBoYSA9IHRoaXMuYWxwaGE7XHJcbiAgICAgIHRoaXMuaW1hZ2VyeUxheWVyLmNvbnRyYXN0ID0gdGhpcy5jb250cmFzdDtcclxuICAgICAgdGhpcy5pbWFnZXJ5TGF5ZXIuYnJpZ2h0bmVzcyA9IHRoaXMuYnJpZ2h0bmVzcztcclxuICAgIH1cclxuICB9XHJcblxyXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcclxuICAgIGlmIChjaGFuZ2VzWydzaG93J10gJiYgIWNoYW5nZXNbJ3Nob3cnXS5pc0ZpcnN0Q2hhbmdlKCkpIHtcclxuICAgICAgY29uc3Qgc2hvd1ZhbHVlID0gY2hhbmdlc1snc2hvdyddLmN1cnJlbnRWYWx1ZTtcclxuICAgICAgaWYgKHNob3dWYWx1ZSkge1xyXG4gICAgICAgIGlmICh0aGlzLmltYWdlcnlMYXllcikge1xyXG4gICAgICAgICAgdGhpcy5pbWFnZXJ5TGF5ZXJzQ29sbGVjdGlvbi5hZGQodGhpcy5pbWFnZXJ5TGF5ZXIsIHRoaXMuaW5kZXgpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLmltYWdlcnlMYXllciA9IHRoaXMuaW1hZ2VyeUxheWVyc0NvbGxlY3Rpb24uYWRkSW1hZ2VyeVByb3ZpZGVyKHRoaXMubGF5ZXJQcm92aWRlciwgdGhpcy5pbmRleCk7XHJcbiAgICAgICAgICB0aGlzLmltYWdlcnlMYXllci5hbHBoYSA9IHRoaXMuYWxwaGE7XHJcbiAgICAgICAgICB0aGlzLmltYWdlcnlMYXllci5jb250cmFzdCA9IHRoaXMuY29udHJhc3Q7XHJcbiAgICAgICAgICB0aGlzLmltYWdlcnlMYXllci5icmlnaHRuZXNzID0gdGhpcy5icmlnaHRuZXNzO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIGlmICh0aGlzLmltYWdlcnlMYXllcikge1xyXG4gICAgICAgIHRoaXMuaW1hZ2VyeUxheWVyc0NvbGxlY3Rpb24ucmVtb3ZlKHRoaXMuaW1hZ2VyeUxheWVyLCBmYWxzZSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAoY2hhbmdlc1snYWxwaGEnXSAmJiAhY2hhbmdlc1snYWxwaGEnXS5pc0ZpcnN0Q2hhbmdlKCkgJiYgdGhpcy5pbWFnZXJ5TGF5ZXIpIHtcclxuICAgICAgdGhpcy5pbWFnZXJ5TGF5ZXIuYWxwaGEgPSB0aGlzLmFscGhhO1xyXG4gICAgfVxyXG4gICAgaWYgKGNoYW5nZXNbJ2NvbnRyYXN0J10gJiYgIWNoYW5nZXNbJ2NvbnRyYXN0J10uaXNGaXJzdENoYW5nZSgpICYmIHRoaXMuaW1hZ2VyeUxheWVyKSB7XHJcbiAgICAgIHRoaXMuaW1hZ2VyeUxheWVyLmNvbnRyYXN0ID0gdGhpcy5jb250cmFzdDtcclxuICAgIH1cclxuICAgIGlmIChjaGFuZ2VzWydicmlnaHRuZXNzJ10gJiYgIWNoYW5nZXNbJ2JyaWdodG5lc3MnXS5pc0ZpcnN0Q2hhbmdlKCkgJiYgdGhpcy5pbWFnZXJ5TGF5ZXIpIHtcclxuICAgICAgdGhpcy5pbWFnZXJ5TGF5ZXIuYnJpZ2h0bmVzcyA9IHRoaXMuYnJpZ2h0bmVzcztcclxuICAgIH1cclxuICB9XHJcblxyXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xyXG4gICAgaWYgKHRoaXMuaW1hZ2VyeUxheWVyKSB7XHJcbiAgICAgIHRoaXMuaW1hZ2VyeUxheWVyc0NvbGxlY3Rpb24ucmVtb3ZlKHRoaXMuaW1hZ2VyeUxheWVyLCB0cnVlKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIl19