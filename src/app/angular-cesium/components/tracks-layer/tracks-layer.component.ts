import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs";
import {BasicLayer} from "../../services/basic-layer/basic-layer.service";

@Component({
  selector: 'tracks-layer',
  templateUrl: './tracks-layer.component.html',
  styleUrls: ['./tracks-layer.component.css']
})
export class TracksLayerComponent extends BasicLayer implements OnInit {

  tracks$ : Observable<any>;
  Cesium = Cesium;

  constructor() {
    super();
  }

  ngOnInit() {
    let socket = io.connect('http://localhost:3000');
    this.tracks$ = Observable.create((observer) => {
      socket.on('birds', (data) => {
        data.forEach((entity) => {
          entity.entity = this.convertToCesiumObj(entity);
          observer.next(entity);
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
