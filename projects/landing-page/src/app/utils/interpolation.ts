export interface InterpolationInput {
  data: any;
  time?: Date | number;
  cesiumSampledProperty?: any;
  interpolationOptions?: any;
}

export enum InterpolationType {
  POSITION = Cesium.SampledPositionProperty,
  GENERAL = Cesium.SampledProperty,
}

export function interpolate(input: InterpolationInput, interpolationType = InterpolationType.GENERAL) {
  const time = input.time ? Cesium.JulianDate.fromDate(new Date(input.time)) : Cesium.JulianDate.now();
  const cesiumSampledProperty = input.cesiumSampledProperty || new (interpolationType as any)();
  if (!input.cesiumSampledProperty) {
    cesiumSampledProperty.forwardExtrapolationType = Cesium.ExtrapolationType.HOLD;
    cesiumSampledProperty.forwardExtrapolationDuration = 0;
    cesiumSampledProperty.backwardExtrapolationType = Cesium.ExtrapolationType.HOLD;
    cesiumSampledProperty.backwardExtrapolationDuration = 0;
    const interpolationOptions = input.interpolationOptions || {
      interpolationDegree: 1,
      interpolationAlgorithm: Cesium.LinearApproximation
    };
    cesiumSampledProperty.setInterpolationOptions(interpolationOptions);
  }
  cesiumSampledProperty.addSample(time, input.data);
  return cesiumSampledProperty;
}
