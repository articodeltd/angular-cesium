import {ContentChildren, QueryList, AfterContentInit, ViewChildren, AfterViewInit} from "@angular/core";
import {AcLayerComponent} from "../../components/ac-layer/ac-layer.component";

export abstract class BasicLayer implements AfterViewInit {
    @ViewChildren(AcLayerComponent) acLayersView: QueryList<AcLayerComponent>;
    @ContentChildren(AcLayerComponent) acLayersContent: QueryList<AcLayerComponent>;

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
        console.log('basic layer');
        this.acLayersView.forEach((layer) => layer.init(this));
    }
}