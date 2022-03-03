import { EventEmitter, Injectable } from '@angular/core';
import { Cartesian3 } from 'cesium';
import { ContextMenuOptions } from '../../models/context-menu-options';
import { MapEventsManagerService } from '../map-events-mananger/map-events-manager';
import { CesiumEvent } from '../map-events-mananger/consts/cesium-event.enum';
import { PickOptions } from '../map-events-mananger/consts/pickOptions.enum';
import { DisposableObservable } from '../map-events-mananger/disposable-observable';
import { BasicContextMenu } from '../../models/basic-context-menu';
import { Subscription } from 'rxjs';


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
@Injectable()
export class ContextMenuService {
  private _showContextMenu = false;
  private _options: ContextMenuOptions;
  private _position: Cartesian3;
  private _content: BasicContextMenu;
  private mapEventsManager: MapEventsManagerService;
  private leftClickRegistration: DisposableObservable<any>;
  private leftClickSubscription: Subscription;
  private _contextMenuChangeNotifier = new EventEmitter();
  private _onOpen = new EventEmitter();
  private _onClose = new EventEmitter();
  private _defaultContextMenuOptions: ContextMenuOptions = {
    closeOnLeftCLick: true,
    closeOnLeftClickPriority: 10,
  };

  get contextMenuChangeNotifier(): EventEmitter<any> {
    return this._contextMenuChangeNotifier;
  }

  get showContextMenu(): boolean {
    return this._showContextMenu;
  }

  get options(): ContextMenuOptions {
    return this._options;
  }

  get position(): Cartesian3 {
    return this._position;
  }

  get content(): BasicContextMenu {
    return this._content;
  }

  get onOpen(): EventEmitter<any> {
    return this._onOpen;
  }

  get onClose(): EventEmitter<any> {
    return this._onClose;
  }


  init(mapEventsManager: MapEventsManagerService) {
    this.mapEventsManager = mapEventsManager;
  }

  open<D>(contentComponent: any, position: Cartesian3, options: ContextMenuOptions<D> = {}) {
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
