import { Cartesian3, Cartographic, CallbackProperty, Rectangle } from 'cesium';
import { AcEntity } from '../../angular-cesium/models/ac-entity';
import { EditPoint } from './edit-point';
import { AcLayerComponent } from '../../angular-cesium/components/ac-layer/ac-layer.component';
import { CoordinateConverter } from '../../angular-cesium/services/coordinate-converter/coordinate-converter.service';
import { GeoUtilsService } from '../../angular-cesium/services/geo-utils/geo-utils.service';
import { RectangleEditOptions, RectangleProps } from './rectangle-edit-options';
import { PointProps } from './point-edit-options';
import { defaultLabelProps, LabelProps } from './label-props';

export class EditableRectangle extends AcEntity {
  private positions: EditPoint[] = [];
  private movingPoint: EditPoint;
  private done = false;
  private _enableEdit = true;
  private _defaultPointProps: PointProps;
  private _rectangleProps: RectangleProps;
  private lastDraggedToPosition: Cartesian3;
  private _labels: LabelProps[] = [];

  constructor(
    private id: string,
    private pointsLayer: AcLayerComponent,
    private rectangleLayer: AcLayerComponent,
    private coordinateConverter: CoordinateConverter,
    editOptions: RectangleEditOptions,
    positions?: Cartesian3[]
  ) {
    super();
    this.defaultPointProps = {...editOptions.pointProps};
    this.rectangleProps = {...editOptions.rectangleProps};
    if (positions && positions.length === 2) {
      this.createFromExisting(positions);
    } else if (positions) {
      throw new Error('Rectangle consist of 2 points but provided ' + positions.length);
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

  get rectangleProps(): RectangleProps {
    return this._rectangleProps;
  }

  set rectangleProps(value: RectangleProps) {
    this._rectangleProps = value;
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
    this.updateRectangleLayer();
    this.updatePointsLayer(...this.positions);
    this.done = true;
  }

  setPointsManually(points: EditPoint[], widthMeters?: number) {
    if (!this.done) {
      throw new Error('Update manually only in edit mode, after rectangle is created');
    }
    this.positions.forEach(p => this.pointsLayer.remove(p.getId()));
    this.positions = points;
    this.updatePointsLayer(...points);
    this.updateRectangleLayer();
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

      this.updatePointsLayer(...this.positions);
      this.updateRectangleLayer();
      this.done = true;
      this.movingPoint = null;
    }
  }

  movePoint(toPosition: Cartesian3, editPoint: EditPoint) {
    if (!editPoint.isVirtualEditPoint()) {
      editPoint.setPosition(toPosition);
      this.updatePointsLayer(...this.positions);
      this.updateRectangleLayer();
    }
  }

  moveShape(startMovingPosition: Cartesian3, draggedToPosition: Cartesian3) {
    if (!this.lastDraggedToPosition) {
      this.lastDraggedToPosition = startMovingPosition;
    }

    const lastDraggedCartographic = Cartographic.fromCartesian(this.lastDraggedToPosition);
    const draggedToPositionCartographic = Cartographic.fromCartesian(draggedToPosition);
    this.getRealPoints().forEach(point => {
      const cartographic = Cartographic.fromCartesian(point.getPosition());
      cartographic.longitude += (draggedToPositionCartographic.longitude - lastDraggedCartographic.longitude);
      cartographic.latitude += (draggedToPositionCartographic.latitude - lastDraggedCartographic.latitude);
      point.setPosition(Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 0));
    });

    this.updatePointsLayer(...this.positions);
    this.updateRectangleLayer();
    this.lastDraggedToPosition = draggedToPosition;
  }

  endMoveShape() {
    this.lastDraggedToPosition = undefined;
    this.positions.forEach(point => this.updatePointsLayer(point));
    this.updateRectangleLayer();
  }

  endMovePoint() {
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

  getPositions(): Cartesian3[] {
    return this.positions.map(position => position.getPosition());
  }

  getRectangle(): Rectangle {
    const cartographics = this.getPositions().map(cartesian => Cartographic.fromCartesian(cartesian));
    const longitudes = cartographics.map(position => position.longitude);
    const latitudes = cartographics.map(position =>  position.latitude);

    return new Rectangle(
      Math.min(...longitudes),
      Math.min(...latitudes),
      Math.max(...longitudes),
      Math.max(...latitudes)
    );
  }

  getRectangleCallbackProperty(): CallbackProperty {
    return new CallbackProperty(this.getRectangle.bind(this), false);
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

  private updateRectangleLayer() {
    this.rectangleLayer.update(this, this.id);
  }

  dispose() {
    this.rectangleLayer.remove(this.id);

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

