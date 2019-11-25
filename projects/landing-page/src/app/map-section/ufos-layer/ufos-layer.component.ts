import { Component } from "@angular/core";
import { AcNotification, ActionType } from "angular-cesium";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { MockDataProviderService } from "../../services/mock-data-provider.service";
import { interpolate, InterpolationType } from "../../utils/interpolation";

@Component({
  selector: "ufos-layer",
  templateUrl: "./ufos-layer.component.html"
})
export class UFOsLayerComponent {
  private ufos$: Observable<AcNotification>;
  private ufosPosition = new Map<string, any>();
  private beamsPosition = new Map<string, any>();
  private Cesium = Cesium;
  private initialTime;

  ufoBeamColor = Cesium.Color.BLUE.withAlpha(0.2);

  constructor(private mockDataProvider: MockDataProviderService) {
    this.ufos$ = mockDataProvider
      .getDataSteam$(30, 1000, {
        minHeight: 500,
        maxHeight: 1500,
        maxLat: Cesium.Math.toRadians(40.9),
        minLon: Cesium.Math.toRadians(-74.2),
        minLat: Cesium.Math.toRadians(40.6),
        maxLon: Cesium.Math.toRadians(-73.8)
      })
      .pipe(
        map(entity => ({
          id: entity.id,
          actionType: ActionType.ADD_UPDATE,
          entity
        }))
      );

      this.initialTime = Date.now() + TIME_ADDITION;
  }

  interpolatePosition(entity) {
    const now = Date.now();
    const ufo =  interpolate({
      data: Cesium.Cartographic.toCartesian(entity.position),
      time: this.initialTime + (now + TIME_ADDITION - this.initialTime) * TIME_MULTIPLIER,
      cesiumSampledProperty: this.ufosPosition.get(entity.id)
    }, InterpolationType.POSITION);

    const beam =  interpolate({
      data: Cesium.Cartesian3.fromRadians(entity.position.longitude + Cesium.Math.toRadians(0.002), entity.position.latitude, entity.position.height / 2),
      time: this.initialTime + (now + TIME_ADDITION - this.initialTime) * TIME_MULTIPLIER,
      cesiumSampledProperty: this.beamsPosition.get(entity.id)
    }, InterpolationType.POSITION);

    this.ufosPosition.set(entity.id, ufo);
    this.beamsPosition.set(entity.id, beam);

    return ufo;
  }

  interpolateBeamPosition(entity) {
    return this.beamsPosition.get(entity.id);
  }

  shouldShowBeam() {
    return Math.random() <= 0.2;
  }
}

const TIME_MULTIPLIER = 1000;
const TIME_ADDITION = 1000 * TIME_MULTIPLIER;
