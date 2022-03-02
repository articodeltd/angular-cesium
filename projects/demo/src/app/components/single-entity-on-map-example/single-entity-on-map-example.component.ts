import { Component, OnInit, ViewChild } from '@angular/core';
import { Color, Cartesian3, ColorGeometryInstanceAttribute, PolylineMaterialAppearance, Material } from 'cesium';
import { AcArcComponent, AcHtmlComponent, AcLabelComponent } from 'angular-cesium';

@Component({
  selector: 'single-entity-on-map-example',
  templateUrl: 'single-entity-on-map-example.component.html'
})
export class SingleEntityOnMapExampleComponent implements OnInit {
  // Cesium = Cesium;
  Color = Color;
  position: any;
  aquamarine: any;
  positions: any;
  polylineMaterial: any;
  toggle: boolean;
  longitude: number;
  latitude: number;
  radius: number;
  htmlElement: string;
  center = Cartesian3.fromDegrees(Math.random() * 90 - 40, Math.random() * 90 - 40);

  delta = Math.PI;
  arcRadius = Math.random() * 1000000;
  angle = Math.random() * 3 - 1;
  color = Color.RED;
  attributes = {
    color: ColorGeometryInstanceAttribute.fromColor(Color.fromRandom())
  };
  appearance: any;

  @ViewChild(AcLabelComponent) label: AcLabelComponent;
  @ViewChild(AcHtmlComponent) html: AcHtmlComponent;
  @ViewChild(AcArcComponent) arc: AcArcComponent;

  constructor() {
  }

  ngOnInit() {
    const colorMaterial = Material.fromType('Color');
    colorMaterial.uniforms.color = Color.YELLOW;
    this.appearance = new PolylineMaterialAppearance({
      material: colorMaterial
    });

    this.radius = 800000.0;
    this.toggle = true;
    this.htmlElement = 'HTML';
    this.longitude = 35.1;
    this.latitude = 0.1;
    this.position = Cartesian3.fromDegrees(34.0, 32.0);
    this.positions = Cartesian3.fromDegreesArray([
      34.1, 35.1,
      this.longitude, this.latitude
    ]);

    this.polylineMaterial = Color.RED;

    this.aquamarine = Color.AQUAMARINE;

    setTimeout(() => {
      this.position = Cartesian3.fromDegrees(40.0, 40.0);
      this.htmlElement = 'NEW HTML';
    }, 5000);

    setInterval(() => {
      this.positions = Cartesian3.fromDegreesArray(
        [
          34.1, 35.1,
          ++this.longitude, ++this.latitude
        ]);
    }, 500);
  }
}
