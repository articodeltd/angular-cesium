import { ElementRef, OnDestroy, OnInit, OnChanges, SimpleChanges, EventEmitter } from '@angular/core';
import { CesiumService } from '../../../../angular-cesium/services/cesium/cesium.service';
import * as i0 from "@angular/core";
/**
 * Toolbar widget, act as a container for ac-toolbar-button components
 * allowing drag configuration and passing `toolbarClass` as attributes
 *
 * Usage:
 * ```
 * <ac-toolbar [allowDrag]="true" (onDrag)="handleDrag($event)">
 <ac-toolbar-button [iconUrl]="'assets/home-icon.svg'" (onClick)="goHome()">
 </ac-toolbar-button>
 <ac-toolbar-button [iconUrl]="'assets/explore-icon.svg'" (onClick)="rangeAndBearing()">
 </ac-toolbar-button>
 </ac-toolbar>
 * ```
 *
 */
export declare class AcToolbarComponent implements OnInit, OnChanges, OnDestroy {
    private element;
    private cesiumService;
    toolbarClass: string;
    allowDrag: boolean;
    onDrag: EventEmitter<MouseEvent>;
    dragStyle: {
        'height.px': number;
        'width.px': number;
    };
    private mouseDown$;
    private mouseMove$;
    private mouseUp$;
    private drag$;
    private dragSubscription;
    constructor(element: ElementRef, cesiumService: CesiumService);
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    private listenForDragging;
    static ɵfac: i0.ɵɵFactoryDeclaration<AcToolbarComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<AcToolbarComponent, "ac-toolbar", never, { "toolbarClass": "toolbarClass"; "allowDrag": "allowDrag"; }, { "onDrag": "onDrag"; }, never, ["*"]>;
}
