import {Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'ac-map',
  templateUrl: './ac-map.component.html',
  styleUrls: ['./ac-map.component.css']
})
export class AcMapComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    var viewer = new Cesium.Viewer('cesiumContainer');
  }

}
