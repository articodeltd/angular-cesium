import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../cesium/cesium.service";
/**
 * Take screenshot of your cesium globe.
 *
 * usage:
 * ```typescript
 * // get base 64 data url
 * const dataUrl = screenshotService.getMapScreenshotDataUrl();
 *
 * // or download as png
 * screenshotService.downloadMapScreenshot('my-map.png');
 *
 * ```
 *
 */
export class ScreenshotService {
    constructor(cesiumService) {
        this.cesiumService = cesiumService;
    }
    getMapScreenshotDataUrlBase64() {
        const canvas = this.cesiumService.getCanvas();
        return canvas.toDataURL();
    }
    downloadMapScreenshot(filename = 'map.png') {
        const dataUrl = this.getMapScreenshotDataUrlBase64();
        this.downloadURI(dataUrl, filename);
    }
    downloadURI(uri, name) {
        const link = document.createElement('a');
        link.download = name;
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}
ScreenshotService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: ScreenshotService, deps: [{ token: i1.CesiumService }], target: i0.ɵɵFactoryTarget.Injectable });
ScreenshotService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: ScreenshotService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: ScreenshotService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.CesiumService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NyZWVuc2hvdC5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2xpYi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9zY3JlZW5zaG90L3NjcmVlbnNob3Quc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDOzs7QUFHM0M7Ozs7Ozs7Ozs7Ozs7R0FhRztBQUVILE1BQU0sT0FBTyxpQkFBaUI7SUFDNUIsWUFBb0IsYUFBNEI7UUFBNUIsa0JBQWEsR0FBYixhQUFhLENBQWU7SUFDaEQsQ0FBQztJQUVELDZCQUE2QjtRQUMzQixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQzlDLE9BQU8sTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQzVCLENBQUM7SUFHRCxxQkFBcUIsQ0FBQyxRQUFRLEdBQUcsU0FBUztRQUN4QyxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsNkJBQTZCLEVBQUUsQ0FBQztRQUNyRCxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztJQUN0QyxDQUFDO0lBRU8sV0FBVyxDQUFDLEdBQVcsRUFBRSxJQUFZO1FBQzNDLE1BQU0sSUFBSSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDekMsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7UUFDckIsSUFBSSxDQUFDLElBQUksR0FBRyxHQUFHLENBQUM7UUFDaEIsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDaEMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ2IsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDbEMsQ0FBQzs7OEdBdEJVLGlCQUFpQjtrSEFBakIsaUJBQWlCOzJGQUFqQixpQkFBaUI7a0JBRDdCLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IENlc2l1bVNlcnZpY2UgfSBmcm9tICcuLi9jZXNpdW0vY2VzaXVtLnNlcnZpY2UnO1xyXG5cclxuLyoqXHJcbiAqIFRha2Ugc2NyZWVuc2hvdCBvZiB5b3VyIGNlc2l1bSBnbG9iZS5cclxuICpcclxuICogdXNhZ2U6XHJcbiAqIGBgYHR5cGVzY3JpcHRcclxuICogLy8gZ2V0IGJhc2UgNjQgZGF0YSB1cmxcclxuICogY29uc3QgZGF0YVVybCA9IHNjcmVlbnNob3RTZXJ2aWNlLmdldE1hcFNjcmVlbnNob3REYXRhVXJsKCk7XHJcbiAqXHJcbiAqIC8vIG9yIGRvd25sb2FkIGFzIHBuZ1xyXG4gKiBzY3JlZW5zaG90U2VydmljZS5kb3dubG9hZE1hcFNjcmVlbnNob3QoJ215LW1hcC5wbmcnKTtcclxuICpcclxuICogYGBgXHJcbiAqXHJcbiAqL1xyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBTY3JlZW5zaG90U2VydmljZSB7XHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBjZXNpdW1TZXJ2aWNlOiBDZXNpdW1TZXJ2aWNlKSB7XHJcbiAgfVxyXG5cclxuICBnZXRNYXBTY3JlZW5zaG90RGF0YVVybEJhc2U2NCgpIHtcclxuICAgIGNvbnN0IGNhbnZhcyA9IHRoaXMuY2VzaXVtU2VydmljZS5nZXRDYW52YXMoKTtcclxuICAgIHJldHVybiBjYW52YXMudG9EYXRhVVJMKCk7XHJcbiAgfVxyXG5cclxuXHJcbiAgZG93bmxvYWRNYXBTY3JlZW5zaG90KGZpbGVuYW1lID0gJ21hcC5wbmcnKSB7XHJcbiAgICBjb25zdCBkYXRhVXJsID0gdGhpcy5nZXRNYXBTY3JlZW5zaG90RGF0YVVybEJhc2U2NCgpO1xyXG4gICAgdGhpcy5kb3dubG9hZFVSSShkYXRhVXJsLCBmaWxlbmFtZSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGRvd25sb2FkVVJJKHVyaTogc3RyaW5nLCBuYW1lOiBzdHJpbmcpIHtcclxuICAgIGNvbnN0IGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XHJcbiAgICBsaW5rLmRvd25sb2FkID0gbmFtZTtcclxuICAgIGxpbmsuaHJlZiA9IHVyaTtcclxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQobGluayk7XHJcbiAgICBsaW5rLmNsaWNrKCk7XHJcbiAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGxpbmspO1xyXG4gIH1cclxufVxyXG4iXX0=