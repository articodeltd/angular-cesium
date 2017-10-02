import { Component, OnInit, ViewChild } from '@angular/core';
import { AcLabelComponent } from '../../../../src/angular-cesium/components/ac-label/ac-label.component';
import { AcHtmlComponent } from '../../../../src/angular-cesium/components/ac-html/ac-html.component';
import { AcArcComponent } from '../../../../src/angular-cesium/components/ac-arc/ac-arc.component';

@Component({
  selector: 'draw-on-map-layer',
  templateUrl: 'draw-on-map-layer.component.html'
})
export class DrawOnMapComponent implements OnInit {
  private toggle: boolean;
  private position: any;
  private positions: any;
  private polylineMaterial: any;
  private aquamarine: any;
  private longitude: number;
  private latitude: number;
  private radius: number;
  private htmlElement: string;
  public Cesium = Cesium;
  private center = Cesium.Cartesian3.fromDegrees(Math.random() * 90 - 40, Math.random() * 90 - 40);

  private delta = Math.PI;
  private arcRadius = Math.random() * 1000000;
  private angle = Math.random() * 3 - 1;
  private color = Cesium.Color.RED;
  private attributes = {
    color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.fromRandom())
  };
  private appearance: any;

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
