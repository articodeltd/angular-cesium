import { Cartesian3, Cartesian2 } from 'cesium';
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
    disableDepthTestDistance?: number;
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
    disableDepthTestDistance?: number;
}
export declare const defaultLabelProps: LabelProps;
