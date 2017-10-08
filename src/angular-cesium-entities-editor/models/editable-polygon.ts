import { AcEntity } from '../../angular-cesium/models/ac-entity';
import { EditPoint } from './edit-point';
import { EditPolyline } from './edit-polyline';
import { AcLayerComponent } from '../../angular-cesium/components/ac-layer/ac-layer.component';
import { Cartesian3 } from '../../angular-cesium/models/cartesian3';
import { CoordinateConverter } from '../../angular-cesium/services/coordinate-converter/coordinate-converter.service';

export class EditablePolygon extends AcEntity {
	private positions: EditPoint[] = [];
	private polylines: EditPolyline[] = [];
	private movingPoint: EditPoint;
	private done = false;
	private _enableEdit = true;
	
	constructor(private id: string,
							private polygonsLayer: AcLayerComponent,
							private pointsLayer: AcLayerComponent,
							private polylinesLayer: AcLayerComponent,
							private coordinateConverter: CoordinateConverter,
							positions?: Cartesian3[]) {
		super();
		if (positions && positions.length >= 3) {
			this.createFromExisting(positions);
		}
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
		this.updatePolygonsLayer();
	}
	
	private addAllVirtualEditPoints() {
		const currentPoints = [...this.positions];
		currentPoints.forEach((pos, index) => {
			const currentPoint = pos;
			const nextIndex = (index + 1) % (currentPoints.length);
			const nextPoint = currentPoints[nextIndex];
			
			const midPoint = this.setMiddleVirtualPoint(currentPoint, nextPoint);
			
			this.updatePointsLayer(midPoint);
		});
	}
	
	private setMiddleVirtualPoint(firstP: EditPoint, secondP: EditPoint): EditPoint {
		const currentCart = Cesium.Cartographic.fromCartesian(firstP.getPosition());
		const nextCart = Cesium.Cartographic.fromCartesian(secondP.getPosition());
		const midPointCartesian3 = this.coordinateConverter.midPointToCartesian3(currentCart, nextCart);
		const midPoint = new EditPoint(this.id, midPointCartesian3);
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
			const nextIndex = (index + 1) % (this.positions.length);
			const nextPoint = this.positions[nextIndex];
			const polyline = new EditPolyline(this.id, point.getPosition(), nextPoint.getPosition());
			this.polylines.push(polyline);
			this.polylinesLayer.update(polyline, polyline.getId());
			
		});
	}
	
	addPointFromExisting(position: Cartesian3) {
		const newPoint = new EditPoint(this.id, position);
		this.positions.push(newPoint);
		this.updatePointsLayer(newPoint);
	}
	
	
	addPoint(position: Cartesian3) {
		if (this.done) {
			return;
		}
		const isFirstPoint = !this.positions.length;
		if (isFirstPoint) {
			const firstPoint = new EditPoint(this.id, position);
			this.positions.push(firstPoint);
			this.updatePointsLayer(firstPoint);
		}
		
		this.movingPoint = new EditPoint(this.id, position.clone());
		this.positions.push(this.movingPoint);
		
		this.updatePointsLayer(this.movingPoint);
		this.updatePolygonsLayer();
	}
	
	movePoint(toPosition: Cartesian3, editPoint: EditPoint) {
		editPoint.setPosition(toPosition);
		
		this.updatePolygonsLayer();
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
		
		if (this.getPointsCount() >= 3) {
			this.polygonsLayer.update(this, this.id);
		}
		this.renderPolylines();
	}
	
	addLastPoint(position: Cartesian3) {
		this.done = true;
		this.removePosition(this.movingPoint); // remove movingPoint
		this.movingPoint = null;
		this.updatePolygonsLayer();
		
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
	
	getHierarchy() {
		return new Cesium.PolygonHierarchy(this.getPositions());
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
	
	private updatePointsLayer(...point: EditPoint[]) {
		point.forEach(p => this.pointsLayer.update(p, p.getId()));
		this.renderPolylines();
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
