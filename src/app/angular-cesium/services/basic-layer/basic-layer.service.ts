import {ContentChildren, QueryList, AfterContentInit, ViewChildren, AfterViewInit} from "@angular/core";
import {AcLayerComponent} from "../../components/ac-layer/ac-layer.component";

export abstract class BasicLayer implements AfterViewInit, AfterContentInit{
    @ViewChildren(AcLayerComponent) acLayersView: QueryList<AcLayerComponent>;
    @ContentChildren(AcLayerComponent) acLayersContent: QueryList<AcLayerComponent>;
    constructor() {}

    ngAfterViewInit(): void {
        this.acLayersView.forEach((layer) => layer.init(this));
    }

    ngAfterContentInit(): void {
        this.acLayersContent.forEach((layer) => layer.init(this));
    }
}