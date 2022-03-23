import { Injectable } from '@angular/core';
import { EditableCircle } from '../../../models/editable-circle';
import * as i0 from "@angular/core";
export class CirclesManagerService {
    constructor() {
        this.circles = new Map();
    }
    createEditableCircle(id, editCirclesLayer, editPointsLayer, editArcsLayer, circleOptions) {
        const editableCircle = new EditableCircle(id, editCirclesLayer, editPointsLayer, editArcsLayer, circleOptions);
        this.circles.set(id, editableCircle);
        return editableCircle;
    }
    dispose(id) {
        const circle = this.circles.get(id);
        if (circle) {
            circle.dispose();
        }
        this.circles.delete(id);
    }
    get(id) {
        return this.circles.get(id);
    }
    clear() {
        this.circles.forEach(circle => circle.dispose());
        this.circles.clear();
    }
}
CirclesManagerService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CirclesManagerService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
CirclesManagerService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CirclesManagerService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CirclesManagerService, decorators: [{
            type: Injectable
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2lyY2xlcy1tYW5hZ2VyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbGliL2FuZ3VsYXItY2VzaXVtLXdpZGdldHMvc2VydmljZXMvZW50aXR5LWVkaXRvcnMvY2lyY2xlcy1lZGl0b3IvY2lyY2xlcy1tYW5hZ2VyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0saUNBQWlDLENBQUM7O0FBS2pFLE1BQU0sT0FBTyxxQkFBcUI7SUFEbEM7UUFFVSxZQUFPLEdBQUcsSUFBSSxHQUFHLEVBQTBCLENBQUM7S0E0QnJEO0lBMUJDLG9CQUFvQixDQUFDLEVBQVUsRUFDVixnQkFBa0MsRUFDbEMsZUFBaUMsRUFDakMsYUFBK0IsRUFDL0IsYUFBZ0M7UUFDbkQsTUFBTSxjQUFjLEdBQUcsSUFBSSxjQUFjLENBQUMsRUFBRSxFQUFFLGdCQUFnQixFQUFFLGVBQWUsRUFBRSxhQUFhLEVBQUUsYUFBYSxDQUFDLENBQUM7UUFDL0csSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLGNBQWMsQ0FBQyxDQUFDO1FBQ3JDLE9BQU8sY0FBYyxDQUFDO0lBQ3hCLENBQUM7SUFFRCxPQUFPLENBQUMsRUFBVTtRQUNoQixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNwQyxJQUFJLE1BQU0sRUFBRTtZQUNWLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztTQUNsQjtRQUNELElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzFCLENBQUM7SUFFRCxHQUFHLENBQUMsRUFBVTtRQUNaLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDOUIsQ0FBQztJQUVELEtBQUs7UUFDSCxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO1FBQ2pELElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDdkIsQ0FBQzs7a0hBNUJVLHFCQUFxQjtzSEFBckIscUJBQXFCOzJGQUFyQixxQkFBcUI7a0JBRGpDLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEVkaXRhYmxlQ2lyY2xlIH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL2VkaXRhYmxlLWNpcmNsZSc7XHJcbmltcG9ydCB7IEFjTGF5ZXJDb21wb25lbnQgfSBmcm9tICcuLi8uLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9jb21wb25lbnRzL2FjLWxheWVyL2FjLWxheWVyLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IENpcmNsZUVkaXRPcHRpb25zIH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL2NpcmNsZS1lZGl0LW9wdGlvbnMnO1xyXG5cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgQ2lyY2xlc01hbmFnZXJTZXJ2aWNlIHtcclxuICBwcml2YXRlIGNpcmNsZXMgPSBuZXcgTWFwPHN0cmluZywgRWRpdGFibGVDaXJjbGU+KCk7XHJcblxyXG4gIGNyZWF0ZUVkaXRhYmxlQ2lyY2xlKGlkOiBzdHJpbmcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgZWRpdENpcmNsZXNMYXllcjogQWNMYXllckNvbXBvbmVudCxcclxuICAgICAgICAgICAgICAgICAgICAgICBlZGl0UG9pbnRzTGF5ZXI6IEFjTGF5ZXJDb21wb25lbnQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgZWRpdEFyY3NMYXllcjogQWNMYXllckNvbXBvbmVudCxcclxuICAgICAgICAgICAgICAgICAgICAgICBjaXJjbGVPcHRpb25zOiBDaXJjbGVFZGl0T3B0aW9ucyk6IEVkaXRhYmxlQ2lyY2xlIHtcclxuICAgIGNvbnN0IGVkaXRhYmxlQ2lyY2xlID0gbmV3IEVkaXRhYmxlQ2lyY2xlKGlkLCBlZGl0Q2lyY2xlc0xheWVyLCBlZGl0UG9pbnRzTGF5ZXIsIGVkaXRBcmNzTGF5ZXIsIGNpcmNsZU9wdGlvbnMpO1xyXG4gICAgdGhpcy5jaXJjbGVzLnNldChpZCwgZWRpdGFibGVDaXJjbGUpO1xyXG4gICAgcmV0dXJuIGVkaXRhYmxlQ2lyY2xlO1xyXG4gIH1cclxuXHJcbiAgZGlzcG9zZShpZDogc3RyaW5nKSB7XHJcbiAgICBjb25zdCBjaXJjbGUgPSB0aGlzLmNpcmNsZXMuZ2V0KGlkKTtcclxuICAgIGlmIChjaXJjbGUpIHtcclxuICAgICAgY2lyY2xlLmRpc3Bvc2UoKTtcclxuICAgIH1cclxuICAgIHRoaXMuY2lyY2xlcy5kZWxldGUoaWQpO1xyXG4gIH1cclxuXHJcbiAgZ2V0KGlkOiBzdHJpbmcpOiBFZGl0YWJsZUNpcmNsZSB7XHJcbiAgICByZXR1cm4gdGhpcy5jaXJjbGVzLmdldChpZCk7XHJcbiAgfVxyXG5cclxuICBjbGVhcigpIHtcclxuICAgIHRoaXMuY2lyY2xlcy5mb3JFYWNoKGNpcmNsZSA9PiBjaXJjbGUuZGlzcG9zZSgpKTtcclxuICAgIHRoaXMuY2lyY2xlcy5jbGVhcigpO1xyXG4gIH1cclxufVxyXG4iXX0=