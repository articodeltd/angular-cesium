import { Component } from '@angular/core';
import { BasicDesc } from '../../services/basic-desc/basic-desc.service';
import * as i0 from "@angular/core";
import * as i1 from "../../services/drawers/czml-drawer/czml-drawer.service";
import * as i2 from "../../services/layer-service/layer-service.service";
import * as i3 from "../../services/computation-cache/computation-cache.service";
import * as i4 from "../../services/cesium-properties/cesium-properties.service";
/**
 *  This is a czml implementation.
 *  The ac-czml-desc element must be a child of ac-layer element.
 *
 *  See CZML Guide for the structure of props.czmlPacket:
 *  + https://github.com/AnalyticalGraphicsInc/czml-writer/wiki/CZML-Structure
 *
 *  Attention: the first czmlPacket in the stream needs to be a document
 *  with an id and a name attribute. See this example
 *  + https://cesiumjs.org/Cesium/Apps/Sandcastle/index.html?src=CZML%20Point%20-%20Time%20Dynamic.html&label=CZML
 *
 *  To see a working example, use the demo app and
 *  + uncomment <czml-layer></czml-layer> in demo-map.component.html
 *  + set the properties 'timeline', 'animation' and 'shouldAnimate' true in viewerOptions of demo-map.component.ts
 *
 *
 *  __Usage:__
 *  ```
 *    <ac-czml-desc props="{
 *      czmlPacket: czmlPacket
 *    }">
 *    </ac-czml-desc>
 *  ```
 */
export class AcCzmlDescComponent extends BasicDesc {
    constructor(czmlDrawer, layerService, computationCache, cesiumProperties) {
        super(czmlDrawer, layerService, computationCache, cesiumProperties);
    }
}
AcCzmlDescComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcCzmlDescComponent, deps: [{ token: i1.CzmlDrawerService }, { token: i2.LayerService }, { token: i3.ComputationCache }, { token: i4.CesiumProperties }], target: i0.ɵɵFactoryTarget.Component });
AcCzmlDescComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: AcCzmlDescComponent, selector: "ac-czml-desc", usesInheritance: true, ngImport: i0, template: '', isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcCzmlDescComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ac-czml-desc',
                    template: '',
                }]
        }], ctorParameters: function () { return [{ type: i1.CzmlDrawerService }, { type: i2.LayerService }, { type: i3.ComputationCache }, { type: i4.CesiumProperties }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtY3ptbC1kZXNjLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9saWIvYW5ndWxhci1jZXNpdW0vY29tcG9uZW50cy9hYy1jem1sLWRlc2MvYWMtY3ptbC1kZXNjLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFVLE1BQU0sZUFBZSxDQUFDO0FBRWxELE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSw4Q0FBOEMsQ0FBQzs7Ozs7O0FBTXpFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXVCRztBQUtILE1BQU0sT0FBTyxtQkFBb0IsU0FBUSxTQUFTO0lBQ2hELFlBQVksVUFBNkIsRUFBRSxZQUEwQixFQUN6RCxnQkFBa0MsRUFBRSxnQkFBa0M7UUFDaEYsS0FBSyxDQUFDLFVBQVUsRUFBRSxZQUFZLEVBQUUsZ0JBQWdCLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztJQUN0RSxDQUFDOztnSEFKVSxtQkFBbUI7b0dBQW5CLG1CQUFtQiwyRUFGcEIsRUFBRTsyRkFFRCxtQkFBbUI7a0JBSi9CLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLGNBQWM7b0JBQ3hCLFFBQVEsRUFBRSxFQUFFO2lCQUNiIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcbmltcG9ydCB7IEJhc2ljRGVzYyB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2Jhc2ljLWRlc2MvYmFzaWMtZGVzYy5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQ2VzaXVtUHJvcGVydGllcyB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2Nlc2l1bS1wcm9wZXJ0aWVzL2Nlc2l1bS1wcm9wZXJ0aWVzLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBDb21wdXRhdGlvbkNhY2hlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvY29tcHV0YXRpb24tY2FjaGUvY29tcHV0YXRpb24tY2FjaGUuc2VydmljZSc7XHJcbmltcG9ydCB7IEN6bWxEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9jem1sLWRyYXdlci9jem1sLWRyYXdlci5zZXJ2aWNlJztcclxuaW1wb3J0IHsgTGF5ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvbGF5ZXItc2VydmljZS9sYXllci1zZXJ2aWNlLnNlcnZpY2UnO1xyXG5cclxuLyoqXHJcbiAqICBUaGlzIGlzIGEgY3ptbCBpbXBsZW1lbnRhdGlvbi5cclxuICogIFRoZSBhYy1jem1sLWRlc2MgZWxlbWVudCBtdXN0IGJlIGEgY2hpbGQgb2YgYWMtbGF5ZXIgZWxlbWVudC5cclxuICpcclxuICogIFNlZSBDWk1MIEd1aWRlIGZvciB0aGUgc3RydWN0dXJlIG9mIHByb3BzLmN6bWxQYWNrZXQ6XHJcbiAqICArIGh0dHBzOi8vZ2l0aHViLmNvbS9BbmFseXRpY2FsR3JhcGhpY3NJbmMvY3ptbC13cml0ZXIvd2lraS9DWk1MLVN0cnVjdHVyZVxyXG4gKlxyXG4gKiAgQXR0ZW50aW9uOiB0aGUgZmlyc3QgY3ptbFBhY2tldCBpbiB0aGUgc3RyZWFtIG5lZWRzIHRvIGJlIGEgZG9jdW1lbnRcclxuICogIHdpdGggYW4gaWQgYW5kIGEgbmFtZSBhdHRyaWJ1dGUuIFNlZSB0aGlzIGV4YW1wbGVcclxuICogICsgaHR0cHM6Ly9jZXNpdW1qcy5vcmcvQ2VzaXVtL0FwcHMvU2FuZGNhc3RsZS9pbmRleC5odG1sP3NyYz1DWk1MJTIwUG9pbnQlMjAtJTIwVGltZSUyMER5bmFtaWMuaHRtbCZsYWJlbD1DWk1MXHJcbiAqXHJcbiAqICBUbyBzZWUgYSB3b3JraW5nIGV4YW1wbGUsIHVzZSB0aGUgZGVtbyBhcHAgYW5kXHJcbiAqICArIHVuY29tbWVudCA8Y3ptbC1sYXllcj48L2N6bWwtbGF5ZXI+IGluIGRlbW8tbWFwLmNvbXBvbmVudC5odG1sXHJcbiAqICArIHNldCB0aGUgcHJvcGVydGllcyAndGltZWxpbmUnLCAnYW5pbWF0aW9uJyBhbmQgJ3Nob3VsZEFuaW1hdGUnIHRydWUgaW4gdmlld2VyT3B0aW9ucyBvZiBkZW1vLW1hcC5jb21wb25lbnQudHNcclxuICpcclxuICpcclxuICogIF9fVXNhZ2U6X19cclxuICogIGBgYFxyXG4gKiAgICA8YWMtY3ptbC1kZXNjIHByb3BzPVwie1xyXG4gKiAgICAgIGN6bWxQYWNrZXQ6IGN6bWxQYWNrZXRcclxuICogICAgfVwiPlxyXG4gKiAgICA8L2FjLWN6bWwtZGVzYz5cclxuICogIGBgYFxyXG4gKi9cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdhYy1jem1sLWRlc2MnLFxyXG4gIHRlbXBsYXRlOiAnJyxcclxufSlcclxuZXhwb3J0IGNsYXNzIEFjQ3ptbERlc2NDb21wb25lbnQgZXh0ZW5kcyBCYXNpY0Rlc2MgaW1wbGVtZW50cyBPbkluaXQge1xyXG4gIGNvbnN0cnVjdG9yKGN6bWxEcmF3ZXI6IEN6bWxEcmF3ZXJTZXJ2aWNlLCBsYXllclNlcnZpY2U6IExheWVyU2VydmljZSxcclxuICAgICAgICAgICAgICBjb21wdXRhdGlvbkNhY2hlOiBDb21wdXRhdGlvbkNhY2hlLCBjZXNpdW1Qcm9wZXJ0aWVzOiBDZXNpdW1Qcm9wZXJ0aWVzKSB7XHJcbiAgICBzdXBlcihjem1sRHJhd2VyLCBsYXllclNlcnZpY2UsIGNvbXB1dGF0aW9uQ2FjaGUsIGNlc2l1bVByb3BlcnRpZXMpO1xyXG4gIH1cclxuXHJcblxyXG59XHJcbiJdfQ==