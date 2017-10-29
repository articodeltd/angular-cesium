declare const Cesium: any;

declare interface Cartesian2 {
    x: number,
    y: number,
    equals(right): boolean
}

declare interface Cartesian3 extends Cartesian2 {
    z: number
}
