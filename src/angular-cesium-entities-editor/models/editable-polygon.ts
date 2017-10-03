import { AcEntity } from '../../angular-cesium/models/ac-entity';
import { EditPoint } from './edit-point';
import { EditPolyline } from './edit-polyline';
import { AcLayerComponent } from '../../angular-cesium/components/ac-layer/ac-layer.component';
import { Cartesian3 } from '../../angular-cesium/models/cartesian3';

export class EditablePolygon extends AcEntity {
	private positions: EditPoint[] = [];
	private movingPoint: EditPoint;
	private firstPoint: EditPoint;
	private done = false;
	
	constructor(private id: string,
							private polygonsLayer: AcLayerComponent,
							private pointsLayer: AcLayerComponent,
							private polylinesLayer: AcLayerComponent,
							positions?: Cartesian3[]) {
		super();
		if (positions && positions.length >= 3) {
			this.createFromExisting(positions);
		}
	}
	
	private createFromExisting(positions: Cartesian3[]) {
		positions.forEach((position, index) => {
			const lastPoint: boolean = index === positions.length - 1;
			this.addPointFromExisting(position, lastPoint)
		});
	}
	
	
	addPointFromExisting(position: Cartesian3, lastPoint = false) {
		const newPoint = new EditPoint(this.id, position);
		
		if (!this.firstPoint) {
			this.firstPoint = newPoint;
		} else {
			const previousPoint = this.positions[this.positions.length - 1];
			const polyline = new EditPolyline(this.id, previousPoint.getPosition(), newPoint.getPosition());
			previousPoint.setEndingPolyline(polyline);
			newPoint.setStartingPolyline(polyline);
			
			if (lastPoint) {
				const firstPoint = this.firstPoint;
				const lastPolyline = new EditPolyline(this.id, newPoint.getPosition(), firstPoint.getPosition());
				newPoint.setEndingPolyline(lastPolyline);
				firstPoint.setStartingPolyline(lastPolyline);
			}
		}
		
		this.positions.push(newPoint);
		this.updatePolygonsLayer();
		this.updatePointsLayer(newPoint);
	}
	
	
	addPoint(position: Cartesian3) {
		if (this.done) {
			return;
		}
		
		const firstPointAdded = !this.firstPoint;
		let point: EditPoint;
		if (!this.firstPoint) {
			this.firstPoint = point = new EditPoint(this.id, position);
			this.positions.push(point);
		}
		else {
			point = this.movingPoint;
			point.setPosition(position);
		}
		
		this.movingPoint = new EditPoint(this.id, position.clone());
		this.positions.push(this.movingPoint);
		const polyline = new EditPolyline(this.id, point.getPosition(), this.movingPoint.getPosition());
		point.setStartingPolyline(polyline);
		this.movingPoint.setEndingPolyline(polyline);
		
		this.updatePolygonsLayer();
		if (firstPointAdded) {
			this.updatePointsLayer(point);
		}
		this.updatePointsLayer(this.movingPoint);
	}
	
	movePoint(position: Cartesian3, editPoint?: EditPoint) {
		let point: EditPoint;
		if (!editPoint) {
			if (!this.movingPoint) {
				return;
			}
			point = this.movingPoint;
		}
		else {
			point = editPoint;
			if (!point) {
				return;
			}
		}
		point.setPosition(position);
		
		this.updatePolygonsLayer();
		this.updatePointsLayer(point);
	}
	
	removePoint(editPoint: EditPoint) {
		const pointToRemove = editPoint;
		const lineToRemove = pointToRemove.getStartingPolyline();
		const lineToModify = pointToRemove.getEndingPolyline();
		lineToModify.setEndPosition(lineToRemove.getEndPosition());
		this.removePosition(pointToRemove);
		
		if (this.getPointsCount() >= 3) {
			this.polygonsLayer.update(this, this.id);
		}
		this.pointsLayer.remove(pointToRemove.getId());
		this.polylinesLayer.remove(lineToRemove.getId());
		this.polylinesLayer.update(lineToModify, lineToModify.getId());
	}
	
	addLastPoint(position: Cartesian3) {
		this.done = true;
		this.movingPoint.setPosition(position);
		this.positions.push(this.movingPoint);
		const polyline = new EditPolyline(this.id, this.movingPoint.getPosition(), this.firstPoint.getPosition());
		this.movingPoint.setStartingPolyline(polyline);
		this.firstPoint.setEndingPolyline(polyline);
		this.updatePolygonsLayer();
		this.updatePointsLayer(this.movingPoint);
		this.movingPoint = null;
	}
	
	getPositions(): Cartesian3[] {
		return this.positions.map(position => position.getPosition());
	}
	
	getHierarchy() {
		return new Cesium.PolygonHierarchy(this.positions.map(position => position.getPosition()));
	}
	
	private removePosition(point: EditPoint) {
		const index = this.positions.findIndex((p) => p === point);
		if (index < 0) {
			return;
		}
		this.positions.splice(index, 1);
	}
	
	private updatePolygonsLayer() {
		if (this.getPointsCount() >= 3) {
			this.polygonsLayer.update(this, this.id);
		}
	}
	
	private updatePointsLayer(point: EditPoint) {
		this.pointsLayer.update(point, point.getId());
		const startingPolyline = point.getStartingPolyline();
		if (startingPolyline) {
			this.polylinesLayer.update(startingPolyline, startingPolyline.getId());
		}
		
		const endingPolyline = point.getEndingPolyline();
		if (endingPolyline) {
			this.polylinesLayer.update(endingPolyline, endingPolyline.getId());
		}
	}
	
	dispose() {
		this.polygonsLayer.remove(this.id);
		
		this.positions.forEach(editPoint => {
			this.pointsLayer.remove(editPoint.getId());
			this.polylinesLayer.remove(editPoint.getStartingPolyline().getId());
			this.polylinesLayer.remove(editPoint.getEndingPolyline().getId());
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
