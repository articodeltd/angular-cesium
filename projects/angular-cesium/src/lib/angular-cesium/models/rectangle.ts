export interface Rectangle {
  west: number;
  south: number;
  east: number;
  north: number;
  width?: number;

  equals(right: Rectangle): boolean;

  clone(): Rectangle;
}

