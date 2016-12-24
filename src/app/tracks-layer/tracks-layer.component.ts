import {Component, OnInit} from "@angular/core";
import {Observable} from "rxjs";
import {BasicLayer} from "../../angular-cesium/services/basic-layer/basic-layer.service";
import {acEntity} from "../../angular-cesium/models/ac-entity";

@Component({
  selector: 'tracks-layer',
  templateUrl: './tracks-layer.component.html',
  styleUrls: ['./tracks-layer.component.css']
})
export class TracksLayerComponent extends BasicLayer implements OnInit {

  tracks$ : Observable<acEntity>;
  Cesium = Cesium;

  constructor() {
    super();
  }

  ngOnInit() {
    let socket = io.connect('http://localhost:3000');
    this.tracks$ = Observable.create((observer) => {
      socket.on('birds', (data) => {
        data.forEach((acEntity) => {
          acEntity.entity = this.convertToCesiumObj(acEntity);
          observer.next(acEntity);
        });
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
}
