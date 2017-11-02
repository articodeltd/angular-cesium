export interface Cartesian3 extends Cartesian2 {
  z: number;

  clone(): Cartesian3;

  equals(Cartesian3): boolean;
}
