import { Component, OnInit, ViewChild } from '@angular/core';
import { AcArcComponent, AcHtmlComponent, AcLabelComponent } from 'angular-cesium';

@Component({
  selector: 'draw-on-map-layer',
  templateUrl: 'draw-on-map-layer.component.html'
})
export class DrawOnMapComponent implements OnInit {
  Cesium = Cesium;
  position: any;
  aquamarine: any;
  positions: any;
  polylineMaterial: any;
  toggle: boolean;
  longitude: number;
  latitude: number;
  radius: number;
  htmlElement: string;
  center = Cesium.Cartesian3.fromDegrees(Math.random() * 90 - 40, Math.random() * 90 - 40);

  delta = Math.PI;
  arcRadius = Math.random() * 1000000;
  angle = Math.random() * 3 - 1;
  color = Cesium.Color.RED;
  attributes = {
    color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.fromRandom())
  };
  appearance: any;

  @ViewChild(AcLabelComponent) label: AcLabelComponent;
  @ViewChild(AcHtmlComponent) html: AcHtmlComponent;
  @ViewChild(AcArcComponent) arc: AcArcComponent;

  constructor() {
  }

  ngOnInit() {
    const colorMaterial = Cesium.Material.fromType('Color');
    colorMaterial.uniforms.color = Cesium.Color.YELLOW;
    this.appearance = new Cesium.PolylineMaterialAppearance({
      material: colorMaterial
    });

    this.radius = 800000.0;
    this.toggle = true;
    this.htmlElement = 'HTML';
    this.longitude = 35.1;
    this.latitude = 0.1;
    this.position = Cesium.Cartesian3.fromDegrees(34.0, 32.0);
    this.positions = Cesium.Cartesian3.fromDegreesArray([
      34.1, 35.1,
      this.longitude, this.latitude
    ]);

    this.polylineMaterial = Cesium.Color.RED;

    this.aquamarine = Cesium.Color.AQUAMARINE;

    setTimeout(() => {
      this.position = Cesium.Cartesian3.fromDegrees(40.0, 40.0);
      this.htmlElement = 'NEW HTML';
    }, 5000);

    setInterval(() => {
      this.positions = Cesium.Cartesian3.fromDegreesArray(
        [
          34.1, 35.1,
          ++this.longitude, ++this.latitude
        ]);
    }, 500);
  }
}
