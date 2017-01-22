import {Component, OnInit, ViewChild} from "@angular/core";
import {Observable} from "rxjs";
import {AcNotification} from "../../angular-cesium/models/ac-notification";
import {AcLayerComponent} from "../../angular-cesium/components/ac-layer/ac-layer.component";
import {TracksDataProvider} from "../../utils/services/dataProvider/tracksDataProvider.service";

@Component({
    selector: 'tracks-layer',
    templateUrl: './tracks-layer.component.html',
    styleUrls: ['./tracks-layer.component.css'],
    providers:[TracksDataProvider]
})
export class TracksLayerComponent implements OnInit {
    @ViewChild(AcLayerComponent) layer: AcLayerComponent;

    tracks$: Observable<AcNotification>;
    Cesium = Cesium;
    showTracks = true;

    constructor(private tracksDataProvider: TracksDataProvider) {
    }

    ngOnInit() {
        this.tracks$ = this.tracksDataProvider.get();
    }

    removeAll() {
        this.layer.removeAll();
    }
}
