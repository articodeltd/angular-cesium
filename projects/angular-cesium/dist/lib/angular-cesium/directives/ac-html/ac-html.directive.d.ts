import { ChangeDetectorRef, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { LayerService } from '../../services/layer-service/layer-service.service';
import { AcHtmlManager } from '../../services/ac-html-manager/ac-html-manager.service';
import * as i0 from "@angular/core";
export declare class AcHtmlContext {
    id: any;
    context: any;
    constructor(id: any, context: any);
}
export declare class AcHtmlDirective implements OnInit {
    private _templateRef;
    private _viewContainerRef;
    private _changeDetector;
    private _layerService;
    private _acHtmlManager;
    private _views;
    constructor(_templateRef: TemplateRef<AcHtmlContext>, _viewContainerRef: ViewContainerRef, _changeDetector: ChangeDetectorRef, _layerService: LayerService, _acHtmlManager: AcHtmlManager);
    ngOnInit(): void;
    private _handleView;
    addOrUpdate(id: any, primitive: any): void;
    remove(id: any, primitive: any): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<AcHtmlDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<AcHtmlDirective, "[acHtml]", never, {}, {}, never>;
}
