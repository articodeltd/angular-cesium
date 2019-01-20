export interface Cartesian2 {
  x: number;
  y: number;

  equals(right: Cartesian2): boolean;

  clone(): Cartesian2;
}
