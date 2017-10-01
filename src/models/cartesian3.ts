export interface Cartesian3 {
  x: number;
  y: number;
  z: number;
  clone(): Cartesian3;
  equals(Cartesian3): boolean;
}
