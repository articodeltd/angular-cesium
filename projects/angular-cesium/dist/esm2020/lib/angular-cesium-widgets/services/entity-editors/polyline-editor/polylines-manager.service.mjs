import { Injectable } from '@angular/core';
import { EditablePolyline } from '../../../models/editable-polyline';
import * as i0 from "@angular/core";
export class PolylinesManagerService {
    constructor() {
        this.polylines = new Map();
    }
    createEditablePolyline(id, editPolylinesLayer, editPointsLayer, coordinateConverter, polylineOptions, positions) {
        const editablePolyline = new EditablePolyline(id, editPolylinesLayer, editPointsLayer, coordinateConverter, polylineOptions, positions);
        this.polylines.set(id, editablePolyline);
    }
    get(id) {
        return this.polylines.get(id);
    }
    clear() {
        this.polylines.forEach(polyline => polyline.dispose());
        this.polylines.clear();
    }
}
PolylinesManagerService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: PolylinesManagerService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
PolylinesManagerService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: PolylinesManagerService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: PolylinesManagerService, decorators: [{
            type: Injectable
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9seWxpbmVzLW1hbmFnZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9saWIvYW5ndWxhci1jZXNpdW0td2lkZ2V0cy9zZXJ2aWNlcy9lbnRpdHktZWRpdG9ycy9wb2x5bGluZS1lZGl0b3IvcG9seWxpbmVzLW1hbmFnZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFHQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTNDLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLG1DQUFtQyxDQUFDOztBQUdyRSxNQUFNLE9BQU8sdUJBQXVCO0lBRHBDO1FBRUUsY0FBUyxHQUFrQyxJQUFJLEdBQUcsRUFBNEIsQ0FBQztLQXVCaEY7SUFyQkMsc0JBQXNCLENBQUMsRUFBVSxFQUFFLGtCQUFvQyxFQUFFLGVBQWlDLEVBQ25GLG1CQUF3QyxFQUFFLGVBQW9DLEVBQUUsU0FBd0I7UUFDN0gsTUFBTSxnQkFBZ0IsR0FBRyxJQUFJLGdCQUFnQixDQUMzQyxFQUFFLEVBQ0Ysa0JBQWtCLEVBQ2xCLGVBQWUsRUFDZixtQkFBbUIsRUFDbkIsZUFBZSxFQUNmLFNBQVMsQ0FBQyxDQUFDO1FBQ2IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLGdCQUFnQixDQUN0QyxDQUFDO0lBQ0osQ0FBQztJQUVELEdBQUcsQ0FBQyxFQUFVO1FBQ1osT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNoQyxDQUFDO0lBRUQsS0FBSztRQUNILElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7UUFDdkQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUN6QixDQUFDOztvSEF2QlUsdUJBQXVCO3dIQUF2Qix1QkFBdUI7MkZBQXZCLHVCQUF1QjtrQkFEbkMsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENhcnRlc2lhbjMgfSBmcm9tICdjZXNpdW0nO1xyXG5pbXBvcnQgeyBDb29yZGluYXRlQ29udmVydGVyIH0gZnJvbSAnLi8uLi8uLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9jb29yZGluYXRlLWNvbnZlcnRlci9jb29yZGluYXRlLWNvbnZlcnRlci5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQWNMYXllckNvbXBvbmVudCB9IGZyb20gJy4vLi4vLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vY29tcG9uZW50cy9hYy1sYXllci9hYy1sYXllci5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IFBvbHlnb25FZGl0T3B0aW9ucyB9IGZyb20gJy4uLy4uLy4uL21vZGVscy9wb2x5Z29uLWVkaXQtb3B0aW9ucyc7XHJcbmltcG9ydCB7IEVkaXRhYmxlUG9seWxpbmUgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvZWRpdGFibGUtcG9seWxpbmUnO1xyXG5cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgUG9seWxpbmVzTWFuYWdlclNlcnZpY2Uge1xyXG4gIHBvbHlsaW5lczogTWFwPHN0cmluZywgRWRpdGFibGVQb2x5bGluZT4gPSBuZXcgTWFwPHN0cmluZywgRWRpdGFibGVQb2x5bGluZT4oKTtcclxuXHJcbiAgY3JlYXRlRWRpdGFibGVQb2x5bGluZShpZDogc3RyaW5nLCBlZGl0UG9seWxpbmVzTGF5ZXI6IEFjTGF5ZXJDb21wb25lbnQsIGVkaXRQb2ludHNMYXllcjogQWNMYXllckNvbXBvbmVudCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgIGNvb3JkaW5hdGVDb252ZXJ0ZXI6IENvb3JkaW5hdGVDb252ZXJ0ZXIsIHBvbHlsaW5lT3B0aW9ucz86IFBvbHlnb25FZGl0T3B0aW9ucywgcG9zaXRpb25zPzogQ2FydGVzaWFuM1tdKSB7XHJcbiAgICBjb25zdCBlZGl0YWJsZVBvbHlsaW5lID0gbmV3IEVkaXRhYmxlUG9seWxpbmUoXHJcbiAgICAgIGlkLFxyXG4gICAgICBlZGl0UG9seWxpbmVzTGF5ZXIsXHJcbiAgICAgIGVkaXRQb2ludHNMYXllcixcclxuICAgICAgY29vcmRpbmF0ZUNvbnZlcnRlcixcclxuICAgICAgcG9seWxpbmVPcHRpb25zLFxyXG4gICAgICBwb3NpdGlvbnMpO1xyXG4gICAgdGhpcy5wb2x5bGluZXMuc2V0KGlkLCBlZGl0YWJsZVBvbHlsaW5lXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgZ2V0KGlkOiBzdHJpbmcpOiBFZGl0YWJsZVBvbHlsaW5lIHtcclxuICAgIHJldHVybiB0aGlzLnBvbHlsaW5lcy5nZXQoaWQpO1xyXG4gIH1cclxuXHJcbiAgY2xlYXIoKSB7XHJcbiAgICB0aGlzLnBvbHlsaW5lcy5mb3JFYWNoKHBvbHlsaW5lID0+IHBvbHlsaW5lLmRpc3Bvc2UoKSk7XHJcbiAgICB0aGlzLnBvbHlsaW5lcy5jbGVhcigpO1xyXG4gIH1cclxufVxyXG4iXX0=