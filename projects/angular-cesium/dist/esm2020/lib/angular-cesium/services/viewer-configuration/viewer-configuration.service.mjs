import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
/**
 * Service for setting cesium viewer map options.
 * defaulty angular-cesium doesnt provide this service and viewer is created with default options.
 * In order set specific options you must set this service as provider in your component and
 * set the wanted options.
 * ```typescript
 * constructor(viewerConf :ViewerConfiguration ) {
 *   viewerConf.viewerOptions = { timeline: false };
 * }
 * ```
 * notice this configuration will be for all <ac-maps> in your component.
 */
export class ViewerConfiguration {
    constructor() {
        this.nextViewerOptionsIndex = 0;
        this.nextViewerModifierIndex = 0;
    }
    get viewerOptions() {
        return this._viewerOptions;
    }
    getNextViewerOptions() {
        if (this._viewerOptions instanceof Array) {
            return this._viewerOptions[this.nextViewerOptionsIndex++];
        }
        else {
            return this._viewerOptions;
        }
    }
    /**
     * Can be used to set initial map viewer options.
     * If there is more than one map you can give the function an array of options.
     * The map initialized first will be set with the first option object in the options array and so on.
     */
    set viewerOptions(value) {
        this._viewerOptions = value;
    }
    get viewerModifier() {
        return this._viewerModifier;
    }
    getNextViewerModifier() {
        if (this._viewerModifier instanceof Array) {
            return this._viewerModifier[this.nextViewerModifierIndex++];
        }
        else {
            return this._viewerModifier;
        }
    }
    /**
     * Can be used to set map viewer options after the map has been initialized.
     * If there is more than one map you can give the function an array of functions.
     * The map initialized first will be set with the first option object in the options array and so on.
     */
    set viewerModifier(value) {
        this._viewerModifier = value;
    }
}
ViewerConfiguration.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: ViewerConfiguration, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
ViewerConfiguration.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: ViewerConfiguration });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: ViewerConfiguration, decorators: [{
            type: Injectable
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlld2VyLWNvbmZpZ3VyYXRpb24uc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9saWIvYW5ndWxhci1jZXNpdW0vc2VydmljZXMvdmlld2VyLWNvbmZpZ3VyYXRpb24vdmlld2VyLWNvbmZpZ3VyYXRpb24uc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDOztBQUUzQzs7Ozs7Ozs7Ozs7R0FXRztBQUVILE1BQU0sT0FBTyxtQkFBbUI7SUFEaEM7UUFPVSwyQkFBc0IsR0FBRyxDQUFDLENBQUM7UUFDM0IsNEJBQXVCLEdBQUcsQ0FBQyxDQUFDO0tBNkNyQztJQTNDQyxJQUFJLGFBQWE7UUFDZixPQUFPLElBQUksQ0FBQyxjQUFjLENBQUM7SUFDN0IsQ0FBQztJQUlELG9CQUFvQjtRQUNsQixJQUFJLElBQUksQ0FBQyxjQUFjLFlBQVksS0FBSyxFQUFFO1lBQ3hDLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsc0JBQXNCLEVBQUUsQ0FBQyxDQUFDO1NBQzNEO2FBQU07WUFDTCxPQUFPLElBQUksQ0FBQyxjQUFjLENBQUM7U0FDNUI7SUFDSCxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILElBQUksYUFBYSxDQUFDLEtBQXdCO1FBQ3hDLElBQUksQ0FBQyxjQUFjLEdBQUcsS0FBSyxDQUFDO0lBQzlCLENBQUM7SUFFRCxJQUFJLGNBQWM7UUFDaEIsT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDO0lBQzlCLENBQUM7SUFFRCxxQkFBcUI7UUFDbkIsSUFBSSxJQUFJLENBQUMsZUFBZSxZQUFZLEtBQUssRUFBRTtZQUN6QyxPQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLHVCQUF1QixFQUFFLENBQUMsQ0FBQztTQUM3RDthQUFNO1lBQ0wsT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDO1NBQzdCO0lBQ0gsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxJQUFJLGNBQWMsQ0FBQyxLQUE0QjtRQUM3QyxJQUFJLENBQUMsZUFBZSxHQUFHLEtBQUssQ0FBQztJQUMvQixDQUFDOztnSEFuRFUsbUJBQW1CO29IQUFuQixtQkFBbUI7MkZBQW5CLG1CQUFtQjtrQkFEL0IsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcbi8qKlxyXG4gKiBTZXJ2aWNlIGZvciBzZXR0aW5nIGNlc2l1bSB2aWV3ZXIgbWFwIG9wdGlvbnMuXHJcbiAqIGRlZmF1bHR5IGFuZ3VsYXItY2VzaXVtIGRvZXNudCBwcm92aWRlIHRoaXMgc2VydmljZSBhbmQgdmlld2VyIGlzIGNyZWF0ZWQgd2l0aCBkZWZhdWx0IG9wdGlvbnMuXHJcbiAqIEluIG9yZGVyIHNldCBzcGVjaWZpYyBvcHRpb25zIHlvdSBtdXN0IHNldCB0aGlzIHNlcnZpY2UgYXMgcHJvdmlkZXIgaW4geW91ciBjb21wb25lbnQgYW5kXHJcbiAqIHNldCB0aGUgd2FudGVkIG9wdGlvbnMuXHJcbiAqIGBgYHR5cGVzY3JpcHRcclxuICogY29uc3RydWN0b3Iodmlld2VyQ29uZiA6Vmlld2VyQ29uZmlndXJhdGlvbiApIHtcclxuICogICB2aWV3ZXJDb25mLnZpZXdlck9wdGlvbnMgPSB7IHRpbWVsaW5lOiBmYWxzZSB9O1xyXG4gKiB9XHJcbiAqIGBgYFxyXG4gKiBub3RpY2UgdGhpcyBjb25maWd1cmF0aW9uIHdpbGwgYmUgZm9yIGFsbCA8YWMtbWFwcz4gaW4geW91ciBjb21wb25lbnQuXHJcbiAqL1xyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBWaWV3ZXJDb25maWd1cmF0aW9uIHtcclxuICAvKipcclxuICAgKiBjZXNpdW0gdmlld2VyIG9wdGlvbnMgQWNjb3JkaW5nIHRvIFtWaWV3ZXJde0BsaW5rIGh0dHBzOi8vY2VzaXVtanMub3JnL0Nlc2l1bS9CdWlsZC9Eb2N1bWVudGF0aW9uL1ZpZXdlci5odG1sP2NsYXNzRmlsdGVyPXZpZX1cclxuICAgKi9cclxuICBwcml2YXRlIF92aWV3ZXJPcHRpb25zOiBvYmplY3QgfCBvYmplY3RbXTtcclxuICBwcml2YXRlIF92aWV3ZXJNb2RpZmllcjogRnVuY3Rpb24gfCBGdW5jdGlvbltdO1xyXG4gIHByaXZhdGUgbmV4dFZpZXdlck9wdGlvbnNJbmRleCA9IDA7XHJcbiAgcHJpdmF0ZSBuZXh0Vmlld2VyTW9kaWZpZXJJbmRleCA9IDA7XHJcblxyXG4gIGdldCB2aWV3ZXJPcHRpb25zKCk6IG9iamVjdCB8IG9iamVjdFtdIHtcclxuICAgIHJldHVybiB0aGlzLl92aWV3ZXJPcHRpb25zO1xyXG4gIH1cclxuXHJcbiAgw487XHJcblxyXG4gIGdldE5leHRWaWV3ZXJPcHRpb25zKCk6IG9iamVjdCB8IG9iamVjdFtdIHtcclxuICAgIGlmICh0aGlzLl92aWV3ZXJPcHRpb25zIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuX3ZpZXdlck9wdGlvbnNbdGhpcy5uZXh0Vmlld2VyT3B0aW9uc0luZGV4KytdO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIHRoaXMuX3ZpZXdlck9wdGlvbnM7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDYW4gYmUgdXNlZCB0byBzZXQgaW5pdGlhbCBtYXAgdmlld2VyIG9wdGlvbnMuXHJcbiAgICogSWYgdGhlcmUgaXMgbW9yZSB0aGFuIG9uZSBtYXAgeW91IGNhbiBnaXZlIHRoZSBmdW5jdGlvbiBhbiBhcnJheSBvZiBvcHRpb25zLlxyXG4gICAqIFRoZSBtYXAgaW5pdGlhbGl6ZWQgZmlyc3Qgd2lsbCBiZSBzZXQgd2l0aCB0aGUgZmlyc3Qgb3B0aW9uIG9iamVjdCBpbiB0aGUgb3B0aW9ucyBhcnJheSBhbmQgc28gb24uXHJcbiAgICovXHJcbiAgc2V0IHZpZXdlck9wdGlvbnModmFsdWU6IG9iamVjdCB8IG9iamVjdFtdKSB7XHJcbiAgICB0aGlzLl92aWV3ZXJPcHRpb25zID0gdmFsdWU7XHJcbiAgfVxyXG5cclxuICBnZXQgdmlld2VyTW9kaWZpZXIoKTogRnVuY3Rpb24gfCBGdW5jdGlvbltdIHtcclxuICAgIHJldHVybiB0aGlzLl92aWV3ZXJNb2RpZmllcjtcclxuICB9XHJcblxyXG4gIGdldE5leHRWaWV3ZXJNb2RpZmllcigpOiBGdW5jdGlvbiB8IEZ1bmN0aW9uW10ge1xyXG4gICAgaWYgKHRoaXMuX3ZpZXdlck1vZGlmaWVyIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuX3ZpZXdlck1vZGlmaWVyW3RoaXMubmV4dFZpZXdlck1vZGlmaWVySW5kZXgrK107XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gdGhpcy5fdmlld2VyTW9kaWZpZXI7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDYW4gYmUgdXNlZCB0byBzZXQgbWFwIHZpZXdlciBvcHRpb25zIGFmdGVyIHRoZSBtYXAgaGFzIGJlZW4gaW5pdGlhbGl6ZWQuXHJcbiAgICogSWYgdGhlcmUgaXMgbW9yZSB0aGFuIG9uZSBtYXAgeW91IGNhbiBnaXZlIHRoZSBmdW5jdGlvbiBhbiBhcnJheSBvZiBmdW5jdGlvbnMuXHJcbiAgICogVGhlIG1hcCBpbml0aWFsaXplZCBmaXJzdCB3aWxsIGJlIHNldCB3aXRoIHRoZSBmaXJzdCBvcHRpb24gb2JqZWN0IGluIHRoZSBvcHRpb25zIGFycmF5IGFuZCBzbyBvbi5cclxuICAgKi9cclxuICBzZXQgdmlld2VyTW9kaWZpZXIodmFsdWU6IEZ1bmN0aW9uIHwgRnVuY3Rpb25bXSkge1xyXG4gICAgdGhpcy5fdmlld2VyTW9kaWZpZXIgPSB2YWx1ZTtcclxuICB9XHJcbn1cclxuIl19