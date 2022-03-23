import { EventEmitter, Injectable } from '@angular/core';
import { CesiumEvent } from '../map-events-mananger/consts/cesium-event.enum';
import { PickOptions } from '../map-events-mananger/consts/pickOptions.enum';
import * as i0 from "@angular/core";
/**
 * The Service manages a singleton context menu over the map. It should be initialized with MapEventsManager.
 * The Service allows opening and closing of the context menu and passing data to the context menu inner component.
 *
 * notice, `data` will be injected to your custom menu component into the `data` field in the component.
 * __Usage :__
 * ```
 *  ngOnInit() {
 *   this.clickEvent$ = this.eventsManager.register({ event: CesiumEvent.RIGHT_CLICK, pick: PickOptions.PICK_ONE });
 *   this.clickEvent$.subscribe(result => {
 *    if (result.entities) {
 *      const pickedMarker = result.entities[0];
 *      this.contextMenuService.open(MapContextmenuComponent, pickedMarker.position, {
 *        data: {
 *          myData: data,
 *          onDelete: () => this.delete(pickedMarker.id)
 *        }
 *      });
 *    }
 *   });
 *  }
 *
 *
 *  private delete(id) {
 *    this.mapMenu.close();
 *    this.detailedSiteService.removeMarker(id);
 *  }
 * ```
 */
export class ContextMenuService {
    constructor() {
        this._showContextMenu = false;
        this._contextMenuChangeNotifier = new EventEmitter();
        this._onOpen = new EventEmitter();
        this._onClose = new EventEmitter();
        this._defaultContextMenuOptions = {
            closeOnLeftCLick: true,
            closeOnLeftClickPriority: 10,
        };
    }
    get contextMenuChangeNotifier() {
        return this._contextMenuChangeNotifier;
    }
    get showContextMenu() {
        return this._showContextMenu;
    }
    get options() {
        return this._options;
    }
    get position() {
        return this._position;
    }
    get content() {
        return this._content;
    }
    get onOpen() {
        return this._onOpen;
    }
    get onClose() {
        return this._onClose;
    }
    init(mapEventsManager) {
        this.mapEventsManager = mapEventsManager;
    }
    open(contentComponent, position, options = {}) {
        this.close();
        this._content = contentComponent;
        this._position = position;
        this._options = Object.assign({}, this._defaultContextMenuOptions, options);
        this._showContextMenu = true;
        if (this.mapEventsManager && this._options.closeOnLeftCLick) {
            this.leftClickRegistration = this.mapEventsManager.register({
                event: CesiumEvent.LEFT_CLICK,
                pick: PickOptions.NO_PICK,
                priority: this._options.closeOnLeftClickPriority,
            });
            this.leftClickSubscription = this.leftClickRegistration.subscribe(() => {
                this.leftClickSubscription.unsubscribe();
                this.close();
            });
        }
        this._contextMenuChangeNotifier.emit();
        this._onOpen.emit();
    }
    close() {
        this._content = undefined;
        this._position = undefined;
        this._options = undefined;
        this._showContextMenu = false;
        if (this.leftClickRegistration) {
            this.leftClickRegistration.dispose();
            this.leftClickRegistration = undefined;
        }
        if (this.leftClickSubscription) {
            this.leftClickSubscription.unsubscribe();
            this.leftClickSubscription = undefined;
        }
        this._contextMenuChangeNotifier.emit();
        this._onClose.emit();
    }
}
ContextMenuService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: ContextMenuService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
ContextMenuService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: ContextMenuService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: ContextMenuService, decorators: [{
            type: Injectable
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGV4dC1tZW51LnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbGliL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2NvbnRleHQtbWVudS9jb250ZXh0LW1lbnUuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUl6RCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0saURBQWlELENBQUM7QUFDOUUsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGdEQUFnRCxDQUFDOztBQU03RTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQTRCRztBQUVILE1BQU0sT0FBTyxrQkFBa0I7SUFEL0I7UUFFVSxxQkFBZ0IsR0FBRyxLQUFLLENBQUM7UUFPekIsK0JBQTBCLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUNoRCxZQUFPLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUM3QixhQUFRLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUM5QiwrQkFBMEIsR0FBdUI7WUFDdkQsZ0JBQWdCLEVBQUUsSUFBSTtZQUN0Qix3QkFBd0IsRUFBRSxFQUFFO1NBQzdCLENBQUM7S0EwRUg7SUF4RUMsSUFBSSx5QkFBeUI7UUFDM0IsT0FBTyxJQUFJLENBQUMsMEJBQTBCLENBQUM7SUFDekMsQ0FBQztJQUVELElBQUksZUFBZTtRQUNqQixPQUFPLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQztJQUMvQixDQUFDO0lBRUQsSUFBSSxPQUFPO1FBQ1QsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ3ZCLENBQUM7SUFFRCxJQUFJLFFBQVE7UUFDVixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUM7SUFDeEIsQ0FBQztJQUVELElBQUksT0FBTztRQUNULE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztJQUN2QixDQUFDO0lBRUQsSUFBSSxNQUFNO1FBQ1IsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDO0lBQ3RCLENBQUM7SUFFRCxJQUFJLE9BQU87UUFDVCxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDdkIsQ0FBQztJQUdELElBQUksQ0FBQyxnQkFBeUM7UUFDNUMsSUFBSSxDQUFDLGdCQUFnQixHQUFHLGdCQUFnQixDQUFDO0lBQzNDLENBQUM7SUFFRCxJQUFJLENBQUksZ0JBQXFCLEVBQUUsUUFBb0IsRUFBRSxVQUFpQyxFQUFFO1FBQ3RGLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNiLElBQUksQ0FBQyxRQUFRLEdBQUcsZ0JBQWdCLENBQUM7UUFDakMsSUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUM7UUFDMUIsSUFBSSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsMEJBQTBCLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDNUUsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQztRQUM3QixJQUFJLElBQUksQ0FBQyxnQkFBZ0IsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLGdCQUFnQixFQUFFO1lBQzNELElBQUksQ0FBQyxxQkFBcUIsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDO2dCQUMxRCxLQUFLLEVBQUUsV0FBVyxDQUFDLFVBQVU7Z0JBQzdCLElBQUksRUFBRSxXQUFXLENBQUMsT0FBTztnQkFDekIsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsd0JBQXdCO2FBQ2pELENBQUMsQ0FBQztZQUNILElBQUksQ0FBQyxxQkFBcUIsR0FBRyxJQUFJLENBQUMscUJBQXFCLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRTtnQkFDckUsSUFBSSxDQUFDLHFCQUFxQixDQUFDLFdBQVcsRUFBRSxDQUFDO2dCQUN6QyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDZixDQUFDLENBQUMsQ0FBQztTQUNKO1FBRUQsSUFBSSxDQUFDLDBCQUEwQixDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDdEIsQ0FBQztJQUVELEtBQUs7UUFDSCxJQUFJLENBQUMsUUFBUSxHQUFHLFNBQVMsQ0FBQztRQUMxQixJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztRQUMzQixJQUFJLENBQUMsUUFBUSxHQUFHLFNBQVMsQ0FBQztRQUMxQixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsS0FBSyxDQUFDO1FBQzlCLElBQUksSUFBSSxDQUFDLHFCQUFxQixFQUFFO1lBQzlCLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUNyQyxJQUFJLENBQUMscUJBQXFCLEdBQUcsU0FBUyxDQUFDO1NBQ3hDO1FBQ0QsSUFBSSxJQUFJLENBQUMscUJBQXFCLEVBQUU7WUFDOUIsSUFBSSxDQUFDLHFCQUFxQixDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQ3pDLElBQUksQ0FBQyxxQkFBcUIsR0FBRyxTQUFTLENBQUM7U0FDeEM7UUFFRCxJQUFJLENBQUMsMEJBQTBCLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDdkMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUN2QixDQUFDOzsrR0F2RlUsa0JBQWtCO21IQUFsQixrQkFBa0I7MkZBQWxCLGtCQUFrQjtrQkFEOUIsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEV2ZW50RW1pdHRlciwgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBDYXJ0ZXNpYW4zIH0gZnJvbSAnY2VzaXVtJztcclxuaW1wb3J0IHsgQ29udGV4dE1lbnVPcHRpb25zIH0gZnJvbSAnLi4vLi4vbW9kZWxzL2NvbnRleHQtbWVudS1vcHRpb25zJztcclxuaW1wb3J0IHsgTWFwRXZlbnRzTWFuYWdlclNlcnZpY2UgfSBmcm9tICcuLi9tYXAtZXZlbnRzLW1hbmFuZ2VyL21hcC1ldmVudHMtbWFuYWdlcic7XHJcbmltcG9ydCB7IENlc2l1bUV2ZW50IH0gZnJvbSAnLi4vbWFwLWV2ZW50cy1tYW5hbmdlci9jb25zdHMvY2VzaXVtLWV2ZW50LmVudW0nO1xyXG5pbXBvcnQgeyBQaWNrT3B0aW9ucyB9IGZyb20gJy4uL21hcC1ldmVudHMtbWFuYW5nZXIvY29uc3RzL3BpY2tPcHRpb25zLmVudW0nO1xyXG5pbXBvcnQgeyBEaXNwb3NhYmxlT2JzZXJ2YWJsZSB9IGZyb20gJy4uL21hcC1ldmVudHMtbWFuYW5nZXIvZGlzcG9zYWJsZS1vYnNlcnZhYmxlJztcclxuaW1wb3J0IHsgQmFzaWNDb250ZXh0TWVudSB9IGZyb20gJy4uLy4uL21vZGVscy9iYXNpYy1jb250ZXh0LW1lbnUnO1xyXG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcclxuXHJcblxyXG4vKipcclxuICogVGhlIFNlcnZpY2UgbWFuYWdlcyBhIHNpbmdsZXRvbiBjb250ZXh0IG1lbnUgb3ZlciB0aGUgbWFwLiBJdCBzaG91bGQgYmUgaW5pdGlhbGl6ZWQgd2l0aCBNYXBFdmVudHNNYW5hZ2VyLlxyXG4gKiBUaGUgU2VydmljZSBhbGxvd3Mgb3BlbmluZyBhbmQgY2xvc2luZyBvZiB0aGUgY29udGV4dCBtZW51IGFuZCBwYXNzaW5nIGRhdGEgdG8gdGhlIGNvbnRleHQgbWVudSBpbm5lciBjb21wb25lbnQuXHJcbiAqXHJcbiAqIG5vdGljZSwgYGRhdGFgIHdpbGwgYmUgaW5qZWN0ZWQgdG8geW91ciBjdXN0b20gbWVudSBjb21wb25lbnQgaW50byB0aGUgYGRhdGFgIGZpZWxkIGluIHRoZSBjb21wb25lbnQuXHJcbiAqIF9fVXNhZ2UgOl9fXHJcbiAqIGBgYFxyXG4gKiAgbmdPbkluaXQoKSB7XHJcbiAqICAgdGhpcy5jbGlja0V2ZW50JCA9IHRoaXMuZXZlbnRzTWFuYWdlci5yZWdpc3Rlcih7IGV2ZW50OiBDZXNpdW1FdmVudC5SSUdIVF9DTElDSywgcGljazogUGlja09wdGlvbnMuUElDS19PTkUgfSk7XHJcbiAqICAgdGhpcy5jbGlja0V2ZW50JC5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICogICAgaWYgKHJlc3VsdC5lbnRpdGllcykge1xyXG4gKiAgICAgIGNvbnN0IHBpY2tlZE1hcmtlciA9IHJlc3VsdC5lbnRpdGllc1swXTtcclxuICogICAgICB0aGlzLmNvbnRleHRNZW51U2VydmljZS5vcGVuKE1hcENvbnRleHRtZW51Q29tcG9uZW50LCBwaWNrZWRNYXJrZXIucG9zaXRpb24sIHtcclxuICogICAgICAgIGRhdGE6IHtcclxuICogICAgICAgICAgbXlEYXRhOiBkYXRhLFxyXG4gKiAgICAgICAgICBvbkRlbGV0ZTogKCkgPT4gdGhpcy5kZWxldGUocGlja2VkTWFya2VyLmlkKVxyXG4gKiAgICAgICAgfVxyXG4gKiAgICAgIH0pO1xyXG4gKiAgICB9XHJcbiAqICAgfSk7XHJcbiAqICB9XHJcbiAqXHJcbiAqXHJcbiAqICBwcml2YXRlIGRlbGV0ZShpZCkge1xyXG4gKiAgICB0aGlzLm1hcE1lbnUuY2xvc2UoKTtcclxuICogICAgdGhpcy5kZXRhaWxlZFNpdGVTZXJ2aWNlLnJlbW92ZU1hcmtlcihpZCk7XHJcbiAqICB9XHJcbiAqIGBgYFxyXG4gKi9cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgQ29udGV4dE1lbnVTZXJ2aWNlIHtcclxuICBwcml2YXRlIF9zaG93Q29udGV4dE1lbnUgPSBmYWxzZTtcclxuICBwcml2YXRlIF9vcHRpb25zOiBDb250ZXh0TWVudU9wdGlvbnM7XHJcbiAgcHJpdmF0ZSBfcG9zaXRpb246IENhcnRlc2lhbjM7XHJcbiAgcHJpdmF0ZSBfY29udGVudDogQmFzaWNDb250ZXh0TWVudTtcclxuICBwcml2YXRlIG1hcEV2ZW50c01hbmFnZXI6IE1hcEV2ZW50c01hbmFnZXJTZXJ2aWNlO1xyXG4gIHByaXZhdGUgbGVmdENsaWNrUmVnaXN0cmF0aW9uOiBEaXNwb3NhYmxlT2JzZXJ2YWJsZTxhbnk+O1xyXG4gIHByaXZhdGUgbGVmdENsaWNrU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XHJcbiAgcHJpdmF0ZSBfY29udGV4dE1lbnVDaGFuZ2VOb3RpZmllciA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICBwcml2YXRlIF9vbk9wZW4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgcHJpdmF0ZSBfb25DbG9zZSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICBwcml2YXRlIF9kZWZhdWx0Q29udGV4dE1lbnVPcHRpb25zOiBDb250ZXh0TWVudU9wdGlvbnMgPSB7XHJcbiAgICBjbG9zZU9uTGVmdENMaWNrOiB0cnVlLFxyXG4gICAgY2xvc2VPbkxlZnRDbGlja1ByaW9yaXR5OiAxMCxcclxuICB9O1xyXG5cclxuICBnZXQgY29udGV4dE1lbnVDaGFuZ2VOb3RpZmllcigpOiBFdmVudEVtaXR0ZXI8YW55PiB7XHJcbiAgICByZXR1cm4gdGhpcy5fY29udGV4dE1lbnVDaGFuZ2VOb3RpZmllcjtcclxuICB9XHJcblxyXG4gIGdldCBzaG93Q29udGV4dE1lbnUoKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gdGhpcy5fc2hvd0NvbnRleHRNZW51O1xyXG4gIH1cclxuXHJcbiAgZ2V0IG9wdGlvbnMoKTogQ29udGV4dE1lbnVPcHRpb25zIHtcclxuICAgIHJldHVybiB0aGlzLl9vcHRpb25zO1xyXG4gIH1cclxuXHJcbiAgZ2V0IHBvc2l0aW9uKCk6IENhcnRlc2lhbjMge1xyXG4gICAgcmV0dXJuIHRoaXMuX3Bvc2l0aW9uO1xyXG4gIH1cclxuXHJcbiAgZ2V0IGNvbnRlbnQoKTogQmFzaWNDb250ZXh0TWVudSB7XHJcbiAgICByZXR1cm4gdGhpcy5fY29udGVudDtcclxuICB9XHJcblxyXG4gIGdldCBvbk9wZW4oKTogRXZlbnRFbWl0dGVyPGFueT4ge1xyXG4gICAgcmV0dXJuIHRoaXMuX29uT3BlbjtcclxuICB9XHJcblxyXG4gIGdldCBvbkNsb3NlKCk6IEV2ZW50RW1pdHRlcjxhbnk+IHtcclxuICAgIHJldHVybiB0aGlzLl9vbkNsb3NlO1xyXG4gIH1cclxuXHJcblxyXG4gIGluaXQobWFwRXZlbnRzTWFuYWdlcjogTWFwRXZlbnRzTWFuYWdlclNlcnZpY2UpIHtcclxuICAgIHRoaXMubWFwRXZlbnRzTWFuYWdlciA9IG1hcEV2ZW50c01hbmFnZXI7XHJcbiAgfVxyXG5cclxuICBvcGVuPEQ+KGNvbnRlbnRDb21wb25lbnQ6IGFueSwgcG9zaXRpb246IENhcnRlc2lhbjMsIG9wdGlvbnM6IENvbnRleHRNZW51T3B0aW9uczxEPiA9IHt9KSB7XHJcbiAgICB0aGlzLmNsb3NlKCk7XHJcbiAgICB0aGlzLl9jb250ZW50ID0gY29udGVudENvbXBvbmVudDtcclxuICAgIHRoaXMuX3Bvc2l0aW9uID0gcG9zaXRpb247XHJcbiAgICB0aGlzLl9vcHRpb25zID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5fZGVmYXVsdENvbnRleHRNZW51T3B0aW9ucywgb3B0aW9ucyk7XHJcbiAgICB0aGlzLl9zaG93Q29udGV4dE1lbnUgPSB0cnVlO1xyXG4gICAgaWYgKHRoaXMubWFwRXZlbnRzTWFuYWdlciAmJiB0aGlzLl9vcHRpb25zLmNsb3NlT25MZWZ0Q0xpY2spIHtcclxuICAgICAgdGhpcy5sZWZ0Q2xpY2tSZWdpc3RyYXRpb24gPSB0aGlzLm1hcEV2ZW50c01hbmFnZXIucmVnaXN0ZXIoe1xyXG4gICAgICAgIGV2ZW50OiBDZXNpdW1FdmVudC5MRUZUX0NMSUNLLFxyXG4gICAgICAgIHBpY2s6IFBpY2tPcHRpb25zLk5PX1BJQ0ssXHJcbiAgICAgICAgcHJpb3JpdHk6IHRoaXMuX29wdGlvbnMuY2xvc2VPbkxlZnRDbGlja1ByaW9yaXR5LFxyXG4gICAgICB9KTtcclxuICAgICAgdGhpcy5sZWZ0Q2xpY2tTdWJzY3JpcHRpb24gPSB0aGlzLmxlZnRDbGlja1JlZ2lzdHJhdGlvbi5zdWJzY3JpYmUoKCkgPT4ge1xyXG4gICAgICAgIHRoaXMubGVmdENsaWNrU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XHJcbiAgICAgICAgdGhpcy5jbG9zZSgpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLl9jb250ZXh0TWVudUNoYW5nZU5vdGlmaWVyLmVtaXQoKTtcclxuICAgIHRoaXMuX29uT3Blbi5lbWl0KCk7XHJcbiAgfVxyXG5cclxuICBjbG9zZSgpIHtcclxuICAgIHRoaXMuX2NvbnRlbnQgPSB1bmRlZmluZWQ7XHJcbiAgICB0aGlzLl9wb3NpdGlvbiA9IHVuZGVmaW5lZDtcclxuICAgIHRoaXMuX29wdGlvbnMgPSB1bmRlZmluZWQ7XHJcbiAgICB0aGlzLl9zaG93Q29udGV4dE1lbnUgPSBmYWxzZTtcclxuICAgIGlmICh0aGlzLmxlZnRDbGlja1JlZ2lzdHJhdGlvbikge1xyXG4gICAgICB0aGlzLmxlZnRDbGlja1JlZ2lzdHJhdGlvbi5kaXNwb3NlKCk7XHJcbiAgICAgIHRoaXMubGVmdENsaWNrUmVnaXN0cmF0aW9uID0gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG4gICAgaWYgKHRoaXMubGVmdENsaWNrU3Vic2NyaXB0aW9uKSB7XHJcbiAgICAgIHRoaXMubGVmdENsaWNrU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XHJcbiAgICAgIHRoaXMubGVmdENsaWNrU3Vic2NyaXB0aW9uID0gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuX2NvbnRleHRNZW51Q2hhbmdlTm90aWZpZXIuZW1pdCgpO1xyXG4gICAgdGhpcy5fb25DbG9zZS5lbWl0KCk7XHJcbiAgfVxyXG59XHJcbiJdfQ==