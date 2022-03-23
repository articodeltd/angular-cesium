import { Component } from '@angular/core';
import { Math as cMath, Color, Cartographic, Cartesian3 } from 'cesium';
import { AcNotification, ActionType } from '@auscope/angular-cesium';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MockDataProviderService } from '../../services/mock-data-provider.service';
import { interpolate, InterpolationType } from '../../utils/interpolation';

@Component({
  selector: 'ufos-layer',
  templateUrl: './ufos-layer.component.html'
})
export class UFOsLayerComponent {
  private ufos$: Observable<AcNotification>;
  private ufosPosition = new Map<string, any>();
  private beamsPosition = new Map<string, any>();
  private Cesium = Cesium;
  private initialTime;

  ufoBeamColor = Color.BLUE.withAlpha(0.2);

  constructor(private mockDataProvider: MockDataProviderService) {
    this.ufos$ = mockDataProvider
      .getDataSteam$(30, 1000, {
        minHeight: 500,
        maxHeight: 1500,
        maxLat: cMath.toRadians(40.9),
        minLon: cMath.toRadians(-74.2),
        minLat: cMath.toRadians(40.6),
        maxLon: cMath.toRadians(-73.8)
      })
      .pipe(
        map(entity => ({
          id: (entity as any).id,
          actionType: ActionType.ADD_UPDATE,
          entity
        }))
      );

    this.initialTime = Date.now() + TIME_ADDITION;
  }

  interpolatePosition(entity) {
    const now = Date.now();
    const ufo = interpolate({
      data: Cartographic.toCartesian(entity.position),
      time: this.initialTime + (now + TIME_ADDITION - this.initialTime) * TIME_MULTIPLIER,
      cesiumSampledProperty: this.ufosPosition.get(entity.id)
    }, new InterpolationType.POSITION());

    const beam = interpolate({
      data: Cartesian3.fromRadians(entity.position.longitude + cMath.toRadians(0.002), entity.position.latitude, entity.position.height / 2),
      time: this.initialTime + (now + TIME_ADDITION - this.initialTime) * TIME_MULTIPLIER,
      cesiumSampledProperty: this.beamsPosition.get(entity.id)
    }, new InterpolationType.POSITION());

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
