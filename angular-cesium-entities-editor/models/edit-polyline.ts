import { AcEntity } from '../../src/models/ac-entity';

export class EditPolyline extends AcEntity {
  private editedEntityId: string;
  private id: string;
  private counter = 0;
  private positions = [];

  constructor(entityId: string, startPosition?, endPosition?) {
    super();
    this.editedEntityId = entityId;
    this.id = this.generateId();
    this.positions = [startPosition, endPosition]
  }

  getEditedEntityId(): string {
    return this.editedEntityId;
  }

  getPositions(): any[] {
    return this.positions;
  }

  getStartPosition() {
    return this.positions[0];
  }

  getEndPosition() {
    return this.positions[1];
  }

  setStartPosition(position) {
    this.positions[0] = position;
  }

  setEndPosition(position) {
    this.positions[1] = position;
  }

  getId(): string {
    return this.id;
  }

  private generateId(): string {
    return 'editpoint-' + this.counter++;
  }
}
