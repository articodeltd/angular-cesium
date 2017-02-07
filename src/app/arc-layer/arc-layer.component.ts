import { Component, AfterViewInit, OnInit, ViewChild } from "@angular/core";
import { ActionType } from "../../angular-cesium/models/action-type.enum";
import { Observable } from "rxjs";
import { AcNotification } from "../../angular-cesium/models/ac-notification";
import { AcLayerComponent } from "../../angular-cesium/components/ac-layer/ac-layer.component";

@Component({
    selector: 'arc-layer',
    templateUrl: './arc-layer.component.html'
})

export class ArcLayerComponent implements OnInit, AfterViewInit {
    arcs$: Observable<AcNotification>;
    @ViewChild(AcLayerComponent) layer: AcLayerComponent;


    constructor() {
        const arcArray = [];
        for (let i = 0; i < 1000; i++) {
            let randCenter = Cesium.Cartesian3.fromDegrees(Math.random() * 90 - 40, Math.random() * 90 - 40);
            let randomDelta = Math.PI;
            let randomRadius = Math.random() * 1000000;
            let randomAngle = Math.random() * 3 - 1;
            arcArray.push({
                id: i,
                actionType: ActionType.ADD_UPDATE,
                entity: {
                    angle: randomAngle,
                    delta: randomDelta,
                    radius: randomRadius,
                    name: 'base haifa',
                    center: randCenter,
                    color: Cesium.Color.RED
                }
            })
        }

        this.arcs$ = Observable.from(arcArray);
    }

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
    }


}