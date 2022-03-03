import { Cartesian3, CallbackProperty, Math as cMath } from 'cesium';
import { AcEntity } from '../../angular-cesium/models/ac-entity';
import { EditPoint } from './edit-point';
import { AcLayerComponent } from '../../angular-cesium/components/ac-layer/ac-layer.component';
import { GeoUtilsService } from '../../angular-cesium/services/geo-utils/geo-utils.service';
import { EllipseEditOptions, EllipseProps } from './ellipse-edit-options';
import { PointProps } from './point-edit-options';
import { PolylineProps } from './polyline-edit-options';
import { defaultLabelProps, LabelProps } from './label-props';
import { CoordinateConverter } from '../../angular-cesium/services/coordinate-converter/coordinate-converter.service';

export class EditableEllipse extends AcEntity {
  private _center: EditPoint;
  private _majorRadiusPoint: EditPoint;
  private _majorRadius: number;
  private _minorRadius: number;
  private _rotation = 0;
  private doneCreation = false;
  private _enableEdit = true;
  private _minorRadiusPoints: EditPoint[] = [];
  private lastDraggedToPosition: any;
  private _ellipseProps: EllipseProps;
  private _pointProps: PointProps;
  private _polylineProps: PolylineProps;
  private _labels: LabelProps[] = [];

  constructor(
    private id: string,
    private ellipsesLayer: AcLayerComponent,
    private pointsLayer: AcLayerComponent,
    private coordinateConverter: CoordinateConverter,
    private options: EllipseEditOptions,
  ) {
    super();
    this._ellipseProps = {...options.ellipseProps};
    this._pointProps = {...options.pointProps};
  }

  get labels(): LabelProps[] {
    return this._labels;
  }

  set labels(labels: LabelProps[]) {
    if (!labels || !this._center) {
      return;
    }
    this._labels = labels.map((label, index) => {
      if (!label.position) {
        if (index === 0) {
          label.position = this._center.getPosition();
        } else if (index === 1) {
          label.position = this._majorRadiusPoint
            ? Cartesian3.midpoint(this.getCenter(), this._majorRadiusPoint.getPosition(), new Cartesian3())
            : new Cartesian3();
        } else if (index === 2) {
          label.position =
            this._minorRadiusPoints.length > 0 && this._minorRadius
              ? Cartesian3.midpoint(this.getCenter(), this.getMinorRadiusPointPosition(), new Cartesian3())
              : new Cartesian3();
        }
      }

      return Object.assign({}, defaultLabelProps, label);
    });
  }

  get polylineProps(): PolylineProps {
    return this._polylineProps;
  }

  set polylineProps(value: PolylineProps) {
    this._polylineProps = value;
  }

  get pointProps(): PointProps {
    return this._pointProps;
  }

  set pointProps(value: PointProps) {
    this._pointProps = value;
  }

  get ellipseProps(): EllipseProps {
    return this._ellipseProps;
  }

  set ellipseProps(value: EllipseProps) {
    this._ellipseProps = value;
  }

  get center(): EditPoint {
    return this._center;
  }

  get majorRadiusPoint(): EditPoint {
    return this._majorRadiusPoint;
  }

  getMajorRadiusPointPosition() {
    if (!this._majorRadiusPoint) {
      return undefined;
    }

    return this._majorRadiusPoint.getPosition();
  }

  getMinorRadiusPointPosition(): Cartesian3 {
    if (this._minorRadiusPoints.length < 1) {
      return undefined;
    }

    return this._minorRadiusPoints[0].getPosition();
  }

  get enableEdit() {
    return this._enableEdit;
  }

  set enableEdit(value: boolean) {
    this._enableEdit = value;
    this._center.show = value;
    this._majorRadiusPoint.show = value;
    this.updatePointsLayer();
  }

  setManually(
    center: Cartesian3,
    majorRadius: number,
    rotation = Math.PI / 2,
    minorRadius?: number,
    centerPointProp = this.pointProps,
    radiusPointProp = this.pointProps,
    ellipseProp = this.ellipseProps,
  ) {
    if (majorRadius < minorRadius) {
      throw new Error('Major radius muse be equal or greater than minor radius');
    }
    this._rotation = rotation;
    this._majorRadius = majorRadius;
    if (!this._center) {
      this._center = new EditPoint(this.id, center, centerPointProp);
    } else {
      this._center.setPosition(center);
    }

    const majorRadiusPosition = GeoUtilsService.pointByLocationDistanceAndAzimuth(this.center.getPosition(), majorRadius, rotation);

    if (!this._majorRadiusPoint) {
      this._majorRadiusPoint = new EditPoint(this.id, majorRadiusPosition, radiusPointProp);
    } else {
      this._majorRadiusPoint.setPosition(majorRadiusPosition);
    }

    if (minorRadius) {
      this._minorRadius = minorRadius;
    }

    this.ellipseProps = ellipseProp;
    this.doneCreation = true;
    this.updateMinorRadiusEditPoints();
    this.updatePointsLayer();
    this.updateEllipsesLayer();
  }

  addPoint(position: Cartesian3) {
    if (this.doneCreation) {
      return;
    }

    if (!this._center) {
      this._center = new EditPoint(this.id, position, this.pointProps);
      this._majorRadiusPoint = new EditPoint(this.id, position.clone(), this.pointProps);
      this._majorRadius = 0;
    }

    this.updateRotation();
    this.updateMinorRadiusEditPoints();
    this.updatePointsLayer();
    this.updateEllipsesLayer();
  }

  transformToEllipse() {
    if (this._minorRadius) {
      return;
    }

    this._minorRadius = this.getMajorRadius();
    this.updateMinorRadiusEditPoints();
    this.updatePointsLayer();
    this.updateEllipsesLayer();
  }

  addLastPoint(position: Cartesian3) {
    if (this.doneCreation || !this._center || !this._majorRadiusPoint) {
      return;
    }

    const newRadius = GeoUtilsService.distance(this._center.getPosition(), position);
    this._majorRadiusPoint.setPosition(position);
    this._majorRadius = newRadius;
    this.doneCreation = true;

    if (!this.options.circleToEllipseTransformation) {
      this._minorRadius = this._majorRadius;
    }

    this.updateRotation();
    this.updateMinorRadiusEditPoints();
    this.updatePointsLayer();
    this.updateEllipsesLayer();
  }

  movePoint(toPosition: Cartesian3, editPoint: EditPoint) {
    if (!this._center || !this._majorRadiusPoint) {
      return;
    }

    const newRadius = GeoUtilsService.distance(this._center.getPosition(), toPosition);
    if (this.majorRadiusPoint === editPoint) {
      if (newRadius < this._minorRadius) {
        this._majorRadius = this._minorRadius;
        this._majorRadiusPoint.setPosition(
          GeoUtilsService.pointByLocationDistanceAndAzimuth(this.getCenter(), this._minorRadius, this._rotation),
        );
      } else {
        this.majorRadiusPoint.setPosition(toPosition);
        this._majorRadius = newRadius;
      }
    } else {
      if (newRadius > this._majorRadius) {
        this._minorRadius = this._majorRadius;
      } else {
        this._minorRadius = newRadius;
      }
    }

    this.updateRotation();
    this.updateMinorRadiusEditPoints();
    this.updatePointsLayer();
    this.updateEllipsesLayer();
  }

  moveEllipse(dragStartPosition: Cartesian3, dragEndPosition: Cartesian3) {
    if (!this.doneCreation) {
      return;
    }
    if (!this.lastDraggedToPosition) {
      this.lastDraggedToPosition = dragStartPosition;
    }

    const majorRadius = this.getMajorRadius();
    const rotation = this.getRotation();
    const delta = GeoUtilsService.getPositionsDelta(this.lastDraggedToPosition, dragEndPosition);
    const newCenterPosition = GeoUtilsService.addDeltaToPosition(this.getCenter(), delta, true);
    this._center.setPosition(newCenterPosition);
    this.majorRadiusPoint.setPosition(GeoUtilsService.pointByLocationDistanceAndAzimuth(this.getCenter(), majorRadius, rotation));
    this.updatePointsLayer();
    this.updateMinorRadiusEditPoints();
    this.updateEllipsesLayer();
    this.lastDraggedToPosition = dragEndPosition;
  }

  endMoveEllipse() {
    this.lastDraggedToPosition = undefined;
  }

  private updateMinorRadiusEditPoints() {
    if (this._minorRadius === undefined) {
      return;
    }
    if (this._minorRadiusPoints.length === 0) {
      this._minorRadiusPoints.push(new EditPoint(this.id, new Cartesian3(), this.pointProps, true));
      this._minorRadiusPoints.push(new EditPoint(this.id, new Cartesian3(), this.pointProps, true));
    }

    this._minorRadiusPoints[0].setPosition(
      GeoUtilsService.pointByLocationDistanceAndAzimuth(this._center.getPosition(), this._minorRadius, this.getRotation() - Math.PI / 2),
    );

    this._minorRadiusPoints[1].setPosition(
      GeoUtilsService.pointByLocationDistanceAndAzimuth(this._center.getPosition(), this._minorRadius, this.getRotation() + Math.PI / 2),
    );
  }

  getMajorRadius(): number {
    return this._majorRadius || 0;
  }

  getMinorRadius() {
    if (this._minorRadius === undefined) {
      return this.getMajorRadius();
    } else {
      return this._minorRadius;
    }
  }

  getRotation(): number {
    return this._rotation || 0;
  }

  updateRotation(): number {
    if (!this._majorRadiusPoint) {
      return 0;
    }

    const azimuthInDegrees = this.coordinateConverter.bearingToCartesian(this.getCenter(), this._majorRadiusPoint.getPosition());
    this._rotation = cMath.toRadians(azimuthInDegrees);
    return this._rotation;
  }

  getRotationCallbackProperty(): CallbackProperty {
    return new CallbackProperty(() => Math.PI / 2 - this.getRotation(), false);
  }

  getMinorRadiusCallbackProperty(): CallbackProperty {
    return new CallbackProperty(() => this.getMinorRadius(), false);
  }

  getMajorRadiusCallbackProperty(): CallbackProperty {
    return new CallbackProperty(() => this.getMajorRadius(), false);
  }

  getCenter(): Cartesian3 {
    return this._center ? this._center.getPosition() : undefined;
  }

  getCenterCallbackProperty(): CallbackProperty {
    return new CallbackProperty(() => this.getCenter(), false);
  }

  dispose() {
    if (this._center) {
      this.pointsLayer.remove(this._center.getId());
    }

    if (this._majorRadiusPoint) {
      this.pointsLayer.remove(this._majorRadiusPoint.getId());
    }

    if (this._minorRadiusPoints) {
      this._minorRadiusPoints.forEach(point => this.pointsLayer.remove(point.getId()));
    }

    this.ellipsesLayer.remove(this.id);
  }

  getId() {
    return this.id;
  }

  private updateEllipsesLayer() {
    this.ellipsesLayer.update(this, this.id);
  }

  private updatePointsLayer() {
    if (this._center) {
      this.pointsLayer.update(this._center, this._center.getId());
    }
    if (this._majorRadiusPoint) {
      this.pointsLayer.update(this._majorRadiusPoint, this._majorRadiusPoint.getId());
    }
    if (this._minorRadiusPoints.length > 0) {
      this.pointsLayer.update(this._minorRadiusPoints[0], this._minorRadiusPoints[0].getId());
      this.pointsLayer.update(this._minorRadiusPoints[1], this._minorRadiusPoints[1].getId());
    }
  }
}
