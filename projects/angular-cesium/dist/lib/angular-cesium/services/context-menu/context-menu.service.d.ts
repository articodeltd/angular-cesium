import { EventEmitter } from '@angular/core';
import { Cartesian3 } from 'cesium';
import { ContextMenuOptions } from '../../models/context-menu-options';
import { MapEventsManagerService } from '../map-events-mananger/map-events-manager';
import { BasicContextMenu } from '../../models/basic-context-menu';
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
export declare class ContextMenuService {
    private _showContextMenu;
    private _options;
    private _position;
    private _content;
    private mapEventsManager;
    private leftClickRegistration;
    private leftClickSubscription;
    private _contextMenuChangeNotifier;
    private _onOpen;
    private _onClose;
    private _defaultContextMenuOptions;
    get contextMenuChangeNotifier(): EventEmitter<any>;
    get showContextMenu(): boolean;
    get options(): ContextMenuOptions;
    get position(): Cartesian3;
    get content(): BasicContextMenu;
    get onOpen(): EventEmitter<any>;
    get onClose(): EventEmitter<any>;
    init(mapEventsManager: MapEventsManagerService): void;
    open<D>(contentComponent: any, position: Cartesian3, options?: ContextMenuOptions<D>): void;
    close(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ContextMenuService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ContextMenuService>;
}
