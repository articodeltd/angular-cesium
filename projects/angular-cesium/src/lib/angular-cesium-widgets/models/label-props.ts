import { Cartesian3 } from '../../angular-cesium/models/cartesian3';
import { Cartesian2 } from '../../angular-cesium/models/cartesian2';

export interface LabelStyle {
  show?: boolean;
  font?: string;
  style?: any;
  fillColor?: any;
  outlineColor?: any;
  backgroundColor?: any;
  backgroundPadding?: any;
  showBackground?: boolean;
  scale?: number;
  distanceDisplayCondition?: any;
  heightReference?: any;
  horizontalOrigin?: any;
  eyeOffset?: Cartesian3;
  position?: Cartesian3;
  pixelOffset?: Cartesian2;
  pixelOffsetScaleByDistance?: any;
  outlineWidth?: any;
  scaleByDistance?: any;
  translucencyByDistance?: any;
  verticalOrigin?: any;
}

export interface LabelProps {
  text: string;
  show?: boolean;
  font?: string;
  style?: any;
  fillColor?: any;
  outlineColor?: any;
  backgroundColor?: any;
  backgroundPadding?: any;
  showBackground?: boolean;
  scale?: number;
  distanceDisplayCondition?: any;
  heightReference?: any;
  horizontalOrigin?: any;
  eyeOffset?: Cartesian3;
  position?: Cartesian3;
  pixelOffset?: Cartesian2;
  pixelOffsetScaleByDistance?: any;
  outlineWidth?: any;
  scaleByDistance?: any;
  translucencyByDistance?: any;
  verticalOrigin?: any;
}

export const defaultLabelProps: LabelProps = {
  backgroundColor: new Cesium.Color(0.165, 0.165, 0.165, 0.7),
  backgroundPadding: new Cesium.Cartesian2(7, 5),
  distanceDisplayCondition: undefined,
  eyeOffset: new Cesium.Cartesian3(0, 0, -999),
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
