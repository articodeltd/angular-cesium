import { AcEntity } from '../../src/models/ac-entity';
import { EditPoint } from './edit-point';
import { EditPolyline } from './edit-polyline';

export class EditPolygon extends AcEntity {
  private editPoints = new Map<string, EditPoint>();
  private editPolylines = new Map<string, EditPolyline>();
  private positions = [];
  private activePolyline: EditPolyline;

  constructor(private id: string) {
    super();
  }

  getPolyline(id: string): EditPolyline {
    return this.editPolylines.get(id);
  }

  getPoint(id: string): EditPoint {
    return this.editPoints.get(id);
  }

  addPoint(position) {
    const point = new EditPoint(this.id, this.positions);
    this.editPoints.set(point.getId(), point);
    if (!this.activePolyline) {
      this.activePolyline = new EditPolyline(this.id, position);
      point.setStartingPolyline(this.activePolyline);
    }
    else {
      this.editPolylines.set(this.activePolyline.getId(), this.activePolyline);
      point.setEndingPolyline(this.activePolyline);
      this.activePolyline = new EditPolyline(this.id, position);
      point.setStartingPolyline(this.activePolyline);
    }
    this.positions.push(point.getPosition());
  }

  removePoint(id: string) {
    const pointToRemove = this.editPoints.get(id);
    if (!pointToRemove) {
      return;
    }
    const lineToRemove = pointToRemove.getStartingPolyline();
    const lineToModify = pointToRemove.getEndingPolyline();
    lineToModify.setEndPosition(lineToRemove.getEndPosition());
    this.editPolylines.delete(lineToRemove.getId());
    this.editPoints.delete(pointToRemove.getId());
  }

  getPointsCount(): number {
    return this.editPoints.size;
  }

  getId() {
    return this.id;
  }
}
