import {BillboardDrawerService} from "./../../services/billboard-drawer/billboard-drawer.service";
import {Component, OnInit, Input, ChangeDetectorRef, AfterContentInit} from "@angular/core";
import {Observable} from "rxjs";
import {LayerContextService} from "../../services/layer-context/layer-context.service";
import {LayerService} from "../../services/layer-service/layer-service.service";
import {ComputationCache} from "../../services/computation-cache/computation-cache.service";

@Component({
    selector: 'ac-layer',
    templateUrl: './ac-layer.component.html',
    styleUrls: ['./ac-layer.component.css'],
    providers: [LayerService, ComputationCache, BillboardDrawerService]
})
export class AcLayerComponent implements OnInit {
    @Input()
    acFor: string;
    entityName: string;
    observable: Observable<any>;
    layerContext: any;

    constructor(private billboardDrawerService: BillboardDrawerService,
                private  layerService: LayerService,
                private _computationCache: ComputationCache
    ) {}

    init(context){
        this.layerContext = context;
        const acForArr = this.acFor.split(' ');
        this.observable = this.layerContext[acForArr[3]];
        this.entityName = acForArr[1];

        this.observable.subscribe((data) => {
            this._computationCache.clear();
            this.layerContext[this.entityName] = data.entity;
            this.layerService.getDescriptions().forEach((descriptionComponent) => {
                descriptionComponent.draw(this.layerContext, data.id);
            })
        });
    }

    ngOnInit(): void {
    }

    removeAll(): void {
        this.billboardDrawerService.removeAll();
    }
}
