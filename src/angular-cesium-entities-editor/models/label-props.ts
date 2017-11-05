export interface LabelProps {
  text: string;
  show?: boolean;
  font?: string;
  style?;
  fillColor?;
  outlineColor?;
  backgroundColor?;
  backgroundPadding?;
  showBackground?: boolean;
  scale?: number;
  distanceDisplayCondition?;
  heightReference?;
  horizontalOrigin?;
  eyeOffset?: Cartesian3;
  position?: Cartesian3;
  pixelOffset?: Cartesian2;
  pixelOffsetScaleByDistance?;
  outlineWidth?;
  scaleByDistance?;
  translucencyByDistance?;
  verticalOrigin?;
}

export const defaultLabelProps: LabelProps = {
  backgroundColor: new Cesium.Color(0.165, 0.165, 0.165, 0.8),
  backgroundPadding: new Cesium.Cartesian2(7, 5),
  distanceDisplayCondition: undefined,
  eyeOffset: Cesium.Cartesian3.ZERO,
  fillColor: Cesium.Color.WHITE,
  font: '30px sans-serif',
  heightReference: Cesium.HeightReference.NONE,
  horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
  outlineColor: Cesium.Color.BLACK,
  outlineWidth: 1.0,
  pixelOffset: Cesium.Cartesian2.ZERO,
  pixelOffsetScaleByDistance: undefined,
  scale: 1.0,
  scaleByDistance: undefined,
  show: true,
  showBackground: false,
  style: Cesium.LabelStyle.FILL,
  text: '',
  translucencyByDistance: undefined,
  verticalOrigin: Cesium.VerticalOrigin.BASELINE,
};
