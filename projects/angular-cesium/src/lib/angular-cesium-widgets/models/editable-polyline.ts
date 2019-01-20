import { AcEntity } from '../../angular-cesium/models/ac-entity';
import { EditPoint } from './edit-point';
import { EditPolyline } from './edit-polyline';
import { AcLayerComponent } from '../../angular-cesium/components/ac-layer/ac-layer.component';
import { Cartesian3 } from '../../angular-cesium/models/cartesian3';
import { CoordinateConverter } from '../../angular-cesium/services/coordinate-converter/coordinate-converter.service';
import { PointProps, PolylineEditOptions, PolylineProps } from './polyline-edit-options';
import { GeoUtilsService } from '../../angular-cesium/services/geo-utils/geo-utils.service';
import { defaultLabelProps, LabelProps } from './label-props';

export class EditablePolyline extends AcEntity {
  private positions: EditPoint[] = [];

  private polylines: EditPolyline[] = [];
  private movingPoint: EditPoint;
  private doneCreation = false;
  private _enableEdit = true;
  private _pointProps: PointProps;
  private polylineProps: PolylineProps;
  private lastDraggedToPosition: any;
  private _labels: LabelProps[] = [];

  constructor(private id: string,
              private pointsLayer: AcLayerComponent,
              private polylinesLayer: AcLayerComponent,
              private coordinateConverter: CoordinateConverter,
              private editOptions: PolylineEditOptions,
              positions?: Cartesian3[]) {
    super();
    this._pointProps = editOptions.pointProps;
    this.props = editOptions.polylineProps;
    if (positions && positions.length >= 2) {
      this.createFromExisting(positions);
    }
  }

  get labels(): LabelProps[] {
    return this._labels;
  }

  set labels(labels: LabelProps[]) {
    if (!labels) {
      return;
    }
    const positions = this.getRealPositions();
    this._labels = labels.map((label, index) => {
      if (!label.position) {
        label.position = positions[index];
      }

      return Object.assign({}, defaultLabelProps, label);
    });
  }

  get props(): PolylineProps {
    return this.polylineProps;
  }

  set props(value: PolylineProps) {
    this.polylineProps = value;
  }

  get pointProps(): PointProps {
    return this._pointProps;
  }

  set pointProps(value: PointProps) {
    this._pointProps = value;
  }

  get enableEdit() {
    return this._enableEdit;
  }

  set enableEdit(value: boolean) {
    this._enableEdit = value;
    this.positions.forEach(point => {
      point.show = value;
      this.updatePointsLayer(false, point);
    });
  }

  private createFromExisting(positions: Cartesian3[]) {
    positions.forEach((position) => {
      this.addPointFromExisting(position);
    });
    this.addAllVirtualEditPoints();
    this.doneCreation = true;
  }

  setManually(points: {
    position: Cartesian3,
    pointProp?: PointProps
  }[] | Cartesian3[], polylineProps?: PolylineProps) {
    if (!this.doneCreation) {
      throw new Error('Update manually only in edit mode, after polyline is created');
    }
    this.positions.forEach(p => this.pointsLayer.remove(p.getId()));

    const newPoints: EditPoint[] = [];
    for (let i = 0; i < points.length; i++) {
      const pointOrCartesian: any = points[i];
      let newPoint = null;
      if (pointOrCartesian.pointProps) {
        newPoint = new EditPoint(this.id, pointOrCartesian.position, pointOrCartesian.pointProps);
      } else {
        newPoint = new EditPoint(this.id, pointOrCartesian, this._pointProps);
      }
      newPoints.push(newPoint);
    }
    this.positions = newPoints;
    this.polylineProps = polylineProps ? polylineProps : this.polylineProps;

    this.updatePointsLayer(true, ...this.positions);
    this.addAllVirtualEditPoints();
  }

  private addAllVirtualEditPoints() {
    const currentPoints = [...this.positions];
    currentPoints.forEach((pos, index) => {
      if (index !== currentPoints.length - 1) {
        const currentPoint = pos;
        const nextIndex = (index + 1) % (currentPoints.length);
        const nextPoint = currentPoints[nextIndex];

        const midPoint = this.setMiddleVirtualPoint(currentPoint, nextPoint);

        this.updatePointsLayer(false, midPoint);
      }
    });
  }

  private setMiddleVirtualPoint(firstP: EditPoint, secondP: EditPoint): EditPoint {
    const currentCart = Cesium.Cartographic.fromCartesian(firstP.getPosition());
    const nextCart = Cesium.Cartographic.fromCartesian(secondP.getPosition());
    const midPointCartesian3 = this.coordinateConverter.midPointToCartesian3(currentCart, nextCart);
    const midPoint = new EditPoint(this.id, midPointCartesian3, this._pointProps);
    midPoint.setVirtualEditPoint(true);

    const firstIndex = this.positions.indexOf(firstP);
    this.positions.splice(firstIndex + 1, 0, midPoint);
    return midPoint;
  }

  private updateMiddleVirtualPoint(virtualEditPoint: EditPoint, prevPoint: EditPoint, nextPoint: EditPoint) {
    const prevPointCart = Cesium.Cartographic.fromCartesian(prevPoint.getPosition());
    const nextPointCart = Cesium.Cartographic.fromCartesian(nextPoint.getPosition());
    virtualEditPoint.setPosition(this.coordinateConverter.midPointToCartesian3(prevPointCart, nextPointCart));
  }

  changeVirtualPointToRealPoint(point: EditPoint) {
    point.setVirtualEditPoint(false); // actual point becomes a real point
    const pointsCount = this.positions.length;
    const pointIndex = this.positions.indexOf(point);
    const nextIndex = (pointIndex + 1) % (pointsCount);
    const preIndex = ((pointIndex - 1) + pointsCount) % pointsCount;

    const nextPoint = this.positions[nextIndex];
    const prePoint = this.positions[preIndex];

    const firstMidPoint = this.setMiddleVirtualPoint(prePoint, point);
    const secMidPoint = this.setMiddleVirtualPoint(point, nextPoint);
    this.updatePointsLayer(false, firstMidPoint, secMidPoint, point);

  }

  private renderPolylines() {
    this.polylines.forEach(polyline => this.polylinesLayer.remove(polyline.getId()));
    this.polylines = [];
    const realPoints = this.positions.filter(point => !point.isVirtualEditPoint());
    realPoints.forEach((point, index) => {
      if (index !== realPoints.length - 1) {
        const nextIndex = (index + 1);
        const nextPoint = realPoints[nextIndex];
        const polyline = new EditPolyline(this.id, point.getPosition(), nextPoint.getPosition(), this.polylineProps);
        this.polylines.push(polyline);
        this.polylinesLayer.update(polyline, polyline.getId());
      }
    });
  }

  addPointFromExisting(position: Cartesian3) {
    const newPoint = new EditPoint(this.id, position, this._pointProps);
    this.positions.push(newPoint);
    this.updatePointsLayer(true, newPoint);
  }


  addPoint(position: Cartesian3) {
    if (this.doneCreation) {
      return;
    }
    const isFirstPoint = !this.positions.length;
    if (isFirstPoint) {
      const firstPoint = new EditPoint(this.id, position, this._pointProps);
      this.positions.push(firstPoint);
      this.updatePointsLayer(true, firstPoint);
    }

    this.movingPoint = new EditPoint(this.id, position.clone(), this._pointProps);
    this.positions.push(this.movingPoint);

    this.updatePointsLayer(true, this.movingPoint);
  }

  movePoint(toPosition: Cartesian3, editPoint: EditPoint) {
    editPoint.setPosition(toPosition);
    if (this.doneCreation) {
      if (editPoint.isVirtualEditPoint()) {
        this.changeVirtualPointToRealPoint(editPoint);
      }
      const pointsCount = this.positions.length;
      const pointIndex = this.positions.indexOf(editPoint);

      if (pointIndex < this.positions.length - 1) {
        const nextVirtualPoint = this.positions[(pointIndex + 1) % (pointsCount)];
        const nextRealPoint = this.positions[(pointIndex + 2) % (pointsCount)];
        this.updateMiddleVirtualPoint(nextVirtualPoint, editPoint, nextRealPoint);
        this.updatePointsLayer(false, nextVirtualPoint);
      }
      if (pointIndex > 0) {
        const prevVirtualPoint = this.positions[((pointIndex - 1) + pointsCount) % pointsCount];
        const prevRealPoint = this.positions[((pointIndex - 2) + pointsCount) % pointsCount];
        this.updateMiddleVirtualPoint(prevVirtualPoint, editPoint, prevRealPoint);
        this.updatePointsLayer(false, prevVirtualPoint);
      }
    }
    this.updatePointsLayer(true, editPoint);
  }

  moveTempMovingPoint(toPosition: Cartesian3) {
    if (this.movingPoint) {
      this.movePoint(toPosition, this.movingPoint);
    }
  }

  moveShape(startMovingPosition: Cartesian3, draggedToPosition: Cartesian3) {
    if (!this.doneCreation) {
      return;
    }
    if (!this.lastDraggedToPosition) {
      this.lastDraggedToPosition = startMovingPosition;
    }

    const delta = GeoUtilsService.getPositionsDelta(this.lastDraggedToPosition, draggedToPosition);
    this.positions.forEach(point => {
      GeoUtilsService.addDeltaToPosition(point.getPosition(), delta, true);
    });
    this.updatePointsLayer(true, ...this.positions);
    this.lastDraggedToPosition = draggedToPosition;
  }

  endMoveShape() {
    this.lastDraggedToPosition = undefined;
    this.updatePointsLayer(true, ...this.positions);
  }

  removePoint(pointToRemove: EditPoint) {
    this.removePosition(pointToRemove);
    this.positions
      .filter(p => p.isVirtualEditPoint())
      .forEach(p => this.removePosition(p));
    this.addAllVirtualEditPoints();

    this.renderPolylines();
  }

  addLastPoint(position: Cartesian3) {
    this.doneCreation = true;
    this.removePosition(this.movingPoint); // remove movingPoint
    this.movingPoint = null;

    this.addAllVirtualEditPoints();
  }

  getRealPositions(): Cartesian3[] {
    return this.getRealPoints()
      .map(position => position.getPosition());
  }

  getRealPoints(): EditPoint[] {
    return this.positions
      .filter(position => !position.isVirtualEditPoint() && position !== this.movingPoint);
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
    this.pointsLayer.remove(point.getId());
  }

  private updatePointsLayer(renderPolylines = true, ...point: EditPoint[]) {
    if (renderPolylines) {
      this.renderPolylines();
    }
    point.forEach(p => this.pointsLayer.update(p, p.getId()));
  }

  update() {
    this.updatePointsLayer();
  }

  dispose() {
    this.positions.forEach(editPoint => {
      this.pointsLayer.remove(editPoint.getId());
    });
    this.polylines.forEach(line => this.polylinesLayer.remove(line.getId()));
    if (this.movingPoint) {
      this.pointsLayer.remove(this.movingPoint.getId());
      this.movingPoint = undefined;
    }
    this.positions.length = 0;
  }

  getPointsCount(): number {
    return this.positions.length;
  }

  getId() {
    return this.id;
  }
}
