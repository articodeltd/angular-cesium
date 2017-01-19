import {Component, OnInit, ViewChild} from "@angular/core";
import {Observable} from "rxjs";
import {AcNotification} from "../../angular-cesium/models/ac-notification";
import {ActionType} from "../../angular-cesium/models/action-type.enum";
import {AsyncService} from "../../utils/services/async/async.service";
import {AcLayerComponent} from "../../angular-cesium/components/ac-layer/ac-layer.component";

@Component({
    selector: 'tracks-layer',
    templateUrl: './tracks-layer.component.html',
    styleUrls: ['./tracks-layer.component.css']
})
export class TracksLayerComponent implements OnInit {
    @ViewChild('layer') layer: AcLayerComponent;
    @ViewChild('layer2') layer2: AcLayerComponent;

    tracks$: Observable<AcNotification>;
    Cesium = Cesium;
    showTracks = true;
    Polylinetracks$: Observable<AcNotification>;
    showPolylineTracks = true;

    constructor(private asyncService: AsyncService) {
    }

    ngOnInit() {
        let socket = io.connect('http://localhost:3000');
        this.tracks$ = Observable.create((observer) => {
            socket.on('birds', (data) => {
                this.asyncService.forEach(
                    data,
                    (acEntity) => {
                        let action;
                        if (acEntity.action === "ADD_OR_UPDATE") {
                            action = ActionType.ADD_UPDATE;
                        }
                        else if (acEntity.action === "DELETE") {
                            action = ActionType.DELETE
                        }
                        acEntity.actionType = action;
                        acEntity.entity = this.convertToCesiumObj(acEntity);
                        observer.next(acEntity);
                    },
                    2000);
            });
        });

        this.Polylinetracks$ = Observable.create((observer) => {
            socket.on('dynamic-polyline', (data) => {
                this.asyncService.forEach(
                    data,
                    (acDynamicPolyline) => {
                        let action;
                        if (acDynamicPolyline.action === "ADD_OR_UPDATE") {
                            action = ActionType.ADD_UPDATE;
                        }
                        else if (acDynamicPolyline.action === "DELETE") {
                            action = ActionType.DELETE
                        }
                        acDynamicPolyline.actionType = action;
                        acDynamicPolyline.entity = this.convertToCesiumDynamicPolyline(acDynamicPolyline);
                        observer.next(acDynamicPolyline);
                    },
                    2000);
            });
        });
    }

    convertToCesiumObj(data): any {
        return {
            image: data.entity.image,
            scale: data.id === 1 ? 0.3 : 0.15,
            color1: Cesium.Color.BLUE,
            color: data.id === 1 ? Cesium.Color.RED : undefined,
            position: Cesium.Cartesian3.fromRadians(Math.random(), Math.random()),
            position1: Cesium.Cartesian3.fromRadians(Math.random(), Math.random())
        }
    }

    convertToCesiumDynamicPolyline(data): any {
        return {
            width: data.entity.width,
            positions: Cesium.Cartesian3.fromDegreesArray([
                (Math.random() * 10), (Math.random() * 10),
                (Math.random() * 10), (Math.random() * 10),
                (Math.random() * 10), (Math.random() * 10)]),
            material: data.id === 1 ?
                new Cesium.Material({
                fabric : {
                    type : 'Color',
                    uniforms : {
                        color : new Cesium.Color(1.0, 0.0, 0.0, 1.0)
                    }
                }}) :
                new Cesium.Material({
                fabric : {
                    type : 'Color',
                    uniforms : {
                        color : new Cesium.Color(1.0, 1.0, 0.0, 1.0)
                    }
                }
            })
        };
    }

    removeAll() {
        this.layer.removeAll();
        this.layer2.removeAll();
    }
}
