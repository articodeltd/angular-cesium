import {Component, OnInit} from "@angular/core";
import {Observable} from "rxjs";
import {BasicLayer} from "../../angular-cesium/services/basic-layer/basic-layer.service";
import {AcEntity} from "../../angular-cesium/models/ac-entity";
import {ActionType} from "../../angular-cesium/models/action-type.enum";
import {AsyncService} from "../../utils/services/async/async.service";

@Component({
  selector: 'tracks-layer',
  templateUrl: './tracks-layer.component.html',
  styleUrls: ['./tracks-layer.component.css']
})
export class TracksLayerComponent extends BasicLayer implements OnInit {

    tracks$: Observable<AcEntity>;
    Cesium = Cesium;
    showTracks =true;

    constructor(private asyncService: AsyncService) {
        super();
    }

    ngOnInit() {
        let socket = io.connect('http://localhost:3000');
        this.tracks$ = Observable.create((observer) => {
            socket.on('birds', (data) => {
                this.asyncService.forEach(
                    data,
                    (acEntity) => {
                        let action;
                        if(acEntity.action === "ADD_OR_UPDATE"){
                            action = ActionType.ADD_UPDATE;
                        }
                        else if(acEntity.action === "DELETE"){
                            action = ActionType.DELETE
                        }
                        acEntity.actionType = action;
                        acEntity.entity = this.convertToCesiumObj(acEntity);
                        observer.next(acEntity);
                    },
                    2000);
            });
        })
    }

    convertToCesiumObj(data): any {
        return {
            image: data.entity.image,
            scale: data.id === 1 ? 0.3 : 0.15,
            color: Cesium.Color.BLUE,
            color1: data.id === 1 ? Cesium.Color.RED : undefined,
            position: Cesium.Cartesian3.fromRadians(Math.random(), Math.random()),
            position1: Cesium.Cartesian3.fromRadians(Math.random(), Math.random())
        }
    }

    removeAll(){
        this.acLayersView.forEach((layer)=>layer.removeAll());
    }
}
