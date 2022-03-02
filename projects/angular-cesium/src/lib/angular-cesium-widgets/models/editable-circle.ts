import { CallbackProperty, Cartesian3 } from 'cesium';
import { AcEntity } from '../../angular-cesium/models/ac-entity';
import { EditPoint } from './edit-point';
import { AcLayerComponent } from '../../angular-cesium/components/ac-layer/ac-layer.component';
//import { Cartesian3 } from '../../angular-cesium/models/cartesian3';
import { GeoUtilsService } from '../../angular-cesium/services/geo-utils/geo-utils.service';
import { EditArc } from './edit-arc';
import { CircleEditOptions } from './circle-edit-options';
import { PointProps } from './point-edit-options';
import { PolylineProps } from './polyline-edit-options';
import { defaultLabelProps, LabelProps } from './label-props';
import { EllipseProps } from './ellipse-edit-options';

export class EditableCircle extends AcEntity {
  private _center: EditPoint;
  private _radiusPoint: EditPoint;
  private _outlineArc: EditArc;
  private doneCreation = false;
  private _enableEdit = true;
  private lastDraggedToPosition: any;
  private _circleProps: EllipseProps;
  private _pointProps: PointProps;
  private _polylineProps: PolylineProps;
  private _labels: LabelProps[] = [];

  constructor(
    private id: string,
    private circlesLayer: AcLayerComponent,
    private pointsLayer: AcLayerComponent,
    private arcsLayer: AcLayerComponent,
    private options: CircleEditOptions,
  ) {
    super();
    this._circleProps = {...options.circleProps};
    this._pointProps = {...options.pointProps};
    this._polylineProps = {...options.polylineProps};
  }

  get labels(): LabelProps[] {
    return this._labels;
  }

  set labels(labels: LabelProps[]) {
    if (!labels || !this._center || !this._radiusPoint) {
      return;
    }
    this._labels = labels.map((label, index) => {
      if (!label.position) {
        if (index !== labels.length - 1) {
          label.position = this._center.getPosition();
        } else {
          label.position = this._radiusPoint.getPosition();
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

  get circleProps(): EllipseProps {
    return this._circleProps;
  }

  set circleProps(value: EllipseProps) {
    this._circleProps = value;
  }

  get center(): EditPoint {
    return this._center;
  }

  get radiusPoint(): EditPoint {
    return this._radiusPoint;
  }

  get enableEdit() {
    return this._enableEdit;
  }

  set enableEdit(value: boolean) {
    this._enableEdit = value;
    this._center.show = value;
    this._radiusPoint.show = value;
    this.updatePointsLayer();
  }

  setManually(
    center: Cartesian3,
    radiusPoint: Cartesian3,
    centerPointProp = this.pointProps,
    radiusPointProp = this.pointProps,
    circleProp = this.circleProps,
  ) {
    if (!this._center) {
      this._center = new EditPoint(this.id, center, centerPointProp);
    } else {
      this._center.setPosition(center);
    }

    if (!this._radiusPoint) {
      this._radiusPoint = new EditPoint(this.id, radiusPoint, radiusPointProp);
    } else {
      this._radiusPoint.setPosition(radiusPoint);
    }

    if (!this._outlineArc) {
      this.createOutlineArc();
    } else {
      this._outlineArc.radius = this.getRadius();
    }

    this.circleProps = circleProp;
    this.doneCreation = true;
    this.updateArcsLayer();
    this.updatePointsLayer();
    this.updateCirclesLayer();
  }

  addPoint(position: Cartesian3) {
    if (this.doneCreation) {
      return;
    }

    if (!this._center) {
      this._center = new EditPoint(this.id, position, this.pointProps);
      this._radiusPoint = new EditPoint(this.id, position.clone(), this.pointProps);
      if (!this._outlineArc) {
        this.createOutlineArc();
      }
    }

    this.updateArcsLayer();
    this.updatePointsLayer();
    this.updateCirclesLayer();
  }

  addLastPoint(position: Cartesian3) {
    if (this.doneCreation || !this._center || !this._radiusPoint) {
      return;
    }

    this._radiusPoint.setPosition(position);
    this.doneCreation = true;

    this.updatePointsLayer();
    this.updateCirclesLayer();
  }

  movePoint(toPosition: Cartesian3) {
    if (!this._center || !this._radiusPoint) {
      return;
    }

    this._radiusPoint.setPosition(toPosition);
    this._outlineArc.radius = this.getRadius();

    this.updateArcsLayer();
    this.updatePointsLayer();
    this.updateCirclesLayer();
  }

  moveCircle(dragStartPosition: Cartesian3, dragEndPosition: Cartesian3) {
    if (!this.doneCreation) {
      return;
    }
    if (!this.lastDraggedToPosition) {
      this.lastDraggedToPosition = dragStartPosition;
    }

    const radius = this.getRadius();
    const delta = GeoUtilsService.getPositionsDelta(this.lastDraggedToPosition, dragEndPosition);
    const newCenterPosition = GeoUtilsService.addDeltaToPosition(this.getCenter(), delta, true);
    this._center.setPosition(newCenterPosition);
    this.radiusPoint.setPosition(GeoUtilsService.pointByLocationDistanceAndAzimuth(this.getCenter(), radius, Math.PI / 2, true));
    this._outlineArc.radius = this.getRadius();
    this._outlineArc.center = this._center.getPosition();
    this.updateArcsLayer();
    this.updatePointsLayer();
    this.updateCirclesLayer();
    this.lastDraggedToPosition = dragEndPosition;
  }

  endMovePolygon() {
    this.lastDraggedToPosition = undefined;
  }

  getRadius(): number {
    if (!this._center || !this._radiusPoint) {
      return 0;
    }
    return GeoUtilsService.distance(this._center.getPosition(), this._radiusPoint.getPosition());
  }

  getRadiusCallbackProperty(): CallbackProperty {
    return new CallbackProperty(this.getRadius.bind(this), false);
  }

  getCenter(): Cartesian3 {
    return this._center ? this._center.getPosition() : undefined;
  }

  getCenterCallbackProperty(): CallbackProperty {
    return new CallbackProperty(this.getCenter.bind(this), false);
  }

  getRadiusPoint(): Cartesian3 {
    return this._radiusPoint ? this._radiusPoint.getPosition() : undefined;
  }

  dispose() {
    if (this._center) {
      this.pointsLayer.remove(this._center.getId());
    }

    if (this._radiusPoint) {
      this.pointsLayer.remove(this._radiusPoint.getId());
    }

    if (this._outlineArc) {
      this.arcsLayer.remove(this._outlineArc.getId());
    }

    this.circlesLayer.remove(this.id);
  }

  getId() {
    return this.id;
  }

  private updateCirclesLayer() {
    this.circlesLayer.update(this, this.id);
  }

  private updatePointsLayer() {
    if (this._center) {
      this.pointsLayer.update(this._center, this._center.getId());
    }
    if (this._radiusPoint) {
      this.pointsLayer.update(this._radiusPoint, this._radiusPoint.getId());
    }
  }

  private updateArcsLayer() {
    if (!this._outlineArc) {
      return;
    }
    this.arcsLayer.update(this._outlineArc, this._outlineArc.getId());
  }

  private createOutlineArc() {
    if (!this._center || !this._radiusPoint) {
      return;
    }
    this._outlineArc = new EditArc(this.id, this.getCenter(), this.getRadius(), Math.PI * 2, 0, this.polylineProps);
  }
}
