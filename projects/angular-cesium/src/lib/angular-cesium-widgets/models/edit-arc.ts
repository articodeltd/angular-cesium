import { Cartesian3 } from 'cesium';
import { AcEntity } from '../../angular-cesium/models/ac-entity';
import { PolylineProps } from './polyline-edit-options';

export class EditArc extends AcEntity {
  static counter = 0;
  private id: string;
  private editedEntityId: string;
  private _center: Cartesian3;
  private _radius: number;
  private _delta: number;
  private _angle: number;

  constructor(entityId: string, center: Cartesian3, radius: number, delta: number, angle: number, private _arcProps: PolylineProps) {
    super();
    this.id = this.generateId();
    this.editedEntityId = entityId;
    this._center = center;
    this._radius = radius;
    this._delta = delta;
    this._angle = angle;
  }

  get props() {
    return this._arcProps;
  }

  set props(props: PolylineProps) {
    this._arcProps = props;
  }

  get angle(): number {
    return this._angle;
  }

  set angle(value: number) {
    this._angle = value;
  }

  get delta(): number {
    return this._delta;
  }

  set delta(value: number) {
    this._delta = value;
  }

  get radius(): number {
    return this._radius;
  }

  set radius(value: number) {
    this._radius = value;
  }

  get center(): Cartesian3 {
    return this._center;
  }

  set center(value: Cartesian3) {
    this._center = value;
  }

  updateCenter(center: Cartesian3) {
    this._center.x = center.x;
    this._center.y = center.y;
    this._center.z = center.z;
  }

  getId(): string {
    return this.id;
  }

  private generateId(): string {
    return 'edit-arc-' + EditArc.counter++;
  }
}
