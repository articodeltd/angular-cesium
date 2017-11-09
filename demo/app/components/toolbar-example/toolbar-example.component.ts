import { Component, OnInit } from '@angular/core';
import { CameraService } from '../../../../src/angular-cesium/services/camera/camera.service';
import { PolylinesEditorService } from '../../../../src/angular-cesium-widgets/services/entity-editors/polyline-editor/polylines-editor.service';
import { EditActions } from '../../../../src/angular-cesium-widgets/models/edit-actions.enum';
import { CoordinateConverter } from '../../../../src/angular-cesium/services/coordinate-converter/coordinate-converter.service';
import { PolylineEditorObservable } from '../../../../src/angular-cesium-widgets/models/polyline-editor-observable';

@Component({
  selector: 'toolbar-example',
  templateUrl: 'toolbar-example.component.html',
})
export class ToolbarExampleComponent implements OnInit {

  rnb: PolylineEditorObservable;

  constructor(private cameraService: CameraService, private polylineEditor: PolylinesEditorService,
              private coordinateConverter: CoordinateConverter) {
  }

  ngOnInit() {
  }

  rangeAndBearing() {
    if (this.rnb) {
      this.rnb.dispose();
    }
    this.rnb = this.polylineEditor.create({
      maximumNumberOfPoints: 2,
      pointProps: {
        show: false,
        showVirtual: false,
      },
      polylineProps: {
        width: 10,
        material: () => Cesium.Material.fromType('PolylineArrow', { color: new Cesium.Color(0.0, 0.0, 1.0, 1.0) }),
      }
    });
    this.rnb.filter(e => e.editAction === EditActions.ADD_LAST_POINT).subscribe(() => this.rnb.disable());
    this.rnb.setLabelsRenderFn((update) => {
      if (!update.positions[0]) {
        return [];
      }
      const position = update.positions[1] ? update.positions[1] : update.updatedPosition;
      return [
        {
          text: `Range: ${(Cesium.Cartesian3.distance(update.positions[0], position) / 1000).toFixed(2)}`,
          scale: 0.6,
          eyeOffset: new Cesium.Cartesian3(0, 0, -1000),
          pixelOffset: new Cesium.Cartesian2(-50, -40),
          position,
          fillColor: Cesium.Color.RED,
          showBackground: true,
        },
        {
          text: `Bearing: ${this.coordinateConverter.bearingToCartesian(update.positions[0], position).toFixed(2)}`,
          scale: 0.6,
          eyeOffset: new Cesium.Cartesian3(0, 0, -1000),
          pixelOffset: new Cesium.Cartesian2(-50, -15),
          position,
          fillColor: Cesium.Color.RED,
          showBackground: true,
        },
      ];
    })
  }

  goHome() {
    this.cameraService.cameraFlyTo({ destination: Cesium.Cartesian3.fromDegrees(35.21, 31.77, 200000) })
  }

}
