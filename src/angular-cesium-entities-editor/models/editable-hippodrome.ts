import { AcEntity } from '../../angular-cesium/models/ac-entity';
import { EditPoint } from './edit-point';
import { AcLayerComponent } from '../../angular-cesium/components/ac-layer/ac-layer.component';
import { Cartesian3 } from '../../angular-cesium/models/cartesian3';
import { CoordinateConverter } from '../../angular-cesium/services/coordinate-converter/coordinate-converter.service';
import { PointProps } from './polyline-edit-options';
import { HippodromeEditOptions, HippodromeProps } from './hippodrome-edit-options';
import { GeoUtilsService } from '../../angular-cesium/services/geo-utils/geo-utils.service';

export class EditableHippodrome extends AcEntity {
	
	private hippodromePositions: EditPoint[] = [];
	private movingPoint: EditPoint;
	private done = false;
	private _enableEdit = true;
	private _defaultPointProps: PointProps;
	private _hippodromeProps: HippodromeProps;
	private lastDraggedToPosition: Cartesian3;
	
	constructor(private id: string,
							private pointsLayer: AcLayerComponent,
							private hippodromeLayer: AcLayerComponent,
							private coordinateConverter: CoordinateConverter,
							editOptions: HippodromeEditOptions,
							positions?: Cartesian3[]) {
		super();
		this.defaultPointProps = editOptions.pointProps;
		this.hippodromeProps = editOptions.hippodromeProps;
		if (positions && positions.length === 2) {
			this.createFromExisting(positions);
		} else if (positions) {
			throw new Error('Hippodrome consist of 2 points but provided ' + positions.length);
		}
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
	}
	
	private createFromExisting(positions: Cartesian3[]) {
		positions.forEach((position) => {
			this.addPointFromExisting(position)
		});
		this.createHeightEditPoints();
		this.updateHippdromeLayer();
		this.updateHippdromePointsLayer(...this.hippodromePositions);
		this.done = true;
	}
	
	setPointsManually(points: EditPoint[], widthMeters?: number) {
		if (!this.done) {
			throw new Error('Update manually only in edit mode, after polyline is created')
		}
		this.hippodromeProps.width = widthMeters ? widthMeters : this.hippodromeProps.width;
		this.hippodromePositions.forEach(p => this.pointsLayer.remove(p.getId()));
		this.hippodromePositions = points;
		this.createHeightEditPoints();
		this.updateHippdromePointsLayer(...points);
		this.updateHippdromeLayer();
	}
	
	
	addPointFromExisting(position: Cartesian3) {
		const newPoint = new EditPoint(this.id, position, this.defaultPointProps);
		this.hippodromePositions.push(newPoint);
		this.updateHippdromePointsLayer(newPoint);
	}
	
	
	addPoint(position: Cartesian3) {
		if (this.done) {
			return;
		}
		const isFirstPoint = !this.hippodromePositions.length;
		if (isFirstPoint) {
			const firstPoint = new EditPoint(this.id, position, this.defaultPointProps);
			this.hippodromePositions.push(firstPoint);
			this.movingPoint = new EditPoint(this.id, position.clone(), this.defaultPointProps);
			this.hippodromePositions.push(this.movingPoint);
			this.updateHippdromePointsLayer(firstPoint);
			
		} else {
			this.createHeightEditPoints();
			
			this.updateHippdromePointsLayer(...this.hippodromePositions);
			this.updateHippdromeLayer();
			this.done = true;
			this.movingPoint = null;
		}
		
	}
	
	private createHeightEditPoints() {
		this.hippodromePositions
			.filter(p => p.isVirtualEditPoint())
			.forEach(p => this.removePosition(p));
		
		const firstP = this.getRealPoints()[0];
		const secP = this.getRealPoints()[1];
		
		const midPointCartesian3 = Cesium.Cartesian3.lerp(firstP.getPosition(), secP.getPosition(), 0.5, new Cesium.Cartesian3());
		const currentCart = Cesium.Cartographic.fromCartesian(firstP.getPosition());
		const nextCart = Cesium.Cartographic.fromCartesian(secP.getPosition());
		const bearingDeg = this.coordinateConverter.bearingTo(currentCart, nextCart);
		
		const upAzimuth = Cesium.Math.toRadians(bearingDeg) - Math.PI / 2;
		this.createMiddleEditablePoint(midPointCartesian3, upAzimuth);
		const downAzimuth = Cesium.Math.toRadians(bearingDeg) + Math.PI / 2;
		this.createMiddleEditablePoint(midPointCartesian3, downAzimuth);
		
	}
	
	private createMiddleEditablePoint(midPointCartesian3: any, azimuth: number) {
		const upEditCartesian3 = GeoUtilsService.pointByLocationDistanceAndAzimuth(midPointCartesian3,
			this.hippodromeProps.width / 2, azimuth, true);
		const midPoint = new EditPoint(this.id, upEditCartesian3, this.defaultPointProps);
		midPoint.setVirtualEditPoint(true);
		this.hippodromePositions.push(midPoint);
	}
	
	movePoint(toPosition: Cartesian3, editPoint: EditPoint) {
		
		if (!editPoint.isVirtualEditPoint()) {
			editPoint.setPosition(toPosition);
			
			this.updateHippdromePointsLayer(...this.hippodromePositions);
			this.updateHippdromeLayer();
		}
	}
	
	moveShape(startMovingPosition: Cartesian3, draggedToPosition: Cartesian3) {
		if (!this.lastDraggedToPosition) {
			this.lastDraggedToPosition = startMovingPosition;
		}
		
		const delta = GeoUtilsService.getPositionsDelta(this.lastDraggedToPosition, draggedToPosition);
		this.getRealPoints().forEach(point => {
			GeoUtilsService.addDeltaToPosition(point.getPosition(), delta, true);
		});
		this.createHeightEditPoints();
		this.updateHippdromePointsLayer(...this.hippodromePositions);
		this.updateHippdromeLayer();
		this.lastDraggedToPosition = draggedToPosition;
	}
	
	endMoveShape() {
		this.lastDraggedToPosition = undefined;
		this.createHeightEditPoints();
		this.hippodromePositions.forEach(point => this.updateHippdromePointsLayer(point));
		this.updateHippdromeLayer();
	}
	
	endMovePoint() {
		this.createHeightEditPoints();
		this.updateHippdromePointsLayer(...this.hippodromePositions);
	}
	
	moveTempMovingPoint(toPosition: Cartesian3) {
		if (this.movingPoint) {
			this.movePoint(toPosition, this.movingPoint);
		}
	}
	
	removePoint(pointToRemove: EditPoint) {
		this.removePosition(pointToRemove);
		this.hippodromePositions
			.filter(p => p.isVirtualEditPoint())
			.forEach(p => this.removePosition(p));
	}
	
	addLastPoint(position: Cartesian3) {
		this.done = true;
		this.removePosition(this.movingPoint); // remove movingPoint
		this.movingPoint = null;
	}
	
	getRealPositions(): Cartesian3[] {
		return this.getRealPoints()
			.map(position => position.getPosition());
	}
	
	getRealPoints(): EditPoint[] {
		return this.hippodromePositions
			.filter(position => !position.isVirtualEditPoint());
	}
	
	getPositions(): Cartesian3[] {
		return this.hippodromePositions.map(position => position.getPosition());
	}
	
	private removePosition(point: EditPoint) {
		const index = this.hippodromePositions.findIndex((p) => p === point);
		if (index < 0) {
			return;
		}
		this.hippodromePositions.splice(index, 1);
		this.pointsLayer.remove(point.getId());
	}
	
	private updateHippdromePointsLayer(...point: EditPoint[]) {
		point.forEach(p => this.pointsLayer.update(p, p.getId()));
	}
	
	private updateHippdromeLayer() {
		this.hippodromeLayer.update(this, this.id);
	}
	
	dispose() {
		this.hippodromeLayer.remove(this.id);
		
		this.hippodromePositions.forEach(editPoint => {
			this.pointsLayer.remove(editPoint.getId());
		});
		if (this.movingPoint) {
			this.pointsLayer.remove(this.movingPoint.getId());
			this.movingPoint = undefined;
		}
		this.hippodromePositions.length = 0;
	}
	
	getPointsCount(): number {
		return this.hippodromePositions.length;
	}
	
	getId() {
		return this.id;
	}
}
