import { AcEntity } from '../../angular-cesium/models/ac-entity';
import { EditPoint } from './edit-point';
import { EditPolyline } from './edit-polyline';
import { AcLayerComponent } from '../../angular-cesium/components/ac-layer/ac-layer.component';
import { Cartesian3 } from '../../angular-cesium/models/cartesian3';
import { CoordinateConverter } from '../../angular-cesium/services/coordinate-converter/coordinate-converter.service';
import { PointProps } from './polygon-edit-options';
import { PolylineEditOptions, PolylineProps } from './polyline-edit-options';

export class EditablePolyline extends AcEntity {
	
	private positions: EditPoint[] = [];
	private polylines: EditPolyline[] = [];
	private movingPoint: EditPoint;
	private done = false;
	private _enableEdit = true;
	private _defaultPointProps: PointProps;
	private _defaultPolylineProps: PolylineProps;
	
	constructor(private id: string,
							private pointsLayer: AcLayerComponent,
							private polylinesLayer: AcLayerComponent,
							private coordinateConverter: CoordinateConverter,
							polygonOptions: PolylineEditOptions,
							positions?: Cartesian3[]) {
		super();
		this.defaultPointProps = polygonOptions.defaultPointOptions;
		this.defaultPolylineProps = polygonOptions.defaultPolylineOptions;
		if (positions && positions.length >= 3) {
			this.createFromExisting(positions);
		}
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
		this.addAllVirtualEditPoints();
		this.done = true;
	}
	
	setPointsManually(points: EditPoint[]) {
		if (!this.done) {
			throw new Error('Update manually only in edit mode, after polygon is created')
		}
		this.positions.forEach(p => this.pointsLayer.remove(p.getId()));
		this.positions = points;
		
		this.updatePointsLayer(...points);
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
				
				this.updatePointsLayer(midPoint);
			}
		});
	}
	
	private setMiddleVirtualPoint(firstP: EditPoint, secondP: EditPoint): EditPoint {
		const currentCart = Cesium.Cartographic.fromCartesian(firstP.getPosition());
		const nextCart = Cesium.Cartographic.fromCartesian(secondP.getPosition());
		const midPointCartesian3 = this.coordinateConverter.midPointToCartesian3(currentCart, nextCart);
		const midPoint = new EditPoint(this.id, midPointCartesian3, this.defaultPointProps);
		midPoint.setVirtualEditPoint(true);
		
		const firstIndex = this.positions.indexOf(firstP);
		this.positions.splice(firstIndex + 1, 0, midPoint);
		return midPoint;
	}
	
	addVirtualEditPoint(point: EditPoint) {
		point.setVirtualEditPoint(false); // actual point becomes a real point
		const pointsCount = this.positions.length;
		const pointIndex = this.positions.indexOf(point);
		const nextIndex = (pointIndex + 1) % (pointsCount);
		const preIndex = ((pointIndex - 1) + pointsCount ) % pointsCount;
		
		const nextPoint = this.positions[nextIndex];
		const prePoint = this.positions[preIndex];
		
		const firstMidPoint = this.setMiddleVirtualPoint(prePoint, point);
		const secMidPoint = this.setMiddleVirtualPoint(point, nextPoint);
		this.updatePointsLayer(firstMidPoint, secMidPoint, point);
		
	}
	
	private renderPolylines() {
		this.polylines = [];
		this.polylinesLayer.removeAll();
		this.positions.forEach((point, index) => {
			if (index !== this.positions.length - 1) {
				const nextIndex = (index + 1);
				const nextPoint = this.positions[nextIndex];
				const polyline = new EditPolyline(this.id, point.getPosition(), nextPoint.getPosition(), this._defaultPolylineProps);
				this.polylines.push(polyline);
				this.polylinesLayer.update(polyline, polyline.getId());
			}
		});
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
			this.updatePointsLayer(firstPoint);
		}
		
		this.movingPoint = new EditPoint(this.id, position.clone(), this.defaultPointProps);
		this.positions.push(this.movingPoint);
		
		this.updatePointsLayer(this.movingPoint);
	}
	
	movePoint(toPosition: Cartesian3, editPoint: EditPoint) {
		editPoint.setPosition(toPosition);
		
		this.updatePointsLayer(editPoint);
	}
	
	moveTempMovingPoint(toPosition: Cartesian3) {
		if (this.movingPoint) {
			this.movePoint(toPosition, this.movingPoint);
		}
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
		this.done = true;
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
	
	private updatePointsLayer(...point: EditPoint[]) {
		this.renderPolylines();
		point.forEach(p => this.pointsLayer.update(p, p.getId()));
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
