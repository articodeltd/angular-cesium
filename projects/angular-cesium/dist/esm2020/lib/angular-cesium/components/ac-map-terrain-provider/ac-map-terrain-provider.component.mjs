import { Component, Input } from '@angular/core';
import { Checker } from '../../utils/checker';
import { MapTerrainProviderOptions } from '../../models/map-terrain-provider-options.enum';
import * as i0 from "@angular/core";
import * as i1 from "../../services/cesium/cesium.service";
/**
 *  This component is used for adding a terrain provider service to the map (ac-map)
 *  options according to selected terrain provider MapTerrainProviderOptions enum.
 *
 *
 *  __Usage :__
 *  ```
 *    <ac-map-terrain-provider [options]="optionsObject" [provider]="myProvider">
 *    </ac-map-terrain-provider>
 *  ```
 */
export class AcMapTerrainProviderComponent {
    constructor(cesiumService) {
        this.cesiumService = cesiumService;
        /**
         * refer to cesium docs for details https://cesiumjs.org/Cesium/Build/Documentation/TerrainProvider.html
         */
        this.options = {};
        /**
         * show (optional) - Determines if the map layer is shown.
         */
        this.show = true;
    }
    ngOnInit() {
        if (!Checker.present(this.options.url)
            && this.provider !== MapTerrainProviderOptions.Ellipsoid
            && this.provider !== MapTerrainProviderOptions.WorldTerrain) {
            throw new Error('options must have a url');
        }
        this.defaultTerrainProvider = this.cesiumService.getViewer().terrainProvider;
        switch (this.provider) {
            case MapTerrainProviderOptions.CesiumTerrain:
            case MapTerrainProviderOptions.ArcGISTiledElevation:
            case MapTerrainProviderOptions.GoogleEarthEnterprise:
            case MapTerrainProviderOptions.VRTheWorld:
            case MapTerrainProviderOptions.Ellipsoid:
                this.terrainProvider = new this.provider(this.options);
                break;
            case MapTerrainProviderOptions.WorldTerrain:
                this.terrainProvider = this.provider(this.options);
                break;
            default:
                console.log('ac-map-terrain-provider: [provider] wasn\'t found. setting OFFLINE provider as default');
                this.terrainProvider = this.defaultTerrainProvider;
                break;
        }
        if (this.show) {
            this.cesiumService.getViewer().terrainProvider = this.terrainProvider;
        }
    }
    ngOnChanges(changes) {
        if (changes['show'] && !changes['show'].isFirstChange()) {
            const showValue = changes['show'].currentValue;
            if (showValue) {
                if (this.terrainProvider) {
                    this.cesiumService.getViewer().terrainProvider = this.terrainProvider;
                }
            }
            else {
                this.cesiumService.getViewer().terrainProvider = this.defaultTerrainProvider;
            }
        }
    }
    ngOnDestroy() {
        this.cesiumService.getViewer().terrainProvider = this.defaultTerrainProvider;
    }
}
AcMapTerrainProviderComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcMapTerrainProviderComponent, deps: [{ token: i1.CesiumService }], target: i0.ɵɵFactoryTarget.Component });
AcMapTerrainProviderComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: AcMapTerrainProviderComponent, selector: "ac-map-terrain-provider", inputs: { options: "options", provider: "provider", show: "show" }, usesOnChanges: true, ngImport: i0, template: '', isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcMapTerrainProviderComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ac-map-terrain-provider',
                    template: '',
                }]
        }], ctorParameters: function () { return [{ type: i1.CesiumService }]; }, propDecorators: { options: [{
                type: Input
            }], provider: [{
                type: Input
            }], show: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtbWFwLXRlcnJhaW4tcHJvdmlkZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2xpYi9hbmd1bGFyLWNlc2l1bS9jb21wb25lbnRzL2FjLW1hcC10ZXJyYWluLXByb3ZpZGVyL2FjLW1hcC10ZXJyYWluLXByb3ZpZGVyLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFVLEtBQUssRUFBdUMsTUFBTSxlQUFlLENBQUM7QUFFOUYsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQzlDLE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxNQUFNLGdEQUFnRCxDQUFDOzs7QUFFM0Y7Ozs7Ozs7Ozs7R0FVRztBQUtILE1BQU0sT0FBTyw2QkFBNkI7SUF1QnhDLFlBQW9CLGFBQTRCO1FBQTVCLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBckJoRDs7V0FFRztRQUVILFlBQU8sR0FBcUIsRUFBRSxDQUFDO1FBUS9COztXQUVHO1FBRUgsU0FBSSxHQUFHLElBQUksQ0FBQztJQU1aLENBQUM7SUFFRCxRQUFRO1FBQ04sSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUM7ZUFDakMsSUFBSSxDQUFDLFFBQVEsS0FBSyx5QkFBeUIsQ0FBQyxTQUFTO2VBQ3JELElBQUksQ0FBQyxRQUFRLEtBQUsseUJBQXlCLENBQUMsWUFBWSxFQUFFO1lBQzdELE1BQU0sSUFBSSxLQUFLLENBQUMseUJBQXlCLENBQUMsQ0FBQztTQUM1QztRQUNELElBQUksQ0FBQyxzQkFBc0IsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsRUFBRSxDQUFDLGVBQWUsQ0FBQztRQUM3RSxRQUFRLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDckIsS0FBSyx5QkFBeUIsQ0FBQyxhQUFhLENBQUM7WUFDN0MsS0FBSyx5QkFBeUIsQ0FBQyxvQkFBb0IsQ0FBQztZQUNwRCxLQUFLLHlCQUF5QixDQUFDLHFCQUFxQixDQUFDO1lBQ3JELEtBQUsseUJBQXlCLENBQUMsVUFBVSxDQUFDO1lBQzFDLEtBQUsseUJBQXlCLENBQUMsU0FBUztnQkFDdEMsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUN2RCxNQUFNO1lBQ1IsS0FBSyx5QkFBeUIsQ0FBQyxZQUFZO2dCQUN6QyxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUNuRCxNQUFNO1lBQ1I7Z0JBQ0UsT0FBTyxDQUFDLEdBQUcsQ0FBQyx3RkFBd0YsQ0FBQyxDQUFDO2dCQUN0RyxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxzQkFBc0IsQ0FBQztnQkFDbkQsTUFBTTtTQUNUO1FBQ0QsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQ2IsSUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQztTQUN2RTtJQUNILENBQUM7SUFFRCxXQUFXLENBQUMsT0FBc0I7UUFDaEMsSUFBSSxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsYUFBYSxFQUFFLEVBQUU7WUFDdkQsTUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFlBQVksQ0FBQztZQUMvQyxJQUFJLFNBQVMsRUFBRTtnQkFDYixJQUFJLElBQUksQ0FBQyxlQUFlLEVBQUU7b0JBQ3hCLElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxFQUFFLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUM7aUJBQ3ZFO2FBQ0Y7aUJBQU07Z0JBQ0wsSUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLHNCQUFzQixDQUFDO2FBQzlFO1NBQ0Y7SUFDSCxDQUFDO0lBRUQsV0FBVztRQUNULElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxFQUFFLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxzQkFBc0IsQ0FBQztJQUMvRSxDQUFDOzswSEFyRVUsNkJBQTZCOzhHQUE3Qiw2QkFBNkIsd0pBRjlCLEVBQUU7MkZBRUQsNkJBQTZCO2tCQUp6QyxTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSx5QkFBeUI7b0JBQ25DLFFBQVEsRUFBRSxFQUFFO2lCQUNiO29HQU9DLE9BQU87c0JBRE4sS0FBSztnQkFPTixRQUFRO3NCQURQLEtBQUs7Z0JBT04sSUFBSTtzQkFESCxLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIElucHV0LCBPbkNoYW5nZXMsIFNpbXBsZUNoYW5nZXMsIE9uRGVzdHJveSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBDZXNpdW1TZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvY2VzaXVtL2Nlc2l1bS5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQ2hlY2tlciB9IGZyb20gJy4uLy4uL3V0aWxzL2NoZWNrZXInO1xyXG5pbXBvcnQgeyBNYXBUZXJyYWluUHJvdmlkZXJPcHRpb25zIH0gZnJvbSAnLi4vLi4vbW9kZWxzL21hcC10ZXJyYWluLXByb3ZpZGVyLW9wdGlvbnMuZW51bSc7XHJcblxyXG4vKipcclxuICogIFRoaXMgY29tcG9uZW50IGlzIHVzZWQgZm9yIGFkZGluZyBhIHRlcnJhaW4gcHJvdmlkZXIgc2VydmljZSB0byB0aGUgbWFwIChhYy1tYXApXHJcbiAqICBvcHRpb25zIGFjY29yZGluZyB0byBzZWxlY3RlZCB0ZXJyYWluIHByb3ZpZGVyIE1hcFRlcnJhaW5Qcm92aWRlck9wdGlvbnMgZW51bS5cclxuICpcclxuICpcclxuICogIF9fVXNhZ2UgOl9fXHJcbiAqICBgYGBcclxuICogICAgPGFjLW1hcC10ZXJyYWluLXByb3ZpZGVyIFtvcHRpb25zXT1cIm9wdGlvbnNPYmplY3RcIiBbcHJvdmlkZXJdPVwibXlQcm92aWRlclwiPlxyXG4gKiAgICA8L2FjLW1hcC10ZXJyYWluLXByb3ZpZGVyPlxyXG4gKiAgYGBgXHJcbiAqL1xyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2FjLW1hcC10ZXJyYWluLXByb3ZpZGVyJyxcclxuICB0ZW1wbGF0ZTogJycsXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBBY01hcFRlcnJhaW5Qcm92aWRlckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3kge1xyXG5cclxuICAvKipcclxuICAgKiByZWZlciB0byBjZXNpdW0gZG9jcyBmb3IgZGV0YWlscyBodHRwczovL2Nlc2l1bWpzLm9yZy9DZXNpdW0vQnVpbGQvRG9jdW1lbnRhdGlvbi9UZXJyYWluUHJvdmlkZXIuaHRtbFxyXG4gICAqL1xyXG4gIEBJbnB1dCgpXHJcbiAgb3B0aW9uczogeyB1cmw/OiBzdHJpbmcgfSA9IHt9O1xyXG5cclxuICAvKipcclxuICAgKiB0aGUgcHJvdmlkZXJcclxuICAgKi9cclxuICBASW5wdXQoKVxyXG4gIHByb3ZpZGVyOiBhbnk7XHJcblxyXG4gIC8qKlxyXG4gICAqIHNob3cgKG9wdGlvbmFsKSAtIERldGVybWluZXMgaWYgdGhlIG1hcCBsYXllciBpcyBzaG93bi5cclxuICAgKi9cclxuICBASW5wdXQoKVxyXG4gIHNob3cgPSB0cnVlO1xyXG5cclxuICBwcml2YXRlIHRlcnJhaW5Qcm92aWRlcjogYW55O1xyXG4gIHByaXZhdGUgZGVmYXVsdFRlcnJhaW5Qcm92aWRlcjogYW55O1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGNlc2l1bVNlcnZpY2U6IENlc2l1bVNlcnZpY2UpIHtcclxuICB9XHJcblxyXG4gIG5nT25Jbml0KCk6IHZvaWQge1xyXG4gICAgaWYgKCFDaGVja2VyLnByZXNlbnQodGhpcy5vcHRpb25zLnVybClcclxuICAgICAgJiYgdGhpcy5wcm92aWRlciAhPT0gTWFwVGVycmFpblByb3ZpZGVyT3B0aW9ucy5FbGxpcHNvaWRcclxuICAgICAgJiYgdGhpcy5wcm92aWRlciAhPT0gTWFwVGVycmFpblByb3ZpZGVyT3B0aW9ucy5Xb3JsZFRlcnJhaW4pIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdvcHRpb25zIG11c3QgaGF2ZSBhIHVybCcpO1xyXG4gICAgfVxyXG4gICAgdGhpcy5kZWZhdWx0VGVycmFpblByb3ZpZGVyID0gdGhpcy5jZXNpdW1TZXJ2aWNlLmdldFZpZXdlcigpLnRlcnJhaW5Qcm92aWRlcjtcclxuICAgIHN3aXRjaCAodGhpcy5wcm92aWRlcikge1xyXG4gICAgICBjYXNlIE1hcFRlcnJhaW5Qcm92aWRlck9wdGlvbnMuQ2VzaXVtVGVycmFpbjpcclxuICAgICAgY2FzZSBNYXBUZXJyYWluUHJvdmlkZXJPcHRpb25zLkFyY0dJU1RpbGVkRWxldmF0aW9uOlxyXG4gICAgICBjYXNlIE1hcFRlcnJhaW5Qcm92aWRlck9wdGlvbnMuR29vZ2xlRWFydGhFbnRlcnByaXNlOlxyXG4gICAgICBjYXNlIE1hcFRlcnJhaW5Qcm92aWRlck9wdGlvbnMuVlJUaGVXb3JsZDpcclxuICAgICAgY2FzZSBNYXBUZXJyYWluUHJvdmlkZXJPcHRpb25zLkVsbGlwc29pZDpcclxuICAgICAgICB0aGlzLnRlcnJhaW5Qcm92aWRlciA9IG5ldyB0aGlzLnByb3ZpZGVyKHRoaXMub3B0aW9ucyk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgTWFwVGVycmFpblByb3ZpZGVyT3B0aW9ucy5Xb3JsZFRlcnJhaW46XHJcbiAgICAgICAgdGhpcy50ZXJyYWluUHJvdmlkZXIgPSB0aGlzLnByb3ZpZGVyKHRoaXMub3B0aW9ucyk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgY29uc29sZS5sb2coJ2FjLW1hcC10ZXJyYWluLXByb3ZpZGVyOiBbcHJvdmlkZXJdIHdhc25cXCd0IGZvdW5kLiBzZXR0aW5nIE9GRkxJTkUgcHJvdmlkZXIgYXMgZGVmYXVsdCcpO1xyXG4gICAgICAgIHRoaXMudGVycmFpblByb3ZpZGVyID0gdGhpcy5kZWZhdWx0VGVycmFpblByb3ZpZGVyO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gICAgaWYgKHRoaXMuc2hvdykge1xyXG4gICAgICB0aGlzLmNlc2l1bVNlcnZpY2UuZ2V0Vmlld2VyKCkudGVycmFpblByb3ZpZGVyID0gdGhpcy50ZXJyYWluUHJvdmlkZXI7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XHJcbiAgICBpZiAoY2hhbmdlc1snc2hvdyddICYmICFjaGFuZ2VzWydzaG93J10uaXNGaXJzdENoYW5nZSgpKSB7XHJcbiAgICAgIGNvbnN0IHNob3dWYWx1ZSA9IGNoYW5nZXNbJ3Nob3cnXS5jdXJyZW50VmFsdWU7XHJcbiAgICAgIGlmIChzaG93VmFsdWUpIHtcclxuICAgICAgICBpZiAodGhpcy50ZXJyYWluUHJvdmlkZXIpIHtcclxuICAgICAgICAgIHRoaXMuY2VzaXVtU2VydmljZS5nZXRWaWV3ZXIoKS50ZXJyYWluUHJvdmlkZXIgPSB0aGlzLnRlcnJhaW5Qcm92aWRlcjtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5jZXNpdW1TZXJ2aWNlLmdldFZpZXdlcigpLnRlcnJhaW5Qcm92aWRlciA9IHRoaXMuZGVmYXVsdFRlcnJhaW5Qcm92aWRlcjtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XHJcbiAgICB0aGlzLmNlc2l1bVNlcnZpY2UuZ2V0Vmlld2VyKCkudGVycmFpblByb3ZpZGVyID0gdGhpcy5kZWZhdWx0VGVycmFpblByb3ZpZGVyO1xyXG4gIH1cclxufVxyXG4iXX0=