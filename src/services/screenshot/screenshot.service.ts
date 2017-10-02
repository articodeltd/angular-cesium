import { Injectable } from '@angular/core';
import { CesiumService } from '../cesium/cesium.service';

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
@Injectable()
export class ScreenshotService {
	constructor(private cesiumSerive: CesiumService) {
	}
	
	getMapScreenshotDataUrlBase64() {
		const canvas = this.cesiumSerive.getCanvas();
		return canvas.toDataURL()
	}
	
	
	downloadMapScreenshot(filename = 'map.png') {
		const dataUrl = this.getMapScreenshotDataUrlBase64();
		this.downloadURI(dataUrl, filename);
	}
	
	private downloadURI(uri, name) {
		const link = document.createElement('a');
		link.download = name;
		link.href = uri;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}
}
