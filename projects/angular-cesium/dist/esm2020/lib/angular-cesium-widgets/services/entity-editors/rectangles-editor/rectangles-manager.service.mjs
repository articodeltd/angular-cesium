import { Injectable } from '@angular/core';
import { EditableRectangle } from '../../../models/editable-rectangle';
import * as i0 from "@angular/core";
export class RectanglesManagerService {
    constructor() {
        this.rectangles = new Map();
    }
    createEditableRectangle(id, editRectanglesLayer, editPointsLayer, coordinateConverter, rectangleOptions, positions) {
        const editableRectangle = new EditableRectangle(id, editPointsLayer, editRectanglesLayer, coordinateConverter, rectangleOptions, positions);
        this.rectangles.set(id, editableRectangle);
    }
    dispose(id) {
        this.rectangles.get(id).dispose();
        this.rectangles.delete(id);
    }
    get(id) {
        return this.rectangles.get(id);
    }
    clear() {
        this.rectangles.forEach(rectangle => rectangle.dispose());
        this.rectangles.clear();
    }
}
RectanglesManagerService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: RectanglesManagerService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
RectanglesManagerService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: RectanglesManagerService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: RectanglesManagerService, decorators: [{
            type: Injectable
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVjdGFuZ2xlcy1tYW5hZ2VyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbGliL2FuZ3VsYXItY2VzaXVtLXdpZGdldHMvc2VydmljZXMvZW50aXR5LWVkaXRvcnMvcmVjdGFuZ2xlcy1lZGl0b3IvcmVjdGFuZ2xlcy1tYW5hZ2VyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUUzQyxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxvQ0FBb0MsQ0FBQzs7QUFNdkUsTUFBTSxPQUFPLHdCQUF3QjtJQURyQztRQUVFLGVBQVUsR0FBbUMsSUFBSSxHQUFHLEVBQTZCLENBQUM7S0FtQ25GO0lBakNDLHVCQUF1QixDQUNyQixFQUFVLEVBQ1YsbUJBQXFDLEVBQ3JDLGVBQWlDLEVBQ2pDLG1CQUF3QyxFQUN4QyxnQkFBdUMsRUFDdkMsU0FBd0I7UUFFeEIsTUFBTSxpQkFBaUIsR0FBRyxJQUFJLGlCQUFpQixDQUM3QyxFQUFFLEVBQ0YsZUFBZSxFQUNmLG1CQUFtQixFQUNuQixtQkFBbUIsRUFDbkIsZ0JBQWdCLEVBQ2hCLFNBQVMsQ0FDVixDQUFDO1FBRUYsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLGlCQUFpQixDQUFDLENBQUM7SUFDN0MsQ0FBQztJQUVELE9BQU8sQ0FBQyxFQUFVO1FBQ2hCLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ2xDLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFFRCxHQUFHLENBQUMsRUFBVTtRQUNaLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDakMsQ0FBQztJQUVELEtBQUs7UUFDSCxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO1FBQzFELElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDMUIsQ0FBQzs7cUhBbkNVLHdCQUF3Qjt5SEFBeEIsd0JBQXdCOzJGQUF4Qix3QkFBd0I7a0JBRHBDLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IENhcnRlc2lhbjMgfSBmcm9tICdjZXNpdW0nO1xyXG5pbXBvcnQgeyBFZGl0YWJsZVJlY3RhbmdsZSB9IGZyb20gJy4uLy4uLy4uL21vZGVscy9lZGl0YWJsZS1yZWN0YW5nbGUnO1xyXG5pbXBvcnQgeyBSZWN0YW5nbGVFZGl0T3B0aW9ucyB9IGZyb20gJy4uLy4uLy4uL21vZGVscy9yZWN0YW5nbGUtZWRpdC1vcHRpb25zJztcclxuaW1wb3J0IHsgQWNMYXllckNvbXBvbmVudCB9IGZyb20gJy4uLy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL2NvbXBvbmVudHMvYWMtbGF5ZXIvYWMtbGF5ZXIuY29tcG9uZW50JztcclxuaW1wb3J0IHsgQ29vcmRpbmF0ZUNvbnZlcnRlciB9IGZyb20gJy4uLy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2Nvb3JkaW5hdGUtY29udmVydGVyL2Nvb3JkaW5hdGUtY29udmVydGVyLnNlcnZpY2UnO1xyXG5cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgUmVjdGFuZ2xlc01hbmFnZXJTZXJ2aWNlIHtcclxuICByZWN0YW5nbGVzOiBNYXA8c3RyaW5nLCBFZGl0YWJsZVJlY3RhbmdsZT4gPSBuZXcgTWFwPHN0cmluZywgRWRpdGFibGVSZWN0YW5nbGU+KCk7XHJcblxyXG4gIGNyZWF0ZUVkaXRhYmxlUmVjdGFuZ2xlKFxyXG4gICAgaWQ6IHN0cmluZyxcclxuICAgIGVkaXRSZWN0YW5nbGVzTGF5ZXI6IEFjTGF5ZXJDb21wb25lbnQsXHJcbiAgICBlZGl0UG9pbnRzTGF5ZXI6IEFjTGF5ZXJDb21wb25lbnQsXHJcbiAgICBjb29yZGluYXRlQ29udmVydGVyOiBDb29yZGluYXRlQ29udmVydGVyLFxyXG4gICAgcmVjdGFuZ2xlT3B0aW9ucz86IFJlY3RhbmdsZUVkaXRPcHRpb25zLFxyXG4gICAgcG9zaXRpb25zPzogQ2FydGVzaWFuM1tdXHJcbiAgKSB7XHJcbiAgICBjb25zdCBlZGl0YWJsZVJlY3RhbmdsZSA9IG5ldyBFZGl0YWJsZVJlY3RhbmdsZShcclxuICAgICAgaWQsXHJcbiAgICAgIGVkaXRQb2ludHNMYXllcixcclxuICAgICAgZWRpdFJlY3RhbmdsZXNMYXllcixcclxuICAgICAgY29vcmRpbmF0ZUNvbnZlcnRlcixcclxuICAgICAgcmVjdGFuZ2xlT3B0aW9ucyxcclxuICAgICAgcG9zaXRpb25zXHJcbiAgICApO1xyXG5cclxuICAgIHRoaXMucmVjdGFuZ2xlcy5zZXQoaWQsIGVkaXRhYmxlUmVjdGFuZ2xlKTtcclxuICB9XHJcblxyXG4gIGRpc3Bvc2UoaWQ6IHN0cmluZykge1xyXG4gICAgdGhpcy5yZWN0YW5nbGVzLmdldChpZCkuZGlzcG9zZSgpO1xyXG4gICAgdGhpcy5yZWN0YW5nbGVzLmRlbGV0ZShpZCk7XHJcbiAgfVxyXG5cclxuICBnZXQoaWQ6IHN0cmluZyk6IEVkaXRhYmxlUmVjdGFuZ2xlIHtcclxuICAgIHJldHVybiB0aGlzLnJlY3RhbmdsZXMuZ2V0KGlkKTtcclxuICB9XHJcblxyXG4gIGNsZWFyKCkge1xyXG4gICAgdGhpcy5yZWN0YW5nbGVzLmZvckVhY2gocmVjdGFuZ2xlID0+IHJlY3RhbmdsZS5kaXNwb3NlKCkpO1xyXG4gICAgdGhpcy5yZWN0YW5nbGVzLmNsZWFyKCk7XHJcbiAgfVxyXG59XHJcblxyXG4iXX0=