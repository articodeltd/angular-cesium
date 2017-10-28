import { AcEntity } from '../../angular-cesium/models/ac-entity';
import { EditPoint } from './edit-point';
import { AcLayerComponent } from '../../angular-cesium/components/ac-layer/ac-layer.component';
import { Cartesian3 } from '../../angular-cesium/models/cartesian3';
import { CoordinateConverter } from '../../angular-cesium/services/coordinate-converter/coordinate-converter.service';
import { PointProps } from './polyline-edit-options';
import { HippodromeEditOptions, HippodromeProps } from './hippodrome-edit-options';

export class EditableHippodrome extends AcEntity {
	
	private hippodromePositions: EditPoint[] = [];
	private movingPoint: EditPoint;
	private done = false;
	private _enableEdit = true;
	private _defaultPointProps: PointProps;
	private _hippodromeProps: HippodromeProps;
	
	constructor(private id: string,
							private pointsLayer: AcLayerComponent,
							private hippodromeLayer: AcLayerComponent,
							private coordinateConverter: CoordinateConverter,
							editOptions: HippodromeEditOptions,
							positions?: Cartesian3[]) {
		super();
		this.defaultPointProps = editOptions.defaultPointOptions;
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
		this.done = true;
	}
	
	setPointsManually(points: EditPoint[]) {
		if (!this.done) {
			throw new Error('Update manually only in edit mode, after polyline is created')
		}
		this.hippodromePositions.forEach(p => this.pointsLayer.remove(p.getId()));
		this.hippodromePositions = points;
		
		this.updateHippdromePointsLayer(...points);
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
			this.done = true;
			this.updateHippdromePointsLayer(this.movingPoint);
			this.updateHippdromeLayer();
			this.movingPoint = null;
		}
		
		
	}
	
	movePoint(toPosition: Cartesian3, editPoint: EditPoint) {
		editPoint.setPosition(toPosition);
		
		this.updateHippdromePointsLayer(editPoint);
		this.updateHippdromeLayer();
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
			.filter(position => !position.isVirtualEditPoint() && position !== this.movingPoint);
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
	
	private updateHippdromeLayer(...point: EditPoint[]) {
		if (this.hippodromePositions.length === 2) {
			this.hippodromeLayer.update(this, this.id);
		}
	}
	
	dispose() {
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
