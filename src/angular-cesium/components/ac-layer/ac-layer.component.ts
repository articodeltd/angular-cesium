import {BillboardDrawerService} from "./../../services/billboard-drawer/billboard-drawer.service";
import {Component, OnInit, Input, OnChanges, SimpleChanges} from "@angular/core";
import {Observable} from "rxjs";
import {LayerService} from "../../services/layer-service/layer-service.service";
import {acEntity} from "../../models/ac-entity";
import {ActionType} from "../../models/action-type.enum";
import {ComputationCache} from "../../services/computation-cache/computation-cache.service";
import {LabelDrawerService} from "../../services/label-drawer/label-drawer.service";
import {SimpleDrawerService} from "../../services/simple-drawer/simple-drawer.service";

@Component({
    selector: 'ac-layer',
    templateUrl: './ac-layer.component.html',
    styleUrls: ['./ac-layer.component.css'],
    providers: [LayerService, ComputationCache, BillboardDrawerService, LabelDrawerService]
})
export class AcLayerComponent implements OnInit, OnChanges {

    @Input()
    show:boolean = true;

    @Input()
    acFor:string;
    entityName:string;
    observable:Observable<acEntity>;
    layerContext:any;
    _drawerList:SimpleDrawerService[] = [];

    constructor(private  layerService:LayerService,
                private _computationCache:ComputationCache,
                billboardDrawerService:BillboardDrawerService,
                labelDrawerService: LabelDrawerService) {
        this._drawerList.push(billboardDrawerService);
        this._drawerList.push(labelDrawerService);
    }

    init(context) {
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

    ngOnInit():void {
    }

    ngOnChanges(changes:SimpleChanges):void {
        if (changes['show']) {
            const showValue = changes['show'].currentValue;
            this._drawerList.forEach((drawer)=>drawer.setShow(showValue));
        }
    }

    removeAll():void {
        this._drawerList.forEach((drawer)=>drawer.removeAll());
    }

}
