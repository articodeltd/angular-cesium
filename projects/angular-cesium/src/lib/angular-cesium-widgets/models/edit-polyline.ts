import { CallbackProperty, Cartesian3 } from 'cesium';
import { AcEntity } from '../../angular-cesium/models/ac-entity';
import { PolylineProps } from './polyline-edit-options';

export class EditPolyline extends AcEntity {
  static counter = 0;
  private editedEntityId: string;
  private id: string;
  private positions: Cartesian3[];
  private _polylineProps: PolylineProps;

  constructor(entityId: string, startPosition: Cartesian3, endPosition: Cartesian3, polylineProps?: PolylineProps) {
    super();
    this.editedEntityId = entityId;
    this.id = this.generateId();
    this.positions = [startPosition, endPosition];
    this._polylineProps = {...polylineProps};
  }

  get props(): PolylineProps {
    return this._polylineProps;
  }

  set props(value: PolylineProps) {
    this._polylineProps = value;
  }

  getEditedEntityId(): string {
    return this.editedEntityId;
  }

  getPositions(): any[] {
    return this.positions.map(p => p.clone());
  }


  getPositionsCallbackProperty(): CallbackProperty {
    return new CallbackProperty(this.getPositions.bind(this), false);
  }

  validatePositions(): boolean {
    return this.positions[0] !== undefined && this.positions[1] !== undefined;
  }

  getStartPosition() {
    return this.positions[0];
  }

  getEndPosition() {
    return this.positions[1];
  }

  setStartPosition(position: Cartesian3) {
    this.positions[0] = position;
  }

  setEndPosition(position: Cartesian3) {
    this.positions[1] = position;
  }

  getId(): string {
    return this.id;
  }

  private generateId(): string {
    return 'edit-polyline-' + EditPolyline.counter++;
  }
}
