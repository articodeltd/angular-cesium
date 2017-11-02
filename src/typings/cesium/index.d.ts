declare const Cesium: any;

declare interface Cartesian2 {
  x: number,
  y: number,

  equals(right): boolean;
  clone(): Cartesian2;
}

declare interface Cartesian3 extends Cartesian2 {
  z: number;
  clone(): Cartesian3;
}
