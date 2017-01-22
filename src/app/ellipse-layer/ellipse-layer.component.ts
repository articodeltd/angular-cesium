import {Component, OnInit, ViewChild} from "@angular/core";
import {AcNotification} from "../../angular-cesium/models/ac-notification";
import {AcLayerComponent} from "../../angular-cesium/components/ac-layer/ac-layer.component";
import {Observable} from "rxjs";
import {TracksDataProvider} from "../../utils/services/dataProvider/tracksDataProvider.service";

@Component({
    selector: 'ellipse-layer',
    templateUrl: './ellipse-layer.component.html',
    providers:[TracksDataProvider]
})
export class EllipseLayerComponent implements OnInit {
    @ViewChild(AcLayerComponent) layer: AcLayerComponent;

    ellipses$: Observable<AcNotification>;
    Cesium = Cesium;
    show = true;

    constructor(private tracksDataProvider: TracksDataProvider) {
    }

    ngOnInit() {
        this.ellipses$ = this.tracksDataProvider.get();
    }

    removeAll() {
        this.layer.removeAll();
    }
}
