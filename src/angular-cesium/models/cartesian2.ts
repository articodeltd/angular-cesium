export interface Cartesian2 {
  x: number;
  y: number;

  equals(right): boolean;

  clone(): Cartesian2;
}
