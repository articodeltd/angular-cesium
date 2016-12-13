import {Component, OnInit, ChangeDetectorRef} from '@angular/core';
import {Observable} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title: string = 'app works!';
  track: any;
  tracks$: Observable<any>;
  staticPosition: Object;
  staticColor: Object;

  constructor(private cd: ChangeDetectorRef){
    this.track = {getImage: () => '', getPosition: () => ''};
    this.staticPosition = Cesium.Cartesian3.fromDegrees(-72.59777, 38.03883);
    this.staticColor = Cesium.Color.RED;
  }

  ngOnInit(){
    this.tracks$ = Observable.from([
      {
        id: 1,
        action: 'ADD_OR_UPDATE',
        entity: {
          getImage: () => "/assets/bear-tongue_1558824i.jpg",
          getPosition: () => Cesium.Cartesian3.fromDegrees(-25.59777, 80.03883)
        }
      },
      {
        id: 2,
        action: 'ADD_OR_UPDATE',
        entity: {
          getImage: () => "/assets/bear-tongue_1558824i.jpg",
          getPosition: () => Cesium.Cartesian3.fromDegrees(-45.59777, 20.03883)
        }
      }
    ]);

    // setTimeout(() => {
    //   this.track.getImage = () => "/assets/bear-tongue_1558824i.jpg";
    //   this.track.getPosition = () => Cesium.Cartesian3.fromDegrees(-25.59777, 80.03883);
    // }, 1000);

  }
}
