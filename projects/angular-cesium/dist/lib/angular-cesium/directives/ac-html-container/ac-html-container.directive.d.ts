import { ElementRef, OnInit } from '@angular/core';
import { AcHtmlManager } from '../../services/ac-html-manager/ac-html-manager.service';
import * as i0 from "@angular/core";
export declare class AcHtmlContainerDirective implements OnInit {
    private _element;
    private _acHtmlManager;
    private _id;
    constructor(_element: ElementRef, _acHtmlManager: AcHtmlManager);
    set acHtmlContainer(id: string);
    ngOnInit(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<AcHtmlContainerDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<AcHtmlContainerDirective, "[acHtmlContainer]", never, { "acHtmlContainer": "acHtmlContainer"; }, {}, never>;
}
