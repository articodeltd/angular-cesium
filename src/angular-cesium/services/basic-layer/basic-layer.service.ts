import {ContentChildren, QueryList, AfterContentInit, ViewChildren, AfterViewInit} from "@angular/core";
import {AcLayerComponent} from "../../components/ac-layer/ac-layer.component";
import {AcEntity} from "../../models/ac-entity";

export abstract class BasicLayer implements AfterViewInit {
    @ViewChildren(AcLayerComponent) acLayersView: QueryList<AcLayerComponent>;

    constructor() {
        //Used to prevent overriding of our core function
        let originalFunc = this.ngAfterViewInit;
        this.ngAfterViewInit = () => {
            originalFunc();
            this.initAcLayersView()
        };
    }

    ngAfterViewInit(): void {
        //no op
    }

    private initAcLayersView(): void {
        this.acLayersView.forEach((layer) => layer.init(this));
    }

    update(entity: AcEntity){
        // TODO
        // 1. maybe use ViewChild ? could there be more then 1 ac-layer. if so user can use this.layer
        // 2. using ViewChild in child component cause error!
        this.acLayersView.forEach((layer)=>layer.update(entity));
    }
}