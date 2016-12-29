import {BillboardDrawerService} from "./../../services/billboard-drawer/billboard-drawer.service";
import {Component, OnInit, Input} from "@angular/core";
import {Observable} from "rxjs";
import {LayerService} from "../../services/layer-service/layer-service.service";
import {acEntity} from "../../models/ac-entity";
import {ActionType} from "../../models/action-type.enum";
import {ComputationCache} from "../../services/computation-cache/computation-cache.service";
import {LabelDrawerService} from "../../services/label-drawer/label-drawer.service";

@Component({
    selector: 'ac-layer',
    templateUrl: './ac-layer.component.html',
    styleUrls: ['./ac-layer.component.css'],
    providers: [LayerService, ComputationCache, BillboardDrawerService, LabelDrawerService]
})
export class AcLayerComponent implements OnInit{
    @Input()
    context: any;

    @Input()
    acFor: string;
    entityName: string;
    observable: Observable<acEntity>;
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
                switch (data.actionType) {
                    case ActionType.ADD_UPDATE:
                        descriptionComponent.draw(this.layerContext, data.id);
                        break;
                    case ActionType.DELETE:
                        descriptionComponent.remove(data.id);
                        break;
                    default:
                        console.error('unknown action type: ' + data.actionType)
                }
            })
        });
    }

    ngOnInit(): void {
    }

    removeAll(): void {
        this.billboardDrawerService.removeAll();
    }
}
