import { SampledPositionProperty, SampledProperty, ExtrapolationType, JulianDate, LinearApproximation } from 'cesium';

export interface InterpolationInput {
  data: any;
  time?: Date | number;
  cesiumSampledProperty?: any;
  interpolationOptions?: any;
}

export class InterpolationType {
  static POSITION = SampledPositionProperty;
  static GENERAL = SampledProperty;
}

export function interpolate(input: InterpolationInput, interpolationType: SampledPositionProperty | SampledProperty) {
  const time = input.time ? JulianDate.fromDate(new Date(input.time)) : JulianDate.now();
  const cesiumSampledProperty = input.cesiumSampledProperty || new (interpolationType as any)();
  if (!input.cesiumSampledProperty) {
    cesiumSampledProperty.forwardExtrapolationType = ExtrapolationType.HOLD;
    cesiumSampledProperty.forwardExtrapolationDuration = 0;
    cesiumSampledProperty.backwardExtrapolationType = ExtrapolationType.HOLD;
    cesiumSampledProperty.backwardExtrapolationDuration = 0;
    const interpolationOptions = input.interpolationOptions || {
      interpolationDegree: 1,
      interpolationAlgorithm: LinearApproximation
    };
    cesiumSampledProperty.setInterpolationOptions(interpolationOptions);
  }
  cesiumSampledProperty.addSample(time, input.data);
  return cesiumSampledProperty;
}
