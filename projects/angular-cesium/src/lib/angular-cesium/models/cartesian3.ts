import { Cartesian2 } from './cartesian2';

export interface Cartesian3 extends Cartesian2 {
  z: number;

  clone(): Cartesian3;

  equals(other: Cartesian3): boolean;
}
