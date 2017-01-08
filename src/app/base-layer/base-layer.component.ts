import {Component, OnInit} from '@angular/core';
import {BasicLayer} from "../../angular-cesium/services/basic-layer/basic-layer.service";
import {Observable} from "rxjs";
import {AcEntity} from "../../angular-cesium/models/ac-entity";
import {ActionType} from "../../angular-cesium/models/action-type.enum";

@Component({
    selector: 'base-layer',
    templateUrl: './base-layer.component.html',
    styleUrls: ['./base-layer.component.css']
})
export class BaseLayerComponent extends BasicLayer implements OnInit {

    bases$: Observable<AcEntity>;

    constructor() {
        super();
        const base1: AcEntity = {
            id: 0,
            actionType: ActionType.ADD_UPDATE,
            entity: {name: 'eitan', position: Cesium.Cartesian3.fromRadians(0.5, 0.5)}
        };
        const base2  = {
            id: 1,
            actionType: ActionType.ADD_UPDATE,
            entity: {name: 'tomer', position: Cesium.Cartesian3.fromRadians(0.6, 0.6)}
        };
        const baseArray = [base1, base2];
        this.bases$ = Observable.from(baseArray);

        setTimeout(()=>{
            base2.entity.name = 'onen';
            super.update(base2);
        },5000)
    }

    ngOnInit() {
    }

}
