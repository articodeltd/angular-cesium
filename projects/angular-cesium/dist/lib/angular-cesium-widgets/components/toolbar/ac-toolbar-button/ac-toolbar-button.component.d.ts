import { EventEmitter, OnInit } from '@angular/core';
import * as i0 from "@angular/core";
/**
 * Toolbar button widget, act as a single button inside ac-toolbar component
 * Can accepts content components or passing [iconUrl]
 * configure with: `[iconUrl]`,`[buttonClass]`,`[iconClass]`,`(onClick)`
 *
 * Usage:
 * ```
 * <ac-toolbar [allowDrag]="true">
 <ac-toolbar-button [iconUrl]="'assets/home-icon.svg'" (onClick)="goHome()">
 </ac-toolbar-button>
 <ac-toolbar-button [iconUrl]="'assets/explore-icon.svg'" (onClick)="rangeAndBearing()">
 </ac-toolbar-button>
 </ac-toolbar>
 * ```
 *
 */
export declare class AcToolbarButtonComponent implements OnInit {
    iconUrl: string;
    buttonClass: string;
    iconClass: string;
    onClick: EventEmitter<any>;
    constructor();
    ngOnInit(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<AcToolbarButtonComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<AcToolbarButtonComponent, "ac-toolbar-button", never, { "iconUrl": "iconUrl"; "buttonClass": "buttonClass"; "iconClass": "iconClass"; }, { "onClick": "onClick"; }, never, ["*"]>;
}
