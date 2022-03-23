import { Cartesian3, Cartographic, CallbackProperty, Rectangle } from 'cesium';
import { AcEntity } from '../../angular-cesium/models/ac-entity';
import { EditPoint } from './edit-point';
import { defaultLabelProps } from './label-props';
export class EditableRectangle extends AcEntity {
    constructor(id, pointsLayer, rectangleLayer, coordinateConverter, editOptions, positions) {
        super();
        this.id = id;
        this.pointsLayer = pointsLayer;
        this.rectangleLayer = rectangleLayer;
        this.coordinateConverter = coordinateConverter;
        this.positions = [];
        this.done = false;
        this._enableEdit = true;
        this._labels = [];
        this.defaultPointProps = { ...editOptions.pointProps };
        this.rectangleProps = { ...editOptions.rectangleProps };
        if (positions && positions.length === 2) {
            this.createFromExisting(positions);
        }
        else if (positions) {
            throw new Error('Rectangle consist of 2 points but provided ' + positions.length);
        }
    }
    get labels() {
        return this._labels;
    }
    set labels(labels) {
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
    get rectangleProps() {
        return this._rectangleProps;
    }
    set rectangleProps(value) {
        this._rectangleProps = value;
    }
    get defaultPointProps() {
        return this._defaultPointProps;
    }
    set defaultPointProps(value) {
        this._defaultPointProps = value;
    }
    get enableEdit() {
        return this._enableEdit;
    }
    set enableEdit(value) {
        this._enableEdit = value;
        this.positions.forEach(point => {
            point.show = value;
            this.updatePointsLayer(point);
        });
    }
    createFromExisting(positions) {
        positions.forEach(position => {
            this.addPointFromExisting(position);
        });
        this.updateRectangleLayer();
        this.updatePointsLayer(...this.positions);
        this.done = true;
    }
    setPointsManually(points, widthMeters) {
        if (!this.done) {
            throw new Error('Update manually only in edit mode, after rectangle is created');
        }
        this.positions.forEach(p => this.pointsLayer.remove(p.getId()));
        this.positions = points;
        this.updatePointsLayer(...points);
        this.updateRectangleLayer();
    }
    addPointFromExisting(position) {
        const newPoint = new EditPoint(this.id, position, this.defaultPointProps);
        this.positions.push(newPoint);
        this.updatePointsLayer(newPoint);
    }
    addPoint(position) {
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
        }
        else {
            this.updatePointsLayer(...this.positions);
            this.updateRectangleLayer();
            this.done = true;
            this.movingPoint = null;
        }
    }
    movePoint(toPosition, editPoint) {
        if (!editPoint.isVirtualEditPoint()) {
            editPoint.setPosition(toPosition);
            this.updatePointsLayer(...this.positions);
            this.updateRectangleLayer();
        }
    }
    moveShape(startMovingPosition, draggedToPosition) {
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
    moveTempMovingPoint(toPosition) {
        if (this.movingPoint) {
            this.movePoint(toPosition, this.movingPoint);
        }
    }
    removePoint(pointToRemove) {
        this.removePosition(pointToRemove);
        this.positions.filter(p => p.isVirtualEditPoint()).forEach(p => this.removePosition(p));
    }
    addLastPoint(position) {
        this.done = true;
        this.removePosition(this.movingPoint); // remove movingPoint
        this.movingPoint = null;
    }
    getRealPositions() {
        return this.getRealPoints().map(position => position.getPosition());
    }
    getRealPositionsCallbackProperty() {
        return new CallbackProperty(this.getRealPositions.bind(this), false);
    }
    getRealPoints() {
        return this.positions.filter(position => !position.isVirtualEditPoint());
    }
    getPositions() {
        return this.positions.map(position => position.getPosition());
    }
    getRectangle() {
        const cartographics = this.getPositions().map(cartesian => Cartographic.fromCartesian(cartesian));
        const longitudes = cartographics.map(position => position.longitude);
        const latitudes = cartographics.map(position => position.latitude);
        return new Rectangle(Math.min(...longitudes), Math.min(...latitudes), Math.max(...longitudes), Math.max(...latitudes));
    }
    getRectangleCallbackProperty() {
        return new CallbackProperty(this.getRectangle.bind(this), false);
    }
    removePosition(point) {
        const index = this.positions.findIndex(p => p === point);
        if (index < 0) {
            return;
        }
        this.positions.splice(index, 1);
        this.pointsLayer.remove(point.getId());
    }
    updatePointsLayer(...point) {
        point.forEach(p => this.pointsLayer.update(p, p.getId()));
    }
    updateRectangleLayer() {
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
    getPointsCount() {
        return this.positions.length;
    }
    getId() {
        return this.id;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdGFibGUtcmVjdGFuZ2xlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2xpYi9hbmd1bGFyLWNlc2l1bS13aWRnZXRzL21vZGVscy9lZGl0YWJsZS1yZWN0YW5nbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsZ0JBQWdCLEVBQUUsU0FBUyxFQUFFLE1BQU0sUUFBUSxDQUFDO0FBQy9FLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSx1Q0FBdUMsQ0FBQztBQUNqRSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBTXpDLE9BQU8sRUFBRSxpQkFBaUIsRUFBYyxNQUFNLGVBQWUsQ0FBQztBQUU5RCxNQUFNLE9BQU8saUJBQWtCLFNBQVEsUUFBUTtJQVU3QyxZQUNVLEVBQVUsRUFDVixXQUE2QixFQUM3QixjQUFnQyxFQUNoQyxtQkFBd0MsRUFDaEQsV0FBaUMsRUFDakMsU0FBd0I7UUFFeEIsS0FBSyxFQUFFLENBQUM7UUFQQSxPQUFFLEdBQUYsRUFBRSxDQUFRO1FBQ1YsZ0JBQVcsR0FBWCxXQUFXLENBQWtCO1FBQzdCLG1CQUFjLEdBQWQsY0FBYyxDQUFrQjtRQUNoQyx3QkFBbUIsR0FBbkIsbUJBQW1CLENBQXFCO1FBYjFDLGNBQVMsR0FBZ0IsRUFBRSxDQUFDO1FBRTVCLFNBQUksR0FBRyxLQUFLLENBQUM7UUFDYixnQkFBVyxHQUFHLElBQUksQ0FBQztRQUluQixZQUFPLEdBQWlCLEVBQUUsQ0FBQztRQVdqQyxJQUFJLENBQUMsaUJBQWlCLEdBQUcsRUFBQyxHQUFHLFdBQVcsQ0FBQyxVQUFVLEVBQUMsQ0FBQztRQUNyRCxJQUFJLENBQUMsY0FBYyxHQUFHLEVBQUMsR0FBRyxXQUFXLENBQUMsY0FBYyxFQUFDLENBQUM7UUFDdEQsSUFBSSxTQUFTLElBQUksU0FBUyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDdkMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFNBQVMsQ0FBQyxDQUFDO1NBQ3BDO2FBQU0sSUFBSSxTQUFTLEVBQUU7WUFDcEIsTUFBTSxJQUFJLEtBQUssQ0FBQyw2Q0FBNkMsR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDbkY7SUFDSCxDQUFDO0lBRUQsSUFBSSxNQUFNO1FBQ1IsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDO0lBQ3RCLENBQUM7SUFFRCxJQUFJLE1BQU0sQ0FBQyxNQUFvQjtRQUM3QixJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ1gsT0FBTztTQUNSO1FBQ0QsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7UUFDMUMsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFO1lBQ3pDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFO2dCQUNuQixLQUFLLENBQUMsUUFBUSxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUNuQztZQUVELE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsaUJBQWlCLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDckQsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsSUFBSSxjQUFjO1FBQ2hCLE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQztJQUM5QixDQUFDO0lBRUQsSUFBSSxjQUFjLENBQUMsS0FBcUI7UUFDdEMsSUFBSSxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUM7SUFDL0IsQ0FBQztJQUVELElBQUksaUJBQWlCO1FBQ25CLE9BQU8sSUFBSSxDQUFDLGtCQUFrQixDQUFDO0lBQ2pDLENBQUM7SUFFRCxJQUFJLGlCQUFpQixDQUFDLEtBQWlCO1FBQ3JDLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxLQUFLLENBQUM7SUFDbEMsQ0FBQztJQUVELElBQUksVUFBVTtRQUNaLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQztJQUMxQixDQUFDO0lBRUQsSUFBSSxVQUFVLENBQUMsS0FBYztRQUMzQixJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztRQUN6QixJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUM3QixLQUFLLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQztZQUNuQixJQUFJLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDaEMsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRU8sa0JBQWtCLENBQUMsU0FBdUI7UUFDaEQsU0FBUyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsRUFBRTtZQUMzQixJQUFJLENBQUMsb0JBQW9CLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDdEMsQ0FBQyxDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztRQUM1QixJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDMUMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7SUFDbkIsQ0FBQztJQUVELGlCQUFpQixDQUFDLE1BQW1CLEVBQUUsV0FBb0I7UUFDekQsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDZCxNQUFNLElBQUksS0FBSyxDQUFDLCtEQUErRCxDQUFDLENBQUM7U0FDbEY7UUFDRCxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDaEUsSUFBSSxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUM7UUFDeEIsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUM7UUFDbEMsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUM7SUFDOUIsQ0FBQztJQUVELG9CQUFvQixDQUFDLFFBQW9CO1FBQ3ZDLE1BQU0sUUFBUSxHQUFHLElBQUksU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBQzFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzlCLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNuQyxDQUFDO0lBRUQsUUFBUSxDQUFDLFFBQW9CO1FBQzNCLElBQUksSUFBSSxDQUFDLElBQUksRUFBRTtZQUNiLE9BQU87U0FDUjtRQUNELE1BQU0sWUFBWSxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUM7UUFDNUMsSUFBSSxZQUFZLEVBQUU7WUFDaEIsTUFBTSxVQUFVLEdBQUcsSUFBSSxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7WUFDNUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDaEMsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLFFBQVEsQ0FBQyxLQUFLLEVBQUUsRUFBRSxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztZQUNwRixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDdEMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFVBQVUsQ0FBQyxDQUFDO1NBQ3BDO2FBQU07WUFFTCxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDMUMsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUM7WUFDNUIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7WUFDakIsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7U0FDekI7SUFDSCxDQUFDO0lBRUQsU0FBUyxDQUFDLFVBQXNCLEVBQUUsU0FBb0I7UUFDcEQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsRUFBRSxFQUFFO1lBQ25DLFNBQVMsQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDbEMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQzFDLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO1NBQzdCO0lBQ0gsQ0FBQztJQUVELFNBQVMsQ0FBQyxtQkFBK0IsRUFBRSxpQkFBNkI7UUFDdEUsSUFBSSxDQUFDLElBQUksQ0FBQyxxQkFBcUIsRUFBRTtZQUMvQixJQUFJLENBQUMscUJBQXFCLEdBQUcsbUJBQW1CLENBQUM7U0FDbEQ7UUFFRCxNQUFNLHVCQUF1QixHQUFHLFlBQVksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLENBQUM7UUFDdkYsTUFBTSw2QkFBNkIsR0FBRyxZQUFZLENBQUMsYUFBYSxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFDcEYsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUNuQyxNQUFNLFlBQVksR0FBRyxZQUFZLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO1lBQ3JFLFlBQVksQ0FBQyxTQUFTLElBQUksQ0FBQyw2QkFBNkIsQ0FBQyxTQUFTLEdBQUcsdUJBQXVCLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDeEcsWUFBWSxDQUFDLFFBQVEsSUFBSSxDQUFDLDZCQUE2QixDQUFDLFFBQVEsR0FBRyx1QkFBdUIsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNyRyxLQUFLLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDLFNBQVMsRUFBRSxZQUFZLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDOUYsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDMUMsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUM7UUFDNUIsSUFBSSxDQUFDLHFCQUFxQixHQUFHLGlCQUFpQixDQUFDO0lBQ2pELENBQUM7SUFFRCxZQUFZO1FBQ1YsSUFBSSxDQUFDLHFCQUFxQixHQUFHLFNBQVMsQ0FBQztRQUN2QyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQy9ELElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO0lBQzlCLENBQUM7SUFFRCxZQUFZO1FBQ1YsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzVDLENBQUM7SUFFRCxtQkFBbUIsQ0FBQyxVQUFzQjtRQUN4QyxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDcEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1NBQzlDO0lBQ0gsQ0FBQztJQUVELFdBQVcsQ0FBQyxhQUF3QjtRQUNsQyxJQUFJLENBQUMsY0FBYyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ25DLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLGtCQUFrQixFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDMUYsQ0FBQztJQUVELFlBQVksQ0FBQyxRQUFvQjtRQUMvQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNqQixJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLHFCQUFxQjtRQUM1RCxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztJQUMxQixDQUFDO0lBRUQsZ0JBQWdCO1FBQ2QsT0FBTyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUM7SUFDdEUsQ0FBQztJQUVELGdDQUFnQztRQUM5QixPQUFPLElBQUksZ0JBQWdCLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUN2RSxDQUFDO0lBRUQsYUFBYTtRQUNYLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLENBQUM7SUFDM0UsQ0FBQztJQUVELFlBQVk7UUFDVixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUM7SUFDaEUsQ0FBQztJQUVELFlBQVk7UUFDVixNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBQ2xHLE1BQU0sVUFBVSxHQUFHLGFBQWEsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDckUsTUFBTSxTQUFTLEdBQUcsYUFBYSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFFLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUVwRSxPQUFPLElBQUksU0FBUyxDQUNsQixJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsVUFBVSxDQUFDLEVBQ3ZCLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxTQUFTLENBQUMsRUFDdEIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxFQUN2QixJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsU0FBUyxDQUFDLENBQ3ZCLENBQUM7SUFDSixDQUFDO0lBRUQsNEJBQTRCO1FBQzFCLE9BQU8sSUFBSSxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUNuRSxDQUFDO0lBRU8sY0FBYyxDQUFDLEtBQWdCO1FBQ3JDLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLEtBQUssQ0FBQyxDQUFDO1FBQ3pELElBQUksS0FBSyxHQUFHLENBQUMsRUFBRTtZQUNiLE9BQU87U0FDUjtRQUNELElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNoQyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztJQUN6QyxDQUFDO0lBRU8saUJBQWlCLENBQUMsR0FBRyxLQUFrQjtRQUM3QyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDNUQsQ0FBQztJQUVPLG9CQUFvQjtRQUMxQixJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzVDLENBQUM7SUFFRCxPQUFPO1FBQ0wsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRXBDLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxFQUFFO1lBQ2pDLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBQzdDLENBQUMsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFO1lBQ3BCLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztZQUNsRCxJQUFJLENBQUMsV0FBVyxHQUFHLFNBQVMsQ0FBQztTQUM5QjtRQUNELElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztJQUM1QixDQUFDO0lBRUQsY0FBYztRQUNaLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUM7SUFDL0IsQ0FBQztJQUVELEtBQUs7UUFDSCxPQUFPLElBQUksQ0FBQyxFQUFFLENBQUM7SUFDakIsQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2FydGVzaWFuMywgQ2FydG9ncmFwaGljLCBDYWxsYmFja1Byb3BlcnR5LCBSZWN0YW5nbGUgfSBmcm9tICdjZXNpdW0nO1xyXG5pbXBvcnQgeyBBY0VudGl0eSB9IGZyb20gJy4uLy4uL2FuZ3VsYXItY2VzaXVtL21vZGVscy9hYy1lbnRpdHknO1xyXG5pbXBvcnQgeyBFZGl0UG9pbnQgfSBmcm9tICcuL2VkaXQtcG9pbnQnO1xyXG5pbXBvcnQgeyBBY0xheWVyQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vYW5ndWxhci1jZXNpdW0vY29tcG9uZW50cy9hYy1sYXllci9hYy1sYXllci5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBDb29yZGluYXRlQ29udmVydGVyIH0gZnJvbSAnLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvY29vcmRpbmF0ZS1jb252ZXJ0ZXIvY29vcmRpbmF0ZS1jb252ZXJ0ZXIuc2VydmljZSc7XHJcbmltcG9ydCB7IEdlb1V0aWxzU2VydmljZSB9IGZyb20gJy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2dlby11dGlscy9nZW8tdXRpbHMuc2VydmljZSc7XHJcbmltcG9ydCB7IFJlY3RhbmdsZUVkaXRPcHRpb25zLCBSZWN0YW5nbGVQcm9wcyB9IGZyb20gJy4vcmVjdGFuZ2xlLWVkaXQtb3B0aW9ucyc7XHJcbmltcG9ydCB7IFBvaW50UHJvcHMgfSBmcm9tICcuL3BvaW50LWVkaXQtb3B0aW9ucyc7XHJcbmltcG9ydCB7IGRlZmF1bHRMYWJlbFByb3BzLCBMYWJlbFByb3BzIH0gZnJvbSAnLi9sYWJlbC1wcm9wcyc7XHJcblxyXG5leHBvcnQgY2xhc3MgRWRpdGFibGVSZWN0YW5nbGUgZXh0ZW5kcyBBY0VudGl0eSB7XHJcbiAgcHJpdmF0ZSBwb3NpdGlvbnM6IEVkaXRQb2ludFtdID0gW107XHJcbiAgcHJpdmF0ZSBtb3ZpbmdQb2ludDogRWRpdFBvaW50O1xyXG4gIHByaXZhdGUgZG9uZSA9IGZhbHNlO1xyXG4gIHByaXZhdGUgX2VuYWJsZUVkaXQgPSB0cnVlO1xyXG4gIHByaXZhdGUgX2RlZmF1bHRQb2ludFByb3BzOiBQb2ludFByb3BzO1xyXG4gIHByaXZhdGUgX3JlY3RhbmdsZVByb3BzOiBSZWN0YW5nbGVQcm9wcztcclxuICBwcml2YXRlIGxhc3REcmFnZ2VkVG9Qb3NpdGlvbjogQ2FydGVzaWFuMztcclxuICBwcml2YXRlIF9sYWJlbHM6IExhYmVsUHJvcHNbXSA9IFtdO1xyXG5cclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHByaXZhdGUgaWQ6IHN0cmluZyxcclxuICAgIHByaXZhdGUgcG9pbnRzTGF5ZXI6IEFjTGF5ZXJDb21wb25lbnQsXHJcbiAgICBwcml2YXRlIHJlY3RhbmdsZUxheWVyOiBBY0xheWVyQ29tcG9uZW50LFxyXG4gICAgcHJpdmF0ZSBjb29yZGluYXRlQ29udmVydGVyOiBDb29yZGluYXRlQ29udmVydGVyLFxyXG4gICAgZWRpdE9wdGlvbnM6IFJlY3RhbmdsZUVkaXRPcHRpb25zLFxyXG4gICAgcG9zaXRpb25zPzogQ2FydGVzaWFuM1tdXHJcbiAgKSB7XHJcbiAgICBzdXBlcigpO1xyXG4gICAgdGhpcy5kZWZhdWx0UG9pbnRQcm9wcyA9IHsuLi5lZGl0T3B0aW9ucy5wb2ludFByb3BzfTtcclxuICAgIHRoaXMucmVjdGFuZ2xlUHJvcHMgPSB7Li4uZWRpdE9wdGlvbnMucmVjdGFuZ2xlUHJvcHN9O1xyXG4gICAgaWYgKHBvc2l0aW9ucyAmJiBwb3NpdGlvbnMubGVuZ3RoID09PSAyKSB7XHJcbiAgICAgIHRoaXMuY3JlYXRlRnJvbUV4aXN0aW5nKHBvc2l0aW9ucyk7XHJcbiAgICB9IGVsc2UgaWYgKHBvc2l0aW9ucykge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1JlY3RhbmdsZSBjb25zaXN0IG9mIDIgcG9pbnRzIGJ1dCBwcm92aWRlZCAnICsgcG9zaXRpb25zLmxlbmd0aCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBnZXQgbGFiZWxzKCk6IExhYmVsUHJvcHNbXSB7XHJcbiAgICByZXR1cm4gdGhpcy5fbGFiZWxzO1xyXG4gIH1cclxuXHJcbiAgc2V0IGxhYmVscyhsYWJlbHM6IExhYmVsUHJvcHNbXSkge1xyXG4gICAgaWYgKCFsYWJlbHMpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgY29uc3QgcG9zaXRpb25zID0gdGhpcy5nZXRSZWFsUG9zaXRpb25zKCk7XHJcbiAgICB0aGlzLl9sYWJlbHMgPSBsYWJlbHMubWFwKChsYWJlbCwgaW5kZXgpID0+IHtcclxuICAgICAgaWYgKCFsYWJlbC5wb3NpdGlvbikge1xyXG4gICAgICAgIGxhYmVsLnBvc2l0aW9uID0gcG9zaXRpb25zW2luZGV4XTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRMYWJlbFByb3BzLCBsYWJlbCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGdldCByZWN0YW5nbGVQcm9wcygpOiBSZWN0YW5nbGVQcm9wcyB7XHJcbiAgICByZXR1cm4gdGhpcy5fcmVjdGFuZ2xlUHJvcHM7XHJcbiAgfVxyXG5cclxuICBzZXQgcmVjdGFuZ2xlUHJvcHModmFsdWU6IFJlY3RhbmdsZVByb3BzKSB7XHJcbiAgICB0aGlzLl9yZWN0YW5nbGVQcm9wcyA9IHZhbHVlO1xyXG4gIH1cclxuXHJcbiAgZ2V0IGRlZmF1bHRQb2ludFByb3BzKCk6IFBvaW50UHJvcHMge1xyXG4gICAgcmV0dXJuIHRoaXMuX2RlZmF1bHRQb2ludFByb3BzO1xyXG4gIH1cclxuXHJcbiAgc2V0IGRlZmF1bHRQb2ludFByb3BzKHZhbHVlOiBQb2ludFByb3BzKSB7XHJcbiAgICB0aGlzLl9kZWZhdWx0UG9pbnRQcm9wcyA9IHZhbHVlO1xyXG4gIH1cclxuXHJcbiAgZ2V0IGVuYWJsZUVkaXQoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5fZW5hYmxlRWRpdDtcclxuICB9XHJcblxyXG4gIHNldCBlbmFibGVFZGl0KHZhbHVlOiBib29sZWFuKSB7XHJcbiAgICB0aGlzLl9lbmFibGVFZGl0ID0gdmFsdWU7XHJcbiAgICB0aGlzLnBvc2l0aW9ucy5mb3JFYWNoKHBvaW50ID0+IHtcclxuICAgICAgcG9pbnQuc2hvdyA9IHZhbHVlO1xyXG4gICAgICB0aGlzLnVwZGF0ZVBvaW50c0xheWVyKHBvaW50KTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBjcmVhdGVGcm9tRXhpc3RpbmcocG9zaXRpb25zOiBDYXJ0ZXNpYW4zW10pIHtcclxuICAgIHBvc2l0aW9ucy5mb3JFYWNoKHBvc2l0aW9uID0+IHtcclxuICAgICAgdGhpcy5hZGRQb2ludEZyb21FeGlzdGluZyhwb3NpdGlvbik7XHJcbiAgICB9KTtcclxuICAgIHRoaXMudXBkYXRlUmVjdGFuZ2xlTGF5ZXIoKTtcclxuICAgIHRoaXMudXBkYXRlUG9pbnRzTGF5ZXIoLi4udGhpcy5wb3NpdGlvbnMpO1xyXG4gICAgdGhpcy5kb25lID0gdHJ1ZTtcclxuICB9XHJcblxyXG4gIHNldFBvaW50c01hbnVhbGx5KHBvaW50czogRWRpdFBvaW50W10sIHdpZHRoTWV0ZXJzPzogbnVtYmVyKSB7XHJcbiAgICBpZiAoIXRoaXMuZG9uZSkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1VwZGF0ZSBtYW51YWxseSBvbmx5IGluIGVkaXQgbW9kZSwgYWZ0ZXIgcmVjdGFuZ2xlIGlzIGNyZWF0ZWQnKTtcclxuICAgIH1cclxuICAgIHRoaXMucG9zaXRpb25zLmZvckVhY2gocCA9PiB0aGlzLnBvaW50c0xheWVyLnJlbW92ZShwLmdldElkKCkpKTtcclxuICAgIHRoaXMucG9zaXRpb25zID0gcG9pbnRzO1xyXG4gICAgdGhpcy51cGRhdGVQb2ludHNMYXllciguLi5wb2ludHMpO1xyXG4gICAgdGhpcy51cGRhdGVSZWN0YW5nbGVMYXllcigpO1xyXG4gIH1cclxuXHJcbiAgYWRkUG9pbnRGcm9tRXhpc3RpbmcocG9zaXRpb246IENhcnRlc2lhbjMpIHtcclxuICAgIGNvbnN0IG5ld1BvaW50ID0gbmV3IEVkaXRQb2ludCh0aGlzLmlkLCBwb3NpdGlvbiwgdGhpcy5kZWZhdWx0UG9pbnRQcm9wcyk7XHJcbiAgICB0aGlzLnBvc2l0aW9ucy5wdXNoKG5ld1BvaW50KTtcclxuICAgIHRoaXMudXBkYXRlUG9pbnRzTGF5ZXIobmV3UG9pbnQpO1xyXG4gIH1cclxuXHJcbiAgYWRkUG9pbnQocG9zaXRpb246IENhcnRlc2lhbjMpIHtcclxuICAgIGlmICh0aGlzLmRvbmUpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgY29uc3QgaXNGaXJzdFBvaW50ID0gIXRoaXMucG9zaXRpb25zLmxlbmd0aDtcclxuICAgIGlmIChpc0ZpcnN0UG9pbnQpIHtcclxuICAgICAgY29uc3QgZmlyc3RQb2ludCA9IG5ldyBFZGl0UG9pbnQodGhpcy5pZCwgcG9zaXRpb24sIHRoaXMuZGVmYXVsdFBvaW50UHJvcHMpO1xyXG4gICAgICB0aGlzLnBvc2l0aW9ucy5wdXNoKGZpcnN0UG9pbnQpO1xyXG4gICAgICB0aGlzLm1vdmluZ1BvaW50ID0gbmV3IEVkaXRQb2ludCh0aGlzLmlkLCBwb3NpdGlvbi5jbG9uZSgpLCB0aGlzLmRlZmF1bHRQb2ludFByb3BzKTtcclxuICAgICAgdGhpcy5wb3NpdGlvbnMucHVzaCh0aGlzLm1vdmluZ1BvaW50KTtcclxuICAgICAgdGhpcy51cGRhdGVQb2ludHNMYXllcihmaXJzdFBvaW50KTtcclxuICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICB0aGlzLnVwZGF0ZVBvaW50c0xheWVyKC4uLnRoaXMucG9zaXRpb25zKTtcclxuICAgICAgdGhpcy51cGRhdGVSZWN0YW5nbGVMYXllcigpO1xyXG4gICAgICB0aGlzLmRvbmUgPSB0cnVlO1xyXG4gICAgICB0aGlzLm1vdmluZ1BvaW50ID0gbnVsbDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIG1vdmVQb2ludCh0b1Bvc2l0aW9uOiBDYXJ0ZXNpYW4zLCBlZGl0UG9pbnQ6IEVkaXRQb2ludCkge1xyXG4gICAgaWYgKCFlZGl0UG9pbnQuaXNWaXJ0dWFsRWRpdFBvaW50KCkpIHtcclxuICAgICAgZWRpdFBvaW50LnNldFBvc2l0aW9uKHRvUG9zaXRpb24pO1xyXG4gICAgICB0aGlzLnVwZGF0ZVBvaW50c0xheWVyKC4uLnRoaXMucG9zaXRpb25zKTtcclxuICAgICAgdGhpcy51cGRhdGVSZWN0YW5nbGVMYXllcigpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgbW92ZVNoYXBlKHN0YXJ0TW92aW5nUG9zaXRpb246IENhcnRlc2lhbjMsIGRyYWdnZWRUb1Bvc2l0aW9uOiBDYXJ0ZXNpYW4zKSB7XHJcbiAgICBpZiAoIXRoaXMubGFzdERyYWdnZWRUb1Bvc2l0aW9uKSB7XHJcbiAgICAgIHRoaXMubGFzdERyYWdnZWRUb1Bvc2l0aW9uID0gc3RhcnRNb3ZpbmdQb3NpdGlvbjtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBsYXN0RHJhZ2dlZENhcnRvZ3JhcGhpYyA9IENhcnRvZ3JhcGhpYy5mcm9tQ2FydGVzaWFuKHRoaXMubGFzdERyYWdnZWRUb1Bvc2l0aW9uKTtcclxuICAgIGNvbnN0IGRyYWdnZWRUb1Bvc2l0aW9uQ2FydG9ncmFwaGljID0gQ2FydG9ncmFwaGljLmZyb21DYXJ0ZXNpYW4oZHJhZ2dlZFRvUG9zaXRpb24pO1xyXG4gICAgdGhpcy5nZXRSZWFsUG9pbnRzKCkuZm9yRWFjaChwb2ludCA9PiB7XHJcbiAgICAgIGNvbnN0IGNhcnRvZ3JhcGhpYyA9IENhcnRvZ3JhcGhpYy5mcm9tQ2FydGVzaWFuKHBvaW50LmdldFBvc2l0aW9uKCkpO1xyXG4gICAgICBjYXJ0b2dyYXBoaWMubG9uZ2l0dWRlICs9IChkcmFnZ2VkVG9Qb3NpdGlvbkNhcnRvZ3JhcGhpYy5sb25naXR1ZGUgLSBsYXN0RHJhZ2dlZENhcnRvZ3JhcGhpYy5sb25naXR1ZGUpO1xyXG4gICAgICBjYXJ0b2dyYXBoaWMubGF0aXR1ZGUgKz0gKGRyYWdnZWRUb1Bvc2l0aW9uQ2FydG9ncmFwaGljLmxhdGl0dWRlIC0gbGFzdERyYWdnZWRDYXJ0b2dyYXBoaWMubGF0aXR1ZGUpO1xyXG4gICAgICBwb2ludC5zZXRQb3NpdGlvbihDYXJ0ZXNpYW4zLmZyb21SYWRpYW5zKGNhcnRvZ3JhcGhpYy5sb25naXR1ZGUsIGNhcnRvZ3JhcGhpYy5sYXRpdHVkZSwgMCkpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy51cGRhdGVQb2ludHNMYXllciguLi50aGlzLnBvc2l0aW9ucyk7XHJcbiAgICB0aGlzLnVwZGF0ZVJlY3RhbmdsZUxheWVyKCk7XHJcbiAgICB0aGlzLmxhc3REcmFnZ2VkVG9Qb3NpdGlvbiA9IGRyYWdnZWRUb1Bvc2l0aW9uO1xyXG4gIH1cclxuXHJcbiAgZW5kTW92ZVNoYXBlKCkge1xyXG4gICAgdGhpcy5sYXN0RHJhZ2dlZFRvUG9zaXRpb24gPSB1bmRlZmluZWQ7XHJcbiAgICB0aGlzLnBvc2l0aW9ucy5mb3JFYWNoKHBvaW50ID0+IHRoaXMudXBkYXRlUG9pbnRzTGF5ZXIocG9pbnQpKTtcclxuICAgIHRoaXMudXBkYXRlUmVjdGFuZ2xlTGF5ZXIoKTtcclxuICB9XHJcblxyXG4gIGVuZE1vdmVQb2ludCgpIHtcclxuICAgIHRoaXMudXBkYXRlUG9pbnRzTGF5ZXIoLi4udGhpcy5wb3NpdGlvbnMpO1xyXG4gIH1cclxuXHJcbiAgbW92ZVRlbXBNb3ZpbmdQb2ludCh0b1Bvc2l0aW9uOiBDYXJ0ZXNpYW4zKSB7XHJcbiAgICBpZiAodGhpcy5tb3ZpbmdQb2ludCkge1xyXG4gICAgICB0aGlzLm1vdmVQb2ludCh0b1Bvc2l0aW9uLCB0aGlzLm1vdmluZ1BvaW50KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJlbW92ZVBvaW50KHBvaW50VG9SZW1vdmU6IEVkaXRQb2ludCkge1xyXG4gICAgdGhpcy5yZW1vdmVQb3NpdGlvbihwb2ludFRvUmVtb3ZlKTtcclxuICAgIHRoaXMucG9zaXRpb25zLmZpbHRlcihwID0+IHAuaXNWaXJ0dWFsRWRpdFBvaW50KCkpLmZvckVhY2gocCA9PiB0aGlzLnJlbW92ZVBvc2l0aW9uKHApKTtcclxuICB9XHJcblxyXG4gIGFkZExhc3RQb2ludChwb3NpdGlvbjogQ2FydGVzaWFuMykge1xyXG4gICAgdGhpcy5kb25lID0gdHJ1ZTtcclxuICAgIHRoaXMucmVtb3ZlUG9zaXRpb24odGhpcy5tb3ZpbmdQb2ludCk7IC8vIHJlbW92ZSBtb3ZpbmdQb2ludFxyXG4gICAgdGhpcy5tb3ZpbmdQb2ludCA9IG51bGw7XHJcbiAgfVxyXG5cclxuICBnZXRSZWFsUG9zaXRpb25zKCk6IENhcnRlc2lhbjNbXSB7XHJcbiAgICByZXR1cm4gdGhpcy5nZXRSZWFsUG9pbnRzKCkubWFwKHBvc2l0aW9uID0+IHBvc2l0aW9uLmdldFBvc2l0aW9uKCkpO1xyXG4gIH1cclxuXHJcbiAgZ2V0UmVhbFBvc2l0aW9uc0NhbGxiYWNrUHJvcGVydHkoKTogQ2FsbGJhY2tQcm9wZXJ0eSB7XHJcbiAgICByZXR1cm4gbmV3IENhbGxiYWNrUHJvcGVydHkodGhpcy5nZXRSZWFsUG9zaXRpb25zLmJpbmQodGhpcyksIGZhbHNlKTtcclxuICB9XHJcblxyXG4gIGdldFJlYWxQb2ludHMoKTogRWRpdFBvaW50W10ge1xyXG4gICAgcmV0dXJuIHRoaXMucG9zaXRpb25zLmZpbHRlcihwb3NpdGlvbiA9PiAhcG9zaXRpb24uaXNWaXJ0dWFsRWRpdFBvaW50KCkpO1xyXG4gIH1cclxuXHJcbiAgZ2V0UG9zaXRpb25zKCk6IENhcnRlc2lhbjNbXSB7XHJcbiAgICByZXR1cm4gdGhpcy5wb3NpdGlvbnMubWFwKHBvc2l0aW9uID0+IHBvc2l0aW9uLmdldFBvc2l0aW9uKCkpO1xyXG4gIH1cclxuXHJcbiAgZ2V0UmVjdGFuZ2xlKCk6IFJlY3RhbmdsZSB7XHJcbiAgICBjb25zdCBjYXJ0b2dyYXBoaWNzID0gdGhpcy5nZXRQb3NpdGlvbnMoKS5tYXAoY2FydGVzaWFuID0+IENhcnRvZ3JhcGhpYy5mcm9tQ2FydGVzaWFuKGNhcnRlc2lhbikpO1xyXG4gICAgY29uc3QgbG9uZ2l0dWRlcyA9IGNhcnRvZ3JhcGhpY3MubWFwKHBvc2l0aW9uID0+IHBvc2l0aW9uLmxvbmdpdHVkZSk7XHJcbiAgICBjb25zdCBsYXRpdHVkZXMgPSBjYXJ0b2dyYXBoaWNzLm1hcChwb3NpdGlvbiA9PiAgcG9zaXRpb24ubGF0aXR1ZGUpO1xyXG5cclxuICAgIHJldHVybiBuZXcgUmVjdGFuZ2xlKFxyXG4gICAgICBNYXRoLm1pbiguLi5sb25naXR1ZGVzKSxcclxuICAgICAgTWF0aC5taW4oLi4ubGF0aXR1ZGVzKSxcclxuICAgICAgTWF0aC5tYXgoLi4ubG9uZ2l0dWRlcyksXHJcbiAgICAgIE1hdGgubWF4KC4uLmxhdGl0dWRlcylcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBnZXRSZWN0YW5nbGVDYWxsYmFja1Byb3BlcnR5KCk6IENhbGxiYWNrUHJvcGVydHkge1xyXG4gICAgcmV0dXJuIG5ldyBDYWxsYmFja1Byb3BlcnR5KHRoaXMuZ2V0UmVjdGFuZ2xlLmJpbmQodGhpcyksIGZhbHNlKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgcmVtb3ZlUG9zaXRpb24ocG9pbnQ6IEVkaXRQb2ludCkge1xyXG4gICAgY29uc3QgaW5kZXggPSB0aGlzLnBvc2l0aW9ucy5maW5kSW5kZXgocCA9PiBwID09PSBwb2ludCk7XHJcbiAgICBpZiAoaW5kZXggPCAwKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIHRoaXMucG9zaXRpb25zLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICB0aGlzLnBvaW50c0xheWVyLnJlbW92ZShwb2ludC5nZXRJZCgpKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgdXBkYXRlUG9pbnRzTGF5ZXIoLi4ucG9pbnQ6IEVkaXRQb2ludFtdKSB7XHJcbiAgICBwb2ludC5mb3JFYWNoKHAgPT4gdGhpcy5wb2ludHNMYXllci51cGRhdGUocCwgcC5nZXRJZCgpKSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHVwZGF0ZVJlY3RhbmdsZUxheWVyKCkge1xyXG4gICAgdGhpcy5yZWN0YW5nbGVMYXllci51cGRhdGUodGhpcywgdGhpcy5pZCk7XHJcbiAgfVxyXG5cclxuICBkaXNwb3NlKCkge1xyXG4gICAgdGhpcy5yZWN0YW5nbGVMYXllci5yZW1vdmUodGhpcy5pZCk7XHJcblxyXG4gICAgdGhpcy5wb3NpdGlvbnMuZm9yRWFjaChlZGl0UG9pbnQgPT4ge1xyXG4gICAgICB0aGlzLnBvaW50c0xheWVyLnJlbW92ZShlZGl0UG9pbnQuZ2V0SWQoKSk7XHJcbiAgICB9KTtcclxuICAgIGlmICh0aGlzLm1vdmluZ1BvaW50KSB7XHJcbiAgICAgIHRoaXMucG9pbnRzTGF5ZXIucmVtb3ZlKHRoaXMubW92aW5nUG9pbnQuZ2V0SWQoKSk7XHJcbiAgICAgIHRoaXMubW92aW5nUG9pbnQgPSB1bmRlZmluZWQ7XHJcbiAgICB9XHJcbiAgICB0aGlzLnBvc2l0aW9ucy5sZW5ndGggPSAwO1xyXG4gIH1cclxuXHJcbiAgZ2V0UG9pbnRzQ291bnQoKTogbnVtYmVyIHtcclxuICAgIHJldHVybiB0aGlzLnBvc2l0aW9ucy5sZW5ndGg7XHJcbiAgfVxyXG5cclxuICBnZXRJZCgpIHtcclxuICAgIHJldHVybiB0aGlzLmlkO1xyXG4gIH1cclxufVxyXG5cclxuIl19