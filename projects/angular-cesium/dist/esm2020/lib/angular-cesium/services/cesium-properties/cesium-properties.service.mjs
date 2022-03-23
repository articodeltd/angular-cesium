import { Injectable } from '@angular/core';
import { SmartAssigner } from '../smart-assigner/smart-assigner.service';
import * as i0 from "@angular/core";
import * as i1 from "@auscope/angular2parse";
import * as i2 from "../json-mapper/json-mapper.service";
export class CesiumProperties {
    constructor(_parser, _jsonMapper) {
        this._parser = _parser;
        this._jsonMapper = _jsonMapper;
        this._assignersCache = new Map();
        this._evaluatorsCache = new Map();
    }
    _compile(expression, withCache = true) {
        const cesiumDesc = {};
        const propsMap = new Map();
        const resultMap = this._jsonMapper.map(expression);
        resultMap.forEach((resultExpression, prop) => propsMap.set(prop, {
            expression: resultExpression,
            get: this._parser.eval(resultExpression)
        }));
        propsMap.forEach((value, prop) => {
            if (withCache) {
                cesiumDesc[prop || 'undefined'] = `cache.get(\`${value.expression}\`, () => propsMap.get('${prop}').get(context))`;
            }
            else {
                cesiumDesc[prop || 'undefined'] = `propsMap.get('${prop}').get(context)`;
            }
        });
        const fnBody = `return ${JSON.stringify(cesiumDesc).replace(/"/g, '')};`;
        const getFn = new Function('propsMap', 'cache', 'context', fnBody);
        return function evaluateCesiumProps(cache, context) {
            return getFn(propsMap, cache, context);
        };
    }
    _build(expression) {
        const props = Array.from(this._jsonMapper.map(expression).keys());
        const smartAssigner = SmartAssigner.create(props);
        return function assignCesiumProps(oldVal, newVal) {
            return smartAssigner(oldVal, newVal);
        };
    }
    createEvaluator(expression, withCache = true, newEvaluator = false) {
        if (!newEvaluator && this._evaluatorsCache.has(expression)) {
            return this._evaluatorsCache.get(expression);
        }
        const evaluatorFn = this._compile(expression, withCache);
        this._evaluatorsCache.set(expression, evaluatorFn);
        return evaluatorFn;
    }
    createAssigner(expression) {
        if (this._assignersCache.has(expression)) {
            return this._assignersCache.get(expression);
        }
        const assignFn = this._build(expression);
        this._assignersCache.set(expression, assignFn);
        return assignFn;
    }
}
CesiumProperties.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CesiumProperties, deps: [{ token: i1.Parse }, { token: i2.JsonMapper }], target: i0.ɵɵFactoryTarget.Injectable });
CesiumProperties.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CesiumProperties });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CesiumProperties, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.Parse }, { type: i2.JsonMapper }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2VzaXVtLXByb3BlcnRpZXMuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9saWIvYW5ndWxhci1jZXNpdW0vc2VydmljZXMvY2VzaXVtLXByb3BlcnRpZXMvY2VzaXVtLXByb3BlcnRpZXMuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRzNDLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSwwQ0FBMEMsQ0FBQzs7OztBQUl6RSxNQUFNLE9BQU8sZ0JBQWdCO0lBSTNCLFlBQW9CLE9BQWMsRUFDZCxXQUF1QjtRQUR2QixZQUFPLEdBQVAsT0FBTyxDQUFPO1FBQ2QsZ0JBQVcsR0FBWCxXQUFXLENBQVk7UUFKbkMsb0JBQWUsR0FBRyxJQUFJLEdBQUcsRUFBc0QsQ0FBQztRQUNoRixxQkFBZ0IsR0FBRyxJQUFJLEdBQUcsRUFBZ0UsQ0FBQztJQUluRyxDQUFDO0lBRUQsUUFBUSxDQUFDLFVBQWtCLEVBQUUsU0FBUyxHQUFHLElBQUk7UUFDM0MsTUFBTSxVQUFVLEdBQUcsRUFBRSxDQUFDO1FBQ3RCLE1BQU0sUUFBUSxHQUFHLElBQUksR0FBRyxFQUFpRCxDQUFDO1FBRTFFLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBRW5ELFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFO1lBQy9ELFVBQVUsRUFBRSxnQkFBZ0I7WUFDNUIsR0FBRyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDO1NBQ3pDLENBQUMsQ0FBQyxDQUFDO1FBRUosUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRTtZQUMvQixJQUFJLFNBQVMsRUFBRTtnQkFDYixVQUFVLENBQUMsSUFBSSxJQUFJLFdBQVcsQ0FBQyxHQUFHLGVBQWUsS0FBSyxDQUFDLFVBQVUsMkJBQTJCLElBQUksa0JBQWtCLENBQUM7YUFDcEg7aUJBQU07Z0JBQ0wsVUFBVSxDQUFDLElBQUksSUFBSSxXQUFXLENBQUMsR0FBRyxpQkFBaUIsSUFBSSxpQkFBaUIsQ0FBQzthQUMxRTtRQUNILENBQUMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxNQUFNLEdBQUcsVUFBVSxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQztRQUN6RSxNQUFNLEtBQUssR0FBRyxJQUFJLFFBQVEsQ0FBQyxVQUFVLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUVuRSxPQUFPLFNBQVMsbUJBQW1CLENBQUMsS0FBdUIsRUFBRSxPQUFlO1lBQzFFLE9BQU8sS0FBSyxDQUFDLFFBQVEsRUFBRSxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDekMsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQUVELE1BQU0sQ0FBQyxVQUFrQjtRQUN2QixNQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7UUFDbEUsTUFBTSxhQUFhLEdBQUcsYUFBYSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUVsRCxPQUFPLFNBQVMsaUJBQWlCLENBQUMsTUFBYyxFQUFFLE1BQWM7WUFDOUQsT0FBTyxhQUFhLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3ZDLENBQUMsQ0FBQztJQUNKLENBQUM7SUFFRCxlQUFlLENBQUMsVUFBa0IsRUFBRSxTQUFTLEdBQUcsSUFBSSxFQUFFLFlBQVksR0FBRyxLQUFLO1FBQ3hFLElBQUksQ0FBQyxZQUFZLElBQUksSUFBSSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsRUFBRTtZQUMxRCxPQUFPLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7U0FDOUM7UUFFRCxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUN6RCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxXQUFXLENBQUMsQ0FBQztRQUVuRCxPQUFPLFdBQVcsQ0FBQztJQUNyQixDQUFDO0lBRUQsY0FBYyxDQUFDLFVBQWtCO1FBQy9CLElBQUksSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLEVBQUU7WUFDeEMsT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUM3QztRQUVELE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDekMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBRS9DLE9BQU8sUUFBUSxDQUFDO0lBQ2xCLENBQUM7OzZHQWhFVSxnQkFBZ0I7aUhBQWhCLGdCQUFnQjsyRkFBaEIsZ0JBQWdCO2tCQUQ1QixVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBKc29uTWFwcGVyIH0gZnJvbSAnLi4vanNvbi1tYXBwZXIvanNvbi1tYXBwZXIuc2VydmljZSc7XHJcbmltcG9ydCB7IFBhcnNlIH0gZnJvbSAnQGF1c2NvcGUvYW5ndWxhcjJwYXJzZSc7XHJcbmltcG9ydCB7IFNtYXJ0QXNzaWduZXIgfSBmcm9tICcuLi9zbWFydC1hc3NpZ25lci9zbWFydC1hc3NpZ25lci5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQ29tcHV0YXRpb25DYWNoZSB9IGZyb20gJy4uL2NvbXB1dGF0aW9uLWNhY2hlL2NvbXB1dGF0aW9uLWNhY2hlLnNlcnZpY2UnO1xyXG5cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgQ2VzaXVtUHJvcGVydGllcyB7XHJcbiAgcHJpdmF0ZSBfYXNzaWduZXJzQ2FjaGUgPSBuZXcgTWFwPHN0cmluZywgKG9sZFZhbDogT2JqZWN0LCBuZXdWYWw6IE9iamVjdCkgPT4gT2JqZWN0PigpO1xyXG4gIHByaXZhdGUgX2V2YWx1YXRvcnNDYWNoZSA9IG5ldyBNYXA8c3RyaW5nLCAoY2FjaGU6IENvbXB1dGF0aW9uQ2FjaGUsIGNvbnRleHQ6IE9iamVjdCkgPT4gT2JqZWN0PigpO1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9wYXJzZXI6IFBhcnNlLFxyXG4gICAgICAgICAgICAgIHByaXZhdGUgX2pzb25NYXBwZXI6IEpzb25NYXBwZXIpIHtcclxuICB9XHJcblxyXG4gIF9jb21waWxlKGV4cHJlc3Npb246IHN0cmluZywgd2l0aENhY2hlID0gdHJ1ZSk6IChjYWNoZTogQ29tcHV0YXRpb25DYWNoZSwgY29udGV4dDogT2JqZWN0KSA9PiBPYmplY3Qge1xyXG4gICAgY29uc3QgY2VzaXVtRGVzYyA9IHt9O1xyXG4gICAgY29uc3QgcHJvcHNNYXAgPSBuZXcgTWFwPHN0cmluZywgeyBleHByZXNzaW9uOiBzdHJpbmcsIGdldDogRnVuY3Rpb24gfT4oKTtcclxuXHJcbiAgICBjb25zdCByZXN1bHRNYXAgPSB0aGlzLl9qc29uTWFwcGVyLm1hcChleHByZXNzaW9uKTtcclxuXHJcbiAgICByZXN1bHRNYXAuZm9yRWFjaCgocmVzdWx0RXhwcmVzc2lvbiwgcHJvcCkgPT4gcHJvcHNNYXAuc2V0KHByb3AsIHtcclxuICAgICAgZXhwcmVzc2lvbjogcmVzdWx0RXhwcmVzc2lvbixcclxuICAgICAgZ2V0OiB0aGlzLl9wYXJzZXIuZXZhbChyZXN1bHRFeHByZXNzaW9uKVxyXG4gICAgfSkpO1xyXG5cclxuICAgIHByb3BzTWFwLmZvckVhY2goKHZhbHVlLCBwcm9wKSA9PiB7XHJcbiAgICAgIGlmICh3aXRoQ2FjaGUpIHtcclxuICAgICAgICBjZXNpdW1EZXNjW3Byb3AgfHwgJ3VuZGVmaW5lZCddID0gYGNhY2hlLmdldChcXGAke3ZhbHVlLmV4cHJlc3Npb259XFxgLCAoKSA9PiBwcm9wc01hcC5nZXQoJyR7cHJvcH0nKS5nZXQoY29udGV4dCkpYDtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjZXNpdW1EZXNjW3Byb3AgfHwgJ3VuZGVmaW5lZCddID0gYHByb3BzTWFwLmdldCgnJHtwcm9wfScpLmdldChjb250ZXh0KWA7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnN0IGZuQm9keSA9IGByZXR1cm4gJHtKU09OLnN0cmluZ2lmeShjZXNpdW1EZXNjKS5yZXBsYWNlKC9cIi9nLCAnJyl9O2A7XHJcbiAgICBjb25zdCBnZXRGbiA9IG5ldyBGdW5jdGlvbigncHJvcHNNYXAnLCAnY2FjaGUnLCAnY29udGV4dCcsIGZuQm9keSk7XHJcblxyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIGV2YWx1YXRlQ2VzaXVtUHJvcHMoY2FjaGU6IENvbXB1dGF0aW9uQ2FjaGUsIGNvbnRleHQ6IE9iamVjdCk6IE9iamVjdCB7XHJcbiAgICAgIHJldHVybiBnZXRGbihwcm9wc01hcCwgY2FjaGUsIGNvbnRleHQpO1xyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIF9idWlsZChleHByZXNzaW9uOiBzdHJpbmcpOiAob2xkVmFsOiBPYmplY3QsIG5ld1ZhbDogT2JqZWN0KSA9PiBPYmplY3Qge1xyXG4gICAgY29uc3QgcHJvcHMgPSBBcnJheS5mcm9tKHRoaXMuX2pzb25NYXBwZXIubWFwKGV4cHJlc3Npb24pLmtleXMoKSk7XHJcbiAgICBjb25zdCBzbWFydEFzc2lnbmVyID0gU21hcnRBc3NpZ25lci5jcmVhdGUocHJvcHMpO1xyXG5cclxuICAgIHJldHVybiBmdW5jdGlvbiBhc3NpZ25DZXNpdW1Qcm9wcyhvbGRWYWw6IE9iamVjdCwgbmV3VmFsOiBPYmplY3QpIHtcclxuICAgICAgcmV0dXJuIHNtYXJ0QXNzaWduZXIob2xkVmFsLCBuZXdWYWwpO1xyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIGNyZWF0ZUV2YWx1YXRvcihleHByZXNzaW9uOiBzdHJpbmcsIHdpdGhDYWNoZSA9IHRydWUsIG5ld0V2YWx1YXRvciA9IGZhbHNlKTogKGNhY2hlOiBDb21wdXRhdGlvbkNhY2hlLCBjb250ZXh0OiBPYmplY3QpID0+IE9iamVjdCB7XHJcbiAgICBpZiAoIW5ld0V2YWx1YXRvciAmJiB0aGlzLl9ldmFsdWF0b3JzQ2FjaGUuaGFzKGV4cHJlc3Npb24pKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLl9ldmFsdWF0b3JzQ2FjaGUuZ2V0KGV4cHJlc3Npb24pO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGV2YWx1YXRvckZuID0gdGhpcy5fY29tcGlsZShleHByZXNzaW9uLCB3aXRoQ2FjaGUpO1xyXG4gICAgdGhpcy5fZXZhbHVhdG9yc0NhY2hlLnNldChleHByZXNzaW9uLCBldmFsdWF0b3JGbik7XHJcblxyXG4gICAgcmV0dXJuIGV2YWx1YXRvckZuO1xyXG4gIH1cclxuXHJcbiAgY3JlYXRlQXNzaWduZXIoZXhwcmVzc2lvbjogc3RyaW5nKTogKG9sZFZhbDogT2JqZWN0LCBuZXdWYWw6IE9iamVjdCkgPT4gT2JqZWN0IHtcclxuICAgIGlmICh0aGlzLl9hc3NpZ25lcnNDYWNoZS5oYXMoZXhwcmVzc2lvbikpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuX2Fzc2lnbmVyc0NhY2hlLmdldChleHByZXNzaW9uKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBhc3NpZ25GbiA9IHRoaXMuX2J1aWxkKGV4cHJlc3Npb24pO1xyXG4gICAgdGhpcy5fYXNzaWduZXJzQ2FjaGUuc2V0KGV4cHJlc3Npb24sIGFzc2lnbkZuKTtcclxuXHJcbiAgICByZXR1cm4gYXNzaWduRm47XHJcbiAgfVxyXG59XHJcbiJdfQ==