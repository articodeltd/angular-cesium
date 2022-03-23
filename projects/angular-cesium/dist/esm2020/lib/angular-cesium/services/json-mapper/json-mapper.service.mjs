import { Injectable } from '@angular/core';
import { JsonStringMapper } from 'json-string-mapper';
import * as i0 from "@angular/core";
export class JsonMapper {
    constructor() {
        this._mapper = new JsonStringMapper();
    }
    map(expression) {
        return this._mapper.map(expression);
    }
}
JsonMapper.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: JsonMapper, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
JsonMapper.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: JsonMapper });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: JsonMapper, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return []; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbi1tYXBwZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9saWIvYW5ndWxhci1jZXNpdW0vc2VydmljZXMvanNvbi1tYXBwZXIvanNvbi1tYXBwZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLG9CQUFvQixDQUFDOztBQUd0RCxNQUFNLE9BQU8sVUFBVTtJQUdyQjtRQUNFLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxnQkFBZ0IsRUFBRSxDQUFDO0lBQ3hDLENBQUM7SUFFRCxHQUFHLENBQUMsVUFBa0I7UUFDcEIsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUN0QyxDQUFDOzt1R0FUVSxVQUFVOzJHQUFWLFVBQVU7MkZBQVYsVUFBVTtrQkFEdEIsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSnNvblN0cmluZ01hcHBlciB9IGZyb20gJ2pzb24tc3RyaW5nLW1hcHBlcic7XHJcblxyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBKc29uTWFwcGVyIHtcclxuICBwcml2YXRlIF9tYXBwZXI6IEpzb25TdHJpbmdNYXBwZXI7XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5fbWFwcGVyID0gbmV3IEpzb25TdHJpbmdNYXBwZXIoKTtcclxuICB9XHJcblxyXG4gIG1hcChleHByZXNzaW9uOiBzdHJpbmcpOiBNYXA8c3RyaW5nLCBzdHJpbmc+IHtcclxuICAgIHJldHVybiB0aGlzLl9tYXBwZXIubWFwKGV4cHJlc3Npb24pO1xyXG4gIH1cclxufVxyXG4iXX0=