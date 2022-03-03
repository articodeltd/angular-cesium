import { Cartesian3, PolygonHierarchy, CallbackProperty } from 'cesium';
import { AcEntity } from '../../angular-cesium/models/ac-entity';
import { EditPoint } from './edit-point';
import { EditPolyline } from './edit-polyline';
import { AcLayerComponent } from '../../angular-cesium/components/ac-layer/ac-layer.component';
import { CoordinateConverter } from '../../angular-cesium/services/coordinate-converter/coordinate-converter.service';
import { GeoUtilsService } from '../../angular-cesium/services/geo-utils/geo-utils.service';
import { PolygonEditOptions, PolygonProps } from './polygon-edit-options';
import { PointProps } from './point-edit-options';
import { PolylineProps } from './polyline-edit-options';
import { defaultLabelProps, LabelProps } from './label-props';

export class EditablePolygon extends AcEntity {
  private positions: EditPoint[] = [];
  private polylines: EditPolyline[] = [];
  private movingPoint: EditPoint;
  private doneCreation = false;
  private _enableEdit = true;
  private _polygonProps: PolygonProps;
  private _defaultPointProps: PointProps;
  private _defaultPolylineProps: PolylineProps;
  private lastDraggedToPosition: Cartesian3;
  private _labels: LabelProps[] = [];

  constructor(private id: string,
              private polygonsLayer: AcLayerComponent,
              private pointsLayer: AcLayerComponent,
              private polylinesLayer: AcLayerComponent,
              private coordinateConverter: CoordinateConverter,
              private polygonOptions: PolygonEditOptions,
              positions?: Cartesian3[]) {
    super();
    this.polygonProps = {...polygonOptions.polygonProps};
    this.defaultPointProps = {...polygonOptions.pointProps};
    this.defaultPolylineProps = {...polygonOptions.polylineProps};
    if (positions && positions.length >= 3) {
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

  get defaultPolylineProps(): PolylineProps {
    return this._defaultPolylineProps;
  }

  set defaultPolylineProps(value: PolylineProps) {
    this._defaultPolylineProps = value;
  }

  get defaultPointProps(): PointProps {
    return this._defaultPointProps;
  }

  get polygonProps(): PolygonProps {
    return this._polygonProps;
  }

  set polygonProps(value: PolygonProps) {
    this._polygonProps = value;
  }

  set defaultPointProps(value: PointProps) {
    this._defaultPointProps = value;
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
    this.updatePolygonsLayer();
    this.doneCreation = true;
  }

  setPointsManually(points: { position: Cartesian3, pointProps: PointProps }[] | Cartesian3[], polygonProps?: PolygonProps) {
    if (!this.doneCreation) {
      throw new Error('Update manually only in edit mode, after polygon is created');
    }

    this.positions.forEach(p => this.pointsLayer.remove(p.getId()));
    const newPoints: EditPoint[] = [];
    for (let i = 0; i < points.length; i++) {
      const pointOrCartesian: any = points[i];
      let newPoint = null;
      if (pointOrCartesian.pointProps) {
        newPoint = new EditPoint(this.id, pointOrCartesian.position, pointOrCartesian.pointProps);
      } else {
        newPoint = new EditPoint(this.id, pointOrCartesian, this.defaultPointProps);
      }
      newPoints.push(newPoint);
    }
    this.positions = newPoints;
    this.polygonProps = polygonProps ? polygonProps : this.polygonProps;
    this.updatePointsLayer(true, ...this.positions);
    this.addAllVirtualEditPoints();
    this.updatePolygonsLayer();
  }

  private addAllVirtualEditPoints() {
    const currentPoints = [...this.positions];
    currentPoints.forEach((pos, index) => {
      const currentPoint = pos;
      const nextIndex = (index + 1) % (currentPoints.length);
      const nextPoint = currentPoints[nextIndex];
      const midPoint = this.setMiddleVirtualPoint(currentPoint, nextPoint);
      this.updatePointsLayer(false, midPoint);
    });
  }

  private setMiddleVirtualPoint(firstP: EditPoint, secondP: EditPoint): EditPoint {
    const midPointCartesian3 = Cartesian3.lerp(firstP.getPosition(), secondP.getPosition(), 0.5, new Cartesian3());
    const midPoint = new EditPoint(this.id, midPointCartesian3, this.defaultPointProps);
    midPoint.setVirtualEditPoint(true);

    const firstIndex = this.positions.indexOf(firstP);
    this.positions.splice(firstIndex + 1, 0, midPoint);
    return midPoint;
  }

  private updateMiddleVirtualPoint(virtualEditPoint: EditPoint, prevPoint: EditPoint, nextPoint: EditPoint) {
    const midPointCartesian3 = Cartesian3.lerp(prevPoint.getPosition(), nextPoint.getPosition(), 0.5, new Cartesian3());
    virtualEditPoint.setPosition(midPointCartesian3);
  }

  changeVirtualPointToRealPoint(point: EditPoint) {
    point.setVirtualEditPoint(false); // virtual point becomes a real point
    const pointsCount = this.positions.length;
    const pointIndex = this.positions.indexOf(point);
    const nextIndex = (pointIndex + 1) % (pointsCount);
    const preIndex = ((pointIndex - 1) + pointsCount) % pointsCount;

    const nextPoint = this.positions[nextIndex];
    const prePoint = this.positions[preIndex];

    const firstMidPoint = this.setMiddleVirtualPoint(prePoint, point);
    const secMidPoint = this.setMiddleVirtualPoint(point, nextPoint);
    this.updatePointsLayer(true, firstMidPoint, secMidPoint, point);
    this.updatePolygonsLayer();

  }

  private renderPolylines() {
    this.polylines.forEach(polyline => this.polylinesLayer.remove(polyline.getId()));
    this.polylines = [];
    const realPoints = this.positions.filter(pos => !pos.isVirtualEditPoint());
    realPoints.forEach((point, index) => {
      const nextIndex = (index + 1) % (realPoints.length);
      const nextPoint = realPoints[nextIndex];
      const polyline = new EditPolyline(this.id, point.getPosition(), nextPoint.getPosition(), this.defaultPolylineProps);
      this.polylines.push(polyline);
      this.polylinesLayer.update(polyline, polyline.getId());
    });
  }

  addPointFromExisting(position: Cartesian3) {
    const newPoint = new EditPoint(this.id, position, this.defaultPointProps);
    this.positions.push(newPoint);
    this.updatePointsLayer(true, newPoint);
  }


  addPoint(position: Cartesian3) {
    if (this.doneCreation) {
      return;
    }
    const isFirstPoint = !this.positions.length;
    if (isFirstPoint) {
      const firstPoint = new EditPoint(this.id, position, this.defaultPointProps);
      this.positions.push(firstPoint);
      this.updatePointsLayer(true, firstPoint);
    }

    this.movingPoint = new EditPoint(this.id, position.clone(), this.defaultPointProps);
    this.positions.push(this.movingPoint);

    this.updatePointsLayer(true, this.movingPoint);
    this.updatePolygonsLayer();
  }

  movePointFinish(editPoint: EditPoint) {
    if (this.polygonOptions.clampHeightTo3D) {
      editPoint.props.disableDepthTestDistance = Number.POSITIVE_INFINITY;
      this.updatePointsLayer(false, editPoint);
    }
  }

  movePoint(toPosition: Cartesian3, editPoint: EditPoint) {
    editPoint.setPosition(toPosition);
    if (this.doneCreation) {
      if (editPoint.props.disableDepthTestDistance && this.polygonOptions.clampHeightTo3D) {
        // To avoid bug with pickPosition() on point with disableDepthTestDistance
        editPoint.props.disableDepthTestDistance = undefined;
        return; // ignore first move because the pickPosition() could be wrong
      }

      if (editPoint.isVirtualEditPoint()) {
        this.changeVirtualPointToRealPoint(editPoint);
      }
      const pointsCount = this.positions.length;
      const pointIndex = this.positions.indexOf(editPoint);
      const nextVirtualPoint = this.positions[(pointIndex + 1) % (pointsCount)];
      const nextRealPoint = this.positions[(pointIndex + 2) % (pointsCount)];
      const prevVirtualPoint = this.positions[((pointIndex - 1) + pointsCount) % pointsCount];
      const prevRealPoint = this.positions[((pointIndex - 2) + pointsCount) % pointsCount];
      this.updateMiddleVirtualPoint(nextVirtualPoint, editPoint, nextRealPoint);
      this.updateMiddleVirtualPoint(prevVirtualPoint, editPoint, prevRealPoint);
    }
    this.updatePolygonsLayer();
    this.updatePointsLayer(true, editPoint);
  }

  moveTempMovingPoint(toPosition: Cartesian3) {
    if (this.movingPoint) {
      this.movePoint(toPosition, this.movingPoint);
    }
  }

  movePolygon(startMovingPosition: Cartesian3, draggedToPosition: Cartesian3) {
    if (!this.doneCreation) {
      return;
    }
    if (!this.lastDraggedToPosition) {
      this.lastDraggedToPosition = startMovingPosition;
    }

    const delta = GeoUtilsService.getPositionsDelta(this.lastDraggedToPosition, draggedToPosition);
    this.positions.forEach(point => {
      const newPos = GeoUtilsService.addDeltaToPosition(point.getPosition(), delta, true);
      point.setPosition(newPos);
    });
    this.updatePointsLayer();
    this.lastDraggedToPosition = draggedToPosition;
    this.positions.forEach(point => this.updatePointsLayer(true, point));
  }

  endMovePolygon() {
    this.lastDraggedToPosition = undefined;
  }

  removePoint(pointToRemove: EditPoint) {
    this.removePosition(pointToRemove);
    this.positions
      .filter(p => p.isVirtualEditPoint())
      .forEach(p => this.removePosition(p));
    this.addAllVirtualEditPoints();

    this.renderPolylines();
    if (this.getPointsCount() >= 3) {
      this.polygonsLayer.update(this, this.id);
    }
  }

  addLastPoint(position: Cartesian3) {
    this.doneCreation = true;
    this.removePosition(this.movingPoint); // remove movingPoint
    this.movingPoint = null;
    this.updatePolygonsLayer();

    this.addAllVirtualEditPoints();
  }

  getRealPositions(): Cartesian3[] {
    return this.getRealPoints().map(position => position.getPosition());
  }

  getRealPoints(): EditPoint[] {
    return this.positions.filter(position => !position.isVirtualEditPoint() && position !== this.movingPoint);
  }

  getPoints(): EditPoint[] {
    return this.positions.filter(position => position !== this.movingPoint);
  }

  getPositionsHierarchy(): PolygonHierarchy {
    const positions = this.positions.filter(position => !position.isVirtualEditPoint()).map(position => position.getPosition().clone());
    return new PolygonHierarchy(positions);
  }

  getPositionsHierarchyCallbackProperty(): CallbackProperty {
    return new CallbackProperty(this.getPositionsHierarchy.bind(this), false);
  }

  private removePosition(point: EditPoint) {
    const index = this.positions.findIndex((p) => p === point);
    if (index < 0) {
      return;
    }
    this.positions.splice(index, 1);
    this.pointsLayer.remove(point.getId());
  }

  private updatePolygonsLayer() {
    if (this.getPointsCount() >= 3) {
      this.polygonsLayer.update(this, this.id);
    }
  }

  private updatePointsLayer(renderPolylines = true, ...points: EditPoint[]) {
    if (renderPolylines) {
      this.renderPolylines();
    }
    points.forEach(p => this.pointsLayer.update(p, p.getId()));
  }

  dispose() {
    this.polygonsLayer.remove(this.id);

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
