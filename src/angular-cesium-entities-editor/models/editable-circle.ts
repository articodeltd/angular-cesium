import { AcEntity } from '../../angular-cesium/models/ac-entity';
import { EditPoint } from './edit-point';
import { AcLayerComponent } from '../../angular-cesium/components/ac-layer/ac-layer.component';
import { Cartesian3 } from '../../angular-cesium/models/cartesian3';
import { GeoUtilsService } from '../../angular-cesium/services/geo-utils/geo-utils.service';

export class EditableCircle extends AcEntity {
  private _center: EditPoint;
  private _radiusPoint: EditPoint;
  private doneCreation = false;
  private _enableEdit = true;

  constructor(private id: string,
              private circlesLayer: AcLayerComponent,
              private pointsLayer: AcLayerComponent) {
    super();
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
  }

  setCircleManually(center: Cartesian3, radiusPoint: Cartesian3) {
    if (!this._center) {
      this._center = new EditPoint(this.id, center);
    }
    else {
      this._center.setPosition(center);
    }

    if (!this._radiusPoint) {
      this._radiusPoint = new EditPoint(this.id, radiusPoint);
    }
    else {
      this._radiusPoint.setPosition(radiusPoint);
    }

    this.doneCreation = true;
    this.updatePointsLayer();
    this.updateCirclesLayer();
  }

  addPoint(position: Cartesian3) {
    if (this.doneCreation) {
      return;
    }

    if (!this._center) {
      this._center = new EditPoint(this.id, position);
      this._radiusPoint = new EditPoint(this.id, position.clone());
    }

    this.updatePointsLayer();
    this.updateCirclesLayer();
  }

  movePoint(toPosition: Cartesian3) {
    if (!this._center || !this._radiusPoint) {
      return;
    }

    this._radiusPoint.setPosition(toPosition);

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

  moveCircle(newCenterPos: Cartesian3) {
    if (!this.doneCreation) {
      return;
    }

    const radius = this.getRadius();
    this.center.setPosition(newCenterPos);
    this.radiusPoint.setPosition(
      GeoUtilsService.pointByLocationDistanceAndAzimuth(this.getCenter(), radius, Math.PI / 2, true));

    // const delta = GeoUtilsService.getPositionsDelta(this._center.getPosition(), newCenterPos);
    // this._center.setPosition(newCenterPos);
    // GeoUtilsService.addDeltaToPosition(this._radiusPoint.getPosition(), delta, true);

    this.updatePointsLayer();
    this.updateCirclesLayer();
  }

  getRadius(): number {
    if (!this._center || !this._radiusPoint) {
      return 0;
    }
    return GeoUtilsService.distance(this._center.getPosition(), this._radiusPoint.getPosition());
  }

  getCenter(): Cartesian3 {
    return this._center ? this._center.getPosition() : undefined;
  }

  getRadiusPoint(): Cartesian3 {
    return this._radiusPoint ? this._radiusPoint.getPosition() : undefined;
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

  dispose() {
    if (this._center) {
      this.pointsLayer.remove(this._center.getId());
    }
    if (this._radiusPoint) {
      this.pointsLayer.remove(this._radiusPoint.getId());
    }
    this.circlesLayer.remove(this.id);
  }

  getId() {
    return this.id;
  }
}
