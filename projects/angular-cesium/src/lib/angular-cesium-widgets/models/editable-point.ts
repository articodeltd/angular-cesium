import { Color, CallbackProperty, Cartesian3 } from 'cesium';
import { AcLayerComponent } from '../../angular-cesium/components/ac-layer/ac-layer.component';
import { AcEntity } from '../../angular-cesium/models/ac-entity';
import { CoordinateConverter } from '../../angular-cesium/services/coordinate-converter/coordinate-converter.service';
import { EditPoint } from './edit-point';
import { defaultLabelProps, LabelProps } from './label-props';
import { PointEditOptions, PointProps } from './point-edit-options';

interface PositionWithPointProps {
  position: Cartesian3;
  pointProp?: PointProps;
}

export class EditablePoint extends AcEntity {
  private point: EditPoint;
  private _enableEdit = true;
  private _props: PointProps;
  private _labels: LabelProps[] = [];

  constructor(private id: string,
              private pointLayer: AcLayerComponent,
              private coordinateConverter: CoordinateConverter,
              private editOptions: PointEditOptions,
              position?: Cartesian3) {
    super();
    this._props = {...editOptions.pointProps};
    if (position) {
      this.createFromExisting(position);
    }
  }

  get labels(): LabelProps[] {
    return this._labels;
  }

  set labels(labels: LabelProps[]) {
    if (!labels) {
      return;
    }
    const position = this.point.getPosition();
    this._labels = labels.map((label, index) => {
      if (!label.position) {
        label.position = position;
      }
      return Object.assign({}, defaultLabelProps, label);
    });
  }

  get props(): PointProps {
    return this._props;
  }

  set props(value: PointProps) {
    this._props = value;
  }

  get enableEdit() {
    return this._enableEdit;
  }

  set enableEdit(value: boolean) {
    this._enableEdit = value;
    if (value) {
      this.point.props.color = Color.WHITE;
    } else {
      this.point.props.color = Color.DIMGREY;
      this.point.props.pixelSize = 10;
    }
    this.updatePointLayer();
  }

  private createFromExisting(position: Cartesian3) {
    this.point = new EditPoint(this.id, position, this._props);
    this.updatePointLayer();
  }

  private hasPosition(point: PositionWithPointProps | Cartesian3): point is PositionWithPointProps {
    if ((point as PositionWithPointProps).position) {
      return true;
    }
    return false;
  }

  setManually(point: PositionWithPointProps | Cartesian3, props?: PointProps) {
    if (!this.enableEdit) {
      throw new Error('Update manually only in edit mode, after point is created');
    }
    let newProps = props;
    if (this.hasPosition(point)) {
      newProps = point.pointProp ? point.pointProp : props;
      this.point.setPosition(point.position);
    } else {
      this.point.setPosition(point);
    }
    this.point.props = newProps;
    this.updatePointLayer();
  }

  addLastPoint(position: Cartesian3) {
    this.point.setPosition(position);
    this.updatePointLayer();
  }

  movePoint(toPosition: Cartesian3) {
    if (!this.point) {
      this.point = new EditPoint(this.id, toPosition, this._props);
    } else {
      this.point.setPosition(toPosition);
    }
    this.updatePointLayer();
  }

  getCurrentPoint(): EditPoint {
    return this.point;
  }

  getPosition(): Cartesian3 {
    return this.point.getPosition();
  }

  getPositionCallbackProperty(): CallbackProperty {
    return new CallbackProperty(this.getPosition.bind(this), false);
  }

  private updatePointLayer() {
    this.pointLayer.update(this.point, this.point.getId());
  }

  update() {
    this.updatePointLayer();
  }

  dispose() {
    this.pointLayer.remove(this.point.getId());
  }

  getId() {
    return this.id;
  }
}
