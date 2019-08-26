export interface Rectangle {
  west: number;
  south: number;
  east: number;
  north:number;

  equals(right: Rectangle): boolean;

  clone(): Rectangle;
}

