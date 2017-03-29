import {Component, ViewChild, ContentChild, TemplateRef, OnInit} from '@angular/core';
import { BasicDesc } from '../../services/basic-desc/basic-desc.service';
import { LayerService } from '../../services/layer-service/layer-service.service';
import { ComputationCache } from '../../services/computation-cache/computation-cache.service';
import { CesiumProperties } from '../../services/cesium-properties/cesium-properties.service';
import {HtmlDrawerService} from "../../services/html-drawer/html-drawer.service";
import {AcHtmlDirective} from "../../directives/ac-html/ac-html.directive";

@Component({
    selector: 'ac-html-desc',
    templateUrl: 'ac-html-desc.component.html'
})
export class AcHtmlDescComponent extends BasicDesc {

    @ViewChild(AcHtmlDirective) acHtmlCreator: AcHtmlDirective;
    @ContentChild(TemplateRef) acHtmlTemplate: TemplateRef<any>;

    constructor(htmlDrawer: HtmlDrawerService, layerService: LayerService,
                computationCache: ComputationCache, cesiumProperties: CesiumProperties) {
        super(htmlDrawer, layerService, computationCache, cesiumProperties);
    }

    ngOnInit() {
        super.ngOnInit();

        if (!this.acHtmlCreator) {
            throw new Error(`AcHtml desc ERROR: ac html directive not found.`);
        }

        if (!this.acHtmlTemplate) {
            throw new Error(`AcHtml desc ERROR: html template not found.`);
        }
    }

    draw(context, id): any {
        const cesiumProps = this._propsEvaluator(context);
        if (!this._primitiveMap.has(id)) {
            const primitive = this._drawer.add(cesiumProps);
            this._primitiveMap.set(id, primitive);
            this.acHtmlCreator.addOrUpdate(id, primitive);
        } else {
            const primitive = this._primitiveMap.get(id);
            this._drawer.update(primitive, cesiumProps);
            this.acHtmlCreator.addOrUpdate(id, primitive);
        }
    }

    remove(id): void {
        const primitive = this._primitiveMap.get(id);
        this._drawer.remove(primitive);
        this._primitiveMap.delete(id);
        this.acHtmlCreator.remove(id, primitive);
    }

    removeAll(): void {
        for (let [id, primitive] of this._primitiveMap) {
            this.acHtmlCreator.remove(id, primitive);
        }
        this._primitiveMap.clear();
        this._drawer.removeAll();
    }
}
