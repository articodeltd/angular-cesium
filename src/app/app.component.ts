import {Component, OnInit, ChangeDetectorRef} from '@angular/core';
import {Observable, TimeInterval} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title: string = 'app works!';
  track: any;

  constructor(private cd: ChangeDetectorRef){
    this.track = {getImage: () => '', getPosition: () => ''};
  }

  ngOnInit(){
    setTimeout(() => {
      this.track.getImage = () => "/assets/airplane-png-25.png";
      this.track.getPosition = () => Cesium.Cartesian3.fromDegrees(-75.59777, 40.03883);
    }, 1000);
    setTimeout(() => {
      this.track.getPosition = () => Cesium.Cartesian3.fromDegrees(-25.59777, 80.03883);
    }, 5000);
  }
}
