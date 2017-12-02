import { Cartesian2 } from './cartesian2';
export interface Cartesian2 {
  x: number;
  y: number;

  equals(right: Cartesian2): boolean;

  clone(): Cartesian2;
}
