import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { fixCesiumEntitiesShadows } from './StaticGeometryColorBatch';
import * as i0 from "@angular/core";
export const ANGULAR_CESIUM_CONFIG = new InjectionToken('ANGULAR_CESIUM_CONFIG');
export class ConfigurationService {
    constructor(config) {
        this.config = config;
        const fixEntitiesShadows = config ? config.fixEntitiesShadows : true;
        if (fixEntitiesShadows !== false) {
            fixCesiumEntitiesShadows();
        }
    }
}
ConfigurationService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: ConfigurationService, deps: [{ token: ANGULAR_CESIUM_CONFIG, optional: true }], target: i0.ɵɵFactoryTarget.Injectable });
ConfigurationService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: ConfigurationService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: ConfigurationService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [ANGULAR_CESIUM_CONFIG]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29uZmlndXJhdGlvblNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbGliL2FuZ3VsYXItY2VzaXVtL2Nlc2l1bS1lbmhhbmNlbWVudHMvQ29uZmlndXJhdGlvblNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsY0FBYyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUM3RSxPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQzs7QUFFdEUsTUFBTSxDQUFDLE1BQU0scUJBQXFCLEdBQUcsSUFBSSxjQUFjLENBQUMsdUJBQXVCLENBQUMsQ0FBQztBQUdqRixNQUFNLE9BQU8sb0JBQW9CO0lBQy9CLFlBQStELE1BQVc7UUFBWCxXQUFNLEdBQU4sTUFBTSxDQUFLO1FBQ3hFLE1BQU0sa0JBQWtCLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztRQUNyRSxJQUFJLGtCQUFrQixLQUFLLEtBQUssRUFBRTtZQUNoQyx3QkFBd0IsRUFBRSxDQUFDO1NBQzVCO0lBQ0gsQ0FBQzs7aUhBTlUsb0JBQW9CLGtCQUNDLHFCQUFxQjtxSEFEMUMsb0JBQW9COzJGQUFwQixvQkFBb0I7a0JBRGhDLFVBQVU7OzBCQUVJLFFBQVE7OzBCQUFJLE1BQU07MkJBQUMscUJBQXFCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0LCBJbmplY3RhYmxlLCBJbmplY3Rpb25Ub2tlbiwgT3B0aW9uYWwgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgZml4Q2VzaXVtRW50aXRpZXNTaGFkb3dzIH0gZnJvbSAnLi9TdGF0aWNHZW9tZXRyeUNvbG9yQmF0Y2gnO1xyXG5cclxuZXhwb3J0IGNvbnN0IEFOR1VMQVJfQ0VTSVVNX0NPTkZJRyA9IG5ldyBJbmplY3Rpb25Ub2tlbignQU5HVUxBUl9DRVNJVU1fQ09ORklHJyk7XHJcblxyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBDb25maWd1cmF0aW9uU2VydmljZSB7XHJcbiAgY29uc3RydWN0b3IoQE9wdGlvbmFsKCkgQEluamVjdChBTkdVTEFSX0NFU0lVTV9DT05GSUcpIHByaXZhdGUgY29uZmlnOiBhbnkpIHtcclxuICAgIGNvbnN0IGZpeEVudGl0aWVzU2hhZG93cyA9IGNvbmZpZyA/IGNvbmZpZy5maXhFbnRpdGllc1NoYWRvd3MgOiB0cnVlO1xyXG4gICAgaWYgKGZpeEVudGl0aWVzU2hhZG93cyAhPT0gZmFsc2UpIHtcclxuICAgICAgZml4Q2VzaXVtRW50aXRpZXNTaGFkb3dzKCk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiJdfQ==