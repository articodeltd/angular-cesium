import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularCesiumModule } from '../angular-cesium/angular-cesium.module';
import { PointsEditorComponent } from './components/points-editor/points-editor.component';
import { PolygonsEditorComponent } from './components/polygons-editor/polygons-editor.component';
import { CirclesEditorComponent } from './components/circles-editor/circles-editor.component';
import { EllipsesEditorComponent } from './components/ellipses-editor/ellipses-editor.component';
import { PolylinesEditorComponent } from './components/polylines-editor/polylines-editor.component';
import { HippodromeEditorComponent } from './components/hippodrome-editor/hippodrome-editor.component';
import { DraggableToMapDirective } from './directives/draggable-to-map.directive';
import { DraggableToMapService } from './services/draggable-to-map.service';
import { AcToolbarComponent } from './components/toolbar/ac-toolbar/ac-toolbar.component';
import { DragIconComponent } from './components/toolbar/ac-toolbar/drag-icon.component';
import { AcToolbarButtonComponent } from './components/toolbar/ac-toolbar-button/ac-toolbar-button.component';
import { RangeAndBearingComponent } from './components/range-and-bearing/range-and-bearing.component';
import { ZoomToRectangleService } from './services/zoom-to-rectangle.service';
import { RectanglesEditorComponent } from './components/rectangles-editor/rectangles-editor.component';
import * as i0 from "@angular/core";
export class AngularCesiumWidgetsModule {
}
AngularCesiumWidgetsModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AngularCesiumWidgetsModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
AngularCesiumWidgetsModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AngularCesiumWidgetsModule, declarations: [PointsEditorComponent,
        HippodromeEditorComponent,
        PolygonsEditorComponent,
        RectanglesEditorComponent,
        CirclesEditorComponent,
        EllipsesEditorComponent,
        PolylinesEditorComponent,
        DraggableToMapDirective,
        DragIconComponent,
        AcToolbarComponent,
        AcToolbarButtonComponent,
        RangeAndBearingComponent], imports: [CommonModule, AngularCesiumModule], exports: [PointsEditorComponent,
        HippodromeEditorComponent,
        PolygonsEditorComponent,
        RectanglesEditorComponent,
        CirclesEditorComponent,
        EllipsesEditorComponent,
        PolylinesEditorComponent,
        DraggableToMapDirective,
        AcToolbarComponent,
        AcToolbarButtonComponent,
        RangeAndBearingComponent] });
AngularCesiumWidgetsModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AngularCesiumWidgetsModule, providers: [
        DraggableToMapService,
        ZoomToRectangleService,
    ], imports: [[CommonModule, AngularCesiumModule]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AngularCesiumWidgetsModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, AngularCesiumModule],
                    declarations: [
                        PointsEditorComponent,
                        HippodromeEditorComponent,
                        PolygonsEditorComponent,
                        RectanglesEditorComponent,
                        CirclesEditorComponent,
                        EllipsesEditorComponent,
                        PolylinesEditorComponent,
                        DraggableToMapDirective,
                        DragIconComponent,
                        AcToolbarComponent,
                        AcToolbarButtonComponent,
                        RangeAndBearingComponent,
                    ],
                    exports: [
                        PointsEditorComponent,
                        HippodromeEditorComponent,
                        PolygonsEditorComponent,
                        RectanglesEditorComponent,
                        CirclesEditorComponent,
                        EllipsesEditorComponent,
                        PolylinesEditorComponent,
                        DraggableToMapDirective,
                        AcToolbarComponent,
                        AcToolbarButtonComponent,
                        RangeAndBearingComponent,
                    ],
                    providers: [
                        DraggableToMapService,
                        ZoomToRectangleService,
                    ]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhci1jZXNpdW0td2lkZ2V0cy5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGliL2FuZ3VsYXItY2VzaXVtLXdpZGdldHMvYW5ndWxhci1jZXNpdW0td2lkZ2V0cy5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0seUNBQXlDLENBQUM7QUFDOUUsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sb0RBQW9ELENBQUM7QUFDM0YsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sd0RBQXdELENBQUM7QUFDakcsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sc0RBQXNELENBQUM7QUFDOUYsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sd0RBQXdELENBQUM7QUFDakcsT0FBTyxFQUFFLHdCQUF3QixFQUFFLE1BQU0sMERBQTBELENBQUM7QUFDcEcsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0sNERBQTRELENBQUM7QUFDdkcsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0seUNBQXlDLENBQUM7QUFDbEYsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0scUNBQXFDLENBQUM7QUFDNUUsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sc0RBQXNELENBQUM7QUFDMUYsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0scURBQXFELENBQUM7QUFDeEYsT0FBTyxFQUFFLHdCQUF3QixFQUFFLE1BQU0sb0VBQW9FLENBQUM7QUFDOUcsT0FBTyxFQUFFLHdCQUF3QixFQUFFLE1BQU0sNERBQTRELENBQUM7QUFDdEcsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sc0NBQXNDLENBQUM7QUFDOUUsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0sNERBQTRELENBQUM7O0FBb0N2RyxNQUFNLE9BQU8sMEJBQTBCOzt1SEFBMUIsMEJBQTBCO3dIQUExQiwwQkFBMEIsaUJBL0JuQyxxQkFBcUI7UUFDckIseUJBQXlCO1FBQ3pCLHVCQUF1QjtRQUN2Qix5QkFBeUI7UUFDekIsc0JBQXNCO1FBQ3RCLHVCQUF1QjtRQUN2Qix3QkFBd0I7UUFDeEIsdUJBQXVCO1FBQ3ZCLGlCQUFpQjtRQUNqQixrQkFBa0I7UUFDbEIsd0JBQXdCO1FBQ3hCLHdCQUF3QixhQWJoQixZQUFZLEVBQUUsbUJBQW1CLGFBZ0J6QyxxQkFBcUI7UUFDckIseUJBQXlCO1FBQ3pCLHVCQUF1QjtRQUN2Qix5QkFBeUI7UUFDekIsc0JBQXNCO1FBQ3RCLHVCQUF1QjtRQUN2Qix3QkFBd0I7UUFDeEIsdUJBQXVCO1FBQ3ZCLGtCQUFrQjtRQUNsQix3QkFBd0I7UUFDeEIsd0JBQXdCO3dIQU9mLDBCQUEwQixhQUwxQjtRQUNULHFCQUFxQjtRQUNyQixzQkFBc0I7S0FDdkIsWUEvQlEsQ0FBQyxZQUFZLEVBQUUsbUJBQW1CLENBQUM7MkZBaUNqQywwQkFBMEI7a0JBbEN0QyxRQUFRO21CQUFDO29CQUNSLE9BQU8sRUFBRSxDQUFDLFlBQVksRUFBRSxtQkFBbUIsQ0FBQztvQkFDNUMsWUFBWSxFQUFFO3dCQUNaLHFCQUFxQjt3QkFDckIseUJBQXlCO3dCQUN6Qix1QkFBdUI7d0JBQ3ZCLHlCQUF5Qjt3QkFDekIsc0JBQXNCO3dCQUN0Qix1QkFBdUI7d0JBQ3ZCLHdCQUF3Qjt3QkFDeEIsdUJBQXVCO3dCQUN2QixpQkFBaUI7d0JBQ2pCLGtCQUFrQjt3QkFDbEIsd0JBQXdCO3dCQUN4Qix3QkFBd0I7cUJBQ3pCO29CQUNELE9BQU8sRUFBRTt3QkFDUCxxQkFBcUI7d0JBQ3JCLHlCQUF5Qjt3QkFDekIsdUJBQXVCO3dCQUN2Qix5QkFBeUI7d0JBQ3pCLHNCQUFzQjt3QkFDdEIsdUJBQXVCO3dCQUN2Qix3QkFBd0I7d0JBQ3hCLHVCQUF1Qjt3QkFDdkIsa0JBQWtCO3dCQUNsQix3QkFBd0I7d0JBQ3hCLHdCQUF3QjtxQkFDekI7b0JBQ0QsU0FBUyxFQUFFO3dCQUNULHFCQUFxQjt3QkFDckIsc0JBQXNCO3FCQUN2QjtpQkFDRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XHJcbmltcG9ydCB7IEFuZ3VsYXJDZXNpdW1Nb2R1bGUgfSBmcm9tICcuLi9hbmd1bGFyLWNlc2l1bS9hbmd1bGFyLWNlc2l1bS5tb2R1bGUnO1xyXG5pbXBvcnQgeyBQb2ludHNFZGl0b3JDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvcG9pbnRzLWVkaXRvci9wb2ludHMtZWRpdG9yLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IFBvbHlnb25zRWRpdG9yQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL3BvbHlnb25zLWVkaXRvci9wb2x5Z29ucy1lZGl0b3IuY29tcG9uZW50JztcclxuaW1wb3J0IHsgQ2lyY2xlc0VkaXRvckNvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9jaXJjbGVzLWVkaXRvci9jaXJjbGVzLWVkaXRvci5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBFbGxpcHNlc0VkaXRvckNvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9lbGxpcHNlcy1lZGl0b3IvZWxsaXBzZXMtZWRpdG9yLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IFBvbHlsaW5lc0VkaXRvckNvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9wb2x5bGluZXMtZWRpdG9yL3BvbHlsaW5lcy1lZGl0b3IuY29tcG9uZW50JztcclxuaW1wb3J0IHsgSGlwcG9kcm9tZUVkaXRvckNvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9oaXBwb2Ryb21lLWVkaXRvci9oaXBwb2Ryb21lLWVkaXRvci5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBEcmFnZ2FibGVUb01hcERpcmVjdGl2ZSB9IGZyb20gJy4vZGlyZWN0aXZlcy9kcmFnZ2FibGUtdG8tbWFwLmRpcmVjdGl2ZSc7XHJcbmltcG9ydCB7IERyYWdnYWJsZVRvTWFwU2VydmljZSB9IGZyb20gJy4vc2VydmljZXMvZHJhZ2dhYmxlLXRvLW1hcC5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQWNUb29sYmFyQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL3Rvb2xiYXIvYWMtdG9vbGJhci9hYy10b29sYmFyLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IERyYWdJY29uQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL3Rvb2xiYXIvYWMtdG9vbGJhci9kcmFnLWljb24uY29tcG9uZW50JztcclxuaW1wb3J0IHsgQWNUb29sYmFyQnV0dG9uQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL3Rvb2xiYXIvYWMtdG9vbGJhci1idXR0b24vYWMtdG9vbGJhci1idXR0b24uY29tcG9uZW50JztcclxuaW1wb3J0IHsgUmFuZ2VBbmRCZWFyaW5nQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL3JhbmdlLWFuZC1iZWFyaW5nL3JhbmdlLWFuZC1iZWFyaW5nLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IFpvb21Ub1JlY3RhbmdsZVNlcnZpY2UgfSBmcm9tICcuL3NlcnZpY2VzL3pvb20tdG8tcmVjdGFuZ2xlLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBSZWN0YW5nbGVzRWRpdG9yQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL3JlY3RhbmdsZXMtZWRpdG9yL3JlY3RhbmdsZXMtZWRpdG9yLmNvbXBvbmVudCc7XHJcblxyXG5ATmdNb2R1bGUoe1xyXG4gIGltcG9ydHM6IFtDb21tb25Nb2R1bGUsIEFuZ3VsYXJDZXNpdW1Nb2R1bGVdLFxyXG4gIGRlY2xhcmF0aW9uczogW1xyXG4gICAgUG9pbnRzRWRpdG9yQ29tcG9uZW50LFxyXG4gICAgSGlwcG9kcm9tZUVkaXRvckNvbXBvbmVudCxcclxuICAgIFBvbHlnb25zRWRpdG9yQ29tcG9uZW50LFxyXG4gICAgUmVjdGFuZ2xlc0VkaXRvckNvbXBvbmVudCxcclxuICAgIENpcmNsZXNFZGl0b3JDb21wb25lbnQsXHJcbiAgICBFbGxpcHNlc0VkaXRvckNvbXBvbmVudCxcclxuICAgIFBvbHlsaW5lc0VkaXRvckNvbXBvbmVudCxcclxuICAgIERyYWdnYWJsZVRvTWFwRGlyZWN0aXZlLFxyXG4gICAgRHJhZ0ljb25Db21wb25lbnQsXHJcbiAgICBBY1Rvb2xiYXJDb21wb25lbnQsXHJcbiAgICBBY1Rvb2xiYXJCdXR0b25Db21wb25lbnQsXHJcbiAgICBSYW5nZUFuZEJlYXJpbmdDb21wb25lbnQsXHJcbiAgXSxcclxuICBleHBvcnRzOiBbXHJcbiAgICBQb2ludHNFZGl0b3JDb21wb25lbnQsXHJcbiAgICBIaXBwb2Ryb21lRWRpdG9yQ29tcG9uZW50LFxyXG4gICAgUG9seWdvbnNFZGl0b3JDb21wb25lbnQsXHJcbiAgICBSZWN0YW5nbGVzRWRpdG9yQ29tcG9uZW50LFxyXG4gICAgQ2lyY2xlc0VkaXRvckNvbXBvbmVudCxcclxuICAgIEVsbGlwc2VzRWRpdG9yQ29tcG9uZW50LFxyXG4gICAgUG9seWxpbmVzRWRpdG9yQ29tcG9uZW50LFxyXG4gICAgRHJhZ2dhYmxlVG9NYXBEaXJlY3RpdmUsXHJcbiAgICBBY1Rvb2xiYXJDb21wb25lbnQsXHJcbiAgICBBY1Rvb2xiYXJCdXR0b25Db21wb25lbnQsXHJcbiAgICBSYW5nZUFuZEJlYXJpbmdDb21wb25lbnQsXHJcbiAgXSxcclxuICBwcm92aWRlcnM6IFtcclxuICAgIERyYWdnYWJsZVRvTWFwU2VydmljZSxcclxuICAgIFpvb21Ub1JlY3RhbmdsZVNlcnZpY2UsXHJcbiAgXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgQW5ndWxhckNlc2l1bVdpZGdldHNNb2R1bGUge1xyXG59XHJcbiJdfQ==