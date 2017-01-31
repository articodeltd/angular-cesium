import {Component, OnInit, Input} from '@angular/core';
import {CesiumService} from "../../services/cesium/cesium.service";

@Component({
  selector: 'ac-map-layer-provider',
  templateUrl: 'ac-map-layer-provider.component.html',
  styleUrls: ['ac-map-layer-provider.component.css']
})
export class AcMapLayerProviderComponent implements OnInit {
  @Input()
  url: string;
  @Input()
  layers: string;
  @Input()
  srs: string;

  constructor(private cesiumService: CesiumService) { }

  ngOnInit() {
  }

}
