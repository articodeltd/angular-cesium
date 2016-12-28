import {Component, OnInit, ElementRef, Inject} from "@angular/core";
import {DOCUMENT} from "@angular/platform-browser";
import {CesiumService} from "../../services/cesium/cesium.service";
import {BillboardDrawerService} from "../../services/billboard-drawer/billboard-drawer.service";


@Component({
    selector: 'ac-map',
    templateUrl: './ac-map.component.html',
    providers: [CesiumService, BillboardDrawerService]
})
export class AcMapComponent implements OnInit {

    constructor(private _cesiumService:CesiumService, private _elemRef:ElementRef, @Inject(DOCUMENT) private document: any) {
        let mapContainer = this.document.createElement('div');
        this._elemRef.nativeElement.appendChild(mapContainer);
        this._cesiumService.init(mapContainer);

    }

    ngOnInit() {

    }

}
