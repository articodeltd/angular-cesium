import { AcEntity } from '../../src/models/ac-entity';
import { EditPoint } from './edit-point';
import { EditPolyline } from './edit-polyline';
import { Cartesian3 } from './position';
import { AcLayerComponent } from '../../src/components/ac-layer/ac-layer.component';

export class EditPolygon extends AcEntity {
  private editPoints = new Map<string, EditPoint>();
  private editPolylines = new Map<string, EditPolyline>();
  private positions: EditPoint[] = [];
  private movingPolyline: EditPolyline;
  private movingPoint: EditPoint;

  constructor(private id: string,
              private polygonsLayer: AcLayerComponent,
              private pointsLayer: AcLayerComponent,
              private polylinesLayer: AcLayerComponent) {
    super();
  }

  getPolyline(id: string): EditPolyline {
    return this.editPolylines.get(id);
  }

  getPoint(id: string): EditPoint {
    return this.editPoints.get(id);
  }

  addPoint(position: Cartesian3) {
    let point: EditPoint;
    if (this.movingPoint) {
      point = this.movingPoint;
      this.movingPoint = new EditPoint(this.id, position)
    }
    else {
      point = new EditPoint(this.id, position);
    }
    this.editPoints.set(point.getId(), point);
    if (!this.movingPolyline) {
      this.movingPolyline = new EditPolyline(this.id, position);
      point.setStartingPolyline(this.movingPolyline);
    }
    else {
      this.editPolylines.set(this.movingPolyline.getId(), this.movingPolyline);
      point.setEndingPolyline(this.movingPolyline);
      this.movingPolyline = new EditPolyline(this.id, position);
      point.setStartingPolyline(this.movingPolyline);
    }

    this.positions.push(point);

    this.updatePolygonsLayer();
    this.updatePointsLayer(point);
  }

  movePoint(position: Cartesian3, id?: string) {
    let point: EditPoint;
    if (!id) {
      if (!this.movingPoint) {
        return;
      }
      point = this.movingPoint;
    }
    else {
      point = this.editPoints.get(id);
      if (!point) {
        return;
      }
    }

    point.setPosition(position);

    this.updatePolygonsLayer();
    this.updatePointsLayer(point);
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
    this.removePosition(pointToRemove);

    if (this.getPointsCount() >= 3) {
      this.polygonsLayer.update(this, this.id);
    }
    this.pointsLayer.remove(pointToRemove.getId());
    this.polylinesLayer.remove(lineToRemove.getId());
    this.polylinesLayer.update(lineToModify, lineToModify.getId());
  }

  getPositions(): Cartesian3[] {
    return this.positions.map(position => position.getPosition());
  }

  private removePosition(point: EditPoint) {
    const index = this.positions.findIndex((p) => p === point);
    if (index < 0) {
      return;
    }
    this.positions.splice(index, 1);
  }

  private updatePolygonsLayer() {
    if (this.getPointsCount() >= 3) {
      this.polygonsLayer.update(this, this.id);
    }
  }

  private updatePointsLayer(point: EditPoint) {
    this.pointsLayer.update(point, point.getId());
    const startingPolyline = point.getStartingPolyline();
    if (startingPolyline) {
      this.polylinesLayer.update(startingPolyline, startingPolyline.getId());
    }

    const endingPolyline = point.getStartingPolyline();
    if (endingPolyline) {
      this.polylinesLayer.update(endingPolyline, endingPolyline.getId());
    }
  }

  dispose() {
    this.polygonsLayer.remove(this.id);
    this.editPoints.forEach(point => this.pointsLayer.remove(point.getId()));
    this.editPolylines.forEach(polyline => this.polylinesLayer.remove(polyline.getId()));
    if (this.movingPoint) {
      this.pointsLayer.remove(this.movingPoint.getId());
      this.movingPoint = undefined;
    }
    if (this.movingPolyline) {
      this.polylinesLayer.remove(this.movingPolyline.getId());
      this.movingPolyline = undefined;
    }
    this.positions.length = 0;
    this.editPoints.clear();
    this.editPolylines.clear();
  }

  getPointsCount(): number {
    return this.editPoints.size;
  }

  getId() {
    return this.id;
  }
}
