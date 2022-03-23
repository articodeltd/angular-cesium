import { DoCheck, ElementRef, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { CesiumService } from '../../services/cesium/cesium.service';
import * as i0 from "@angular/core";
/**
 *  This is an html implementation.
 *  The ac-html element must be a child of ac-map element.
 *  __Usage:__
 *  ```
 *  <ac-html [props]="{position: position, show: true}">;
 *    <p>html element</p>
 *  </ac-html>
 *  ```
 */
export declare class AcHtmlComponent implements DoCheck, OnDestroy, OnInit {
    private cesiumService;
    private elementRef;
    private renderer;
    props: any;
    private isDraw;
    preRenderEventListener: () => void;
    constructor(cesiumService: CesiumService, elementRef: ElementRef, renderer: Renderer2);
    setScreenPosition(screenPosition: any): void;
    ngOnInit(): void;
    remove(): void;
    hideElement(): void;
    add(): void;
    ngDoCheck(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<AcHtmlComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<AcHtmlComponent, "ac-html", never, { "props": "props"; }, {}, never, ["*"]>;
}
