import {BillboardDrawerService} from "./../../services/billboard-drawer/billboard-drawer.service";
import {Component, OnInit, Input, OnChanges, SimpleChanges, AfterContentInit} from "@angular/core";
import {Observable, Subject} from "rxjs";
import {LayerService} from "../../services/layer-service/layer-service.service";
import {AcEntity} from "../../models/ac-entity";
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
export class AcLayerComponent implements OnInit, OnChanges , AfterContentInit {
    @Input()
    show:boolean = true;
    @Input()
    acFor:string;
    @Input()
    context:any;

    private entityName:string;
    private observable:Observable<AcEntity>;
    private _drawerList:SimpleDrawerService[] = [];
    private _updateStream: Subject<AcEntity> = new Subject<AcEntity>();

    constructor(private  layerService:LayerService,
                private _computationCache:ComputationCache,
                billboardDrawerService:BillboardDrawerService,
                labelDrawerService: LabelDrawerService) {
        this._drawerList.push(billboardDrawerService);
        this._drawerList.push(labelDrawerService);
    }

    init() {
        const acForArr = this.acFor.split(' ');
        this.observable = this.context[acForArr[3]];
        this.entityName = acForArr[1];

        this.observable.merge(this._updateStream).subscribe((data) => {
            this._computationCache.clear();
            this.context[this.entityName] = data.entity;
            this.layerService.getDescriptions().forEach((descriptionComponent) => {
                switch (data.actionType) {
                    case ActionType.ADD_UPDATE:
                        descriptionComponent.draw(this.context, data.id);
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

    ngAfterContentInit(): void {
        this.init();
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
        this.layerService.getDescriptions().forEach((description)=>description.removeAll());
    }

    remove(entityId: number){
        this._updateStream.next({id: entityId, actionType: ActionType.DELETE})
    }
    update(entity: AcEntity): void{
        this._updateStream.next(entity);
    }

    refreshAll(collection : AcEntity[]): void{
        Observable.from(collection).subscribe((entity)=>this._updateStream.next(entity));
    }
}
