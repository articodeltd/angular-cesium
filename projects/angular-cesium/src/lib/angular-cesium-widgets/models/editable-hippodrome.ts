import { Cartesian3, Math as cMath, CallbackProperty } from 'cesium';
import { AcEntity } from '../../angular-cesium/models/ac-entity';
import { EditPoint } from './edit-point';
import { AcLayerComponent } from '../../angular-cesium/components/ac-layer/ac-layer.component';
import { CoordinateConverter } from '../../angular-cesium/services/coordinate-converter/coordinate-converter.service';
import { PointProps } from './point-edit-options';
import { HippodromeEditOptions, HippodromeProps } from './hippodrome-edit-options';
import { GeoUtilsService } from '../../angular-cesium/services/geo-utils/geo-utils.service';
import { defaultLabelProps, LabelProps } from './label-props';

export class EditableHippodrome extends AcEntity {
  private positions: EditPoint[] = [];
  private movingPoint: EditPoint;
  private done = false;
  private _enableEdit = true;
  private _defaultPointProps: PointProps;
  private _hippodromeProps: HippodromeProps;
  private lastDraggedToPosition: Cartesian3;
  private _labels: LabelProps[] = [];

  constructor(
    private id: string,
    private pointsLayer: AcLayerComponent,
    private hippodromeLayer: AcLayerComponent,
    private coordinateConverter: CoordinateConverter,
    editOptions: HippodromeEditOptions,
    positions?: Cartesian3[],
  ) {
    super();
    this.defaultPointProps = {...editOptions.pointProps};
    this.hippodromeProps = {...editOptions.hippodromeProps};
    if (positions && positions.length === 2) {
      this.createFromExisting(positions);
    } else if (positions) {
      throw new Error('Hippodrome consist of 2 points but provided ' + positions.length);
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

  get hippodromeProps(): HippodromeProps {
    return this._hippodromeProps;
  }

  set hippodromeProps(value: HippodromeProps) {
    this._hippodromeProps = value;
  }

  get defaultPointProps(): PointProps {
    return this._defaultPointProps;
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
      this.updatePointsLayer(point);
    });
  }

  private createFromExisting(positions: Cartesian3[]) {
    positions.forEach(position => {
      this.addPointFromExisting(position);
    });
    this.createHeightEditPoints();
    this.updateHippdromeLayer();
    this.updatePointsLayer(...this.positions);
    this.done = true;
  }

  setPointsManually(points: EditPoint[], widthMeters?: number) {
    if (!this.done) {
      throw new Error('Update manually only in edit mode, after polyline is created');
    }
    this.hippodromeProps.width = widthMeters ? widthMeters : this.hippodromeProps.width;
    this.positions.forEach(p => this.pointsLayer.remove(p.getId()));
    this.positions = points;
    this.createHeightEditPoints();
    this.updatePointsLayer(...points);
    this.updateHippdromeLayer();
  }

  addPointFromExisting(position: Cartesian3) {
    const newPoint = new EditPoint(this.id, position, this.defaultPointProps);
    this.positions.push(newPoint);
    this.updatePointsLayer(newPoint);
  }

  addPoint(position: Cartesian3) {
    if (this.done) {
      return;
    }
    const isFirstPoint = !this.positions.length;
    if (isFirstPoint) {
      const firstPoint = new EditPoint(this.id, position, this.defaultPointProps);
      this.positions.push(firstPoint);
      this.movingPoint = new EditPoint(this.id, position.clone(), this.defaultPointProps);
      this.positions.push(this.movingPoint);
      this.updatePointsLayer(firstPoint);
    } else {
      this.createHeightEditPoints();

      this.updatePointsLayer(...this.positions);
      this.updateHippdromeLayer();
      this.done = true;
      this.movingPoint = null;
    }
  }

  private createHeightEditPoints() {
    this.positions.filter(p => p.isVirtualEditPoint()).forEach(p => this.removePosition(p));

    const firstP = this.getRealPoints()[0];
    const secP = this.getRealPoints()[1];

    const midPointCartesian3 = Cartesian3.lerp(firstP.getPosition(), secP.getPosition(), 0.5, new Cartesian3());
    const bearingDeg = this.coordinateConverter.bearingToCartesian(firstP.getPosition(), secP.getPosition());

    const upAzimuth = cMath.toRadians(bearingDeg) - Math.PI / 2;
    this.createMiddleEditablePoint(midPointCartesian3, upAzimuth);
    const downAzimuth = cMath.toRadians(bearingDeg) + Math.PI / 2;
    this.createMiddleEditablePoint(midPointCartesian3, downAzimuth);
  }

  private createMiddleEditablePoint(midPointCartesian3: any, azimuth: number) {
    const upEditCartesian3 = GeoUtilsService.pointByLocationDistanceAndAzimuth(
      midPointCartesian3,
      this.hippodromeProps.width / 2,
      azimuth,
      true,
    );
    const midPoint = new EditPoint(this.id, upEditCartesian3, this.defaultPointProps);
    midPoint.setVirtualEditPoint(true);
    this.positions.push(midPoint);
  }

  movePoint(toPosition: Cartesian3, editPoint: EditPoint) {
    if (!editPoint.isVirtualEditPoint()) {
      editPoint.setPosition(toPosition);
      this.createHeightEditPoints();
      this.updatePointsLayer(...this.positions);
      this.updateHippdromeLayer();
    } else {
      this.changeWidthByNewPoint(toPosition);
    }
  }

  private changeWidthByNewPoint(toPosition: Cartesian3) {
    const firstP = this.getRealPoints()[0];
    const secP = this.getRealPoints()[1];
    const midPointCartesian3 = Cartesian3.lerp(firstP.getPosition(), secP.getPosition(), 0.5, new Cartesian3());

    const bearingDeg = this.coordinateConverter.bearingToCartesian(midPointCartesian3, toPosition);
    let normalizedBearingDeb = bearingDeg;
    if (bearingDeg > 270) {
      normalizedBearingDeb = bearingDeg - 270;
    } else if (bearingDeg > 180) {
      normalizedBearingDeb = bearingDeg - 180;
    }
    let bearingDegHippodromeDots = this.coordinateConverter.bearingToCartesian(firstP.getPosition(), secP.getPosition());
    if (bearingDegHippodromeDots > 180) {
      bearingDegHippodromeDots = this.coordinateConverter.bearingToCartesian(secP.getPosition(), firstP.getPosition());
    }
    let fixedBearingDeg =
      bearingDegHippodromeDots > normalizedBearingDeb
        ? bearingDegHippodromeDots - normalizedBearingDeb
        : normalizedBearingDeb - bearingDegHippodromeDots;

    if (bearingDeg > 270) {
      fixedBearingDeg = bearingDeg - bearingDegHippodromeDots;
    }

    const distanceMeters = Math.abs(GeoUtilsService.distance(midPointCartesian3, toPosition));
    const radiusWidth = Math.sin(cMath.toRadians(fixedBearingDeg)) * distanceMeters;

    this.hippodromeProps.width = Math.abs(radiusWidth) * 2;
    this.createHeightEditPoints();
    this.updatePointsLayer(...this.positions);
    this.updateHippdromeLayer();
  }

  moveShape(startMovingPosition: Cartesian3, draggedToPosition: Cartesian3) {
    if (!this.lastDraggedToPosition) {
      this.lastDraggedToPosition = startMovingPosition;
    }

    const delta = GeoUtilsService.getPositionsDelta(this.lastDraggedToPosition, draggedToPosition);
    this.getRealPoints().forEach(point => {
      const newPos = GeoUtilsService.addDeltaToPosition(point.getPosition(), delta, true);
      point.setPosition(newPos);
    });
    this.createHeightEditPoints();
    this.updatePointsLayer(...this.positions);
    this.updateHippdromeLayer();
    this.lastDraggedToPosition = draggedToPosition;
  }

  endMoveShape() {
    this.lastDraggedToPosition = undefined;
    this.createHeightEditPoints();
    this.positions.forEach(point => this.updatePointsLayer(point));
    this.updateHippdromeLayer();
  }

  endMovePoint() {
    this.createHeightEditPoints();
    this.updatePointsLayer(...this.positions);
  }

  moveTempMovingPoint(toPosition: Cartesian3) {
    if (this.movingPoint) {
      this.movePoint(toPosition, this.movingPoint);
    }
  }

  removePoint(pointToRemove: EditPoint) {
    this.removePosition(pointToRemove);
    this.positions.filter(p => p.isVirtualEditPoint()).forEach(p => this.removePosition(p));
  }

  addLastPoint(position: Cartesian3) {
    this.done = true;
    this.removePosition(this.movingPoint); // remove movingPoint
    this.movingPoint = null;
  }

  getRealPositions(): Cartesian3[] {
    return this.getRealPoints().map(position => position.getPosition());
  }

  getRealPositionsCallbackProperty(): CallbackProperty {
    return new CallbackProperty(this.getRealPositions.bind(this), false);
  }

  getRealPoints(): EditPoint[] {
    return this.positions.filter(position => !position.isVirtualEditPoint());
  }

  getWidth(): number {
    return this.hippodromeProps.width;
  }

  getPositions(): Cartesian3[] {
    return this.positions.map(position => position.getPosition());
  }

  private removePosition(point: EditPoint) {
    const index = this.positions.findIndex(p => p === point);
    if (index < 0) {
      return;
    }
    this.positions.splice(index, 1);
    this.pointsLayer.remove(point.getId());
  }

  private updatePointsLayer(...point: EditPoint[]) {
    point.forEach(p => this.pointsLayer.update(p, p.getId()));
  }

  private updateHippdromeLayer() {
    this.hippodromeLayer.update(this, this.id);
  }

  dispose() {
    this.hippodromeLayer.remove(this.id);

    this.positions.forEach(editPoint => {
      this.pointsLayer.remove(editPoint.getId());
    });
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
