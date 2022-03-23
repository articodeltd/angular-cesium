import { EventEmitter, Injectable } from '@angular/core';
import * as i0 from "@angular/core";
export class LayerService {
    constructor() {
        this._cache = true;
        this.descriptions = [];
        this.layerUpdate = new EventEmitter();
    }
    get cache() {
        return this._cache;
    }
    set cache(value) {
        this._cache = value;
    }
    get zIndex() {
        return this._zIndex;
    }
    set zIndex(value) {
        if (value !== this._zIndex) {
            this.layerUpdate.emit();
        }
        this._zIndex = value;
    }
    get show() {
        return this._show;
    }
    set show(value) {
        if (value !== this._show) {
            this.layerUpdate.emit();
        }
        this._show = value;
    }
    get options() {
        return this._options;
    }
    set options(value) {
        this._options = value;
        this.layerUpdate.emit();
    }
    get context() {
        return this._context;
    }
    set context(context) {
        this._context = context;
        this.layerUpdate.emit();
    }
    setEntityName(name) {
        this._entityName = name;
    }
    getEntityName() {
        return this._entityName;
    }
    registerDescription(descriptionComponent) {
        if (this.descriptions.indexOf(descriptionComponent) < 0) {
            this.descriptions.push(descriptionComponent);
        }
    }
    unregisterDescription(descriptionComponent) {
        const index = this.descriptions.indexOf(descriptionComponent);
        if (index > -1) {
            this.descriptions.splice(index, 1);
        }
    }
    getDescriptions() {
        return this.descriptions;
    }
    layerUpdates() {
        return this.layerUpdate;
    }
}
LayerService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: LayerService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
LayerService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: LayerService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: LayerService, decorators: [{
            type: Injectable
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF5ZXItc2VydmljZS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2xpYi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9sYXllci1zZXJ2aWNlL2xheWVyLXNlcnZpY2Uuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQzs7QUFLekQsTUFBTSxPQUFPLFlBQVk7SUFEekI7UUFPVSxXQUFNLEdBQUcsSUFBSSxDQUFDO1FBQ2QsaUJBQVksR0FBbUIsRUFBRSxDQUFDO1FBQ2xDLGdCQUFXLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztLQThFMUM7SUE1RUMsSUFBSSxLQUFLO1FBQ1AsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQ3JCLENBQUM7SUFFRCxJQUFJLEtBQUssQ0FBQyxLQUFjO1FBQ3RCLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO0lBQ3RCLENBQUM7SUFFRCxJQUFJLE1BQU07UUFDUixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7SUFDdEIsQ0FBQztJQUVELElBQUksTUFBTSxDQUFDLEtBQWE7UUFDdEIsSUFBSSxLQUFLLEtBQUssSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUMxQixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDO1NBQ3pCO1FBQ0QsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7SUFDdkIsQ0FBQztJQUVELElBQUksSUFBSTtRQUNOLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztJQUNwQixDQUFDO0lBRUQsSUFBSSxJQUFJLENBQUMsS0FBYztRQUNyQixJQUFJLEtBQUssS0FBSyxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ3hCLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDekI7UUFDRCxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztJQUNyQixDQUFDO0lBRUQsSUFBSSxPQUFPO1FBQ1QsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ3ZCLENBQUM7SUFFRCxJQUFJLE9BQU8sQ0FBQyxLQUFtQjtRQUM3QixJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztRQUN0QixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQzFCLENBQUM7SUFFRCxJQUFJLE9BQU87UUFDVCxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDdkIsQ0FBQztJQUVELElBQUksT0FBTyxDQUFDLE9BQU87UUFDakIsSUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUM7UUFDeEIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUMxQixDQUFDO0lBRUQsYUFBYSxDQUFDLElBQVk7UUFDeEIsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7SUFDMUIsQ0FBQztJQUVELGFBQWE7UUFDWCxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUM7SUFDMUIsQ0FBQztJQUVELG1CQUFtQixDQUFDLG9CQUFrQztRQUNwRCxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLG9CQUFvQixDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ3ZELElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUM7U0FDOUM7SUFDSCxDQUFDO0lBRUQscUJBQXFCLENBQUMsb0JBQWtDO1FBQ3RELE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLG9CQUFvQixDQUFDLENBQUM7UUFDOUQsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDLEVBQUU7WUFDZCxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7U0FDcEM7SUFDSCxDQUFDO0lBRUQsZUFBZTtRQUNiLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQztJQUMzQixDQUFDO0lBRUQsWUFBWTtRQUNWLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQztJQUMxQixDQUFDOzt5R0FyRlUsWUFBWTs2R0FBWixZQUFZOzJGQUFaLFlBQVk7a0JBRHhCLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFdmVudEVtaXR0ZXIsIEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSURlc2NyaXB0aW9uIH0gZnJvbSAnLi4vLi4vbW9kZWxzL2Rlc2NyaXB0aW9uJztcclxuaW1wb3J0IHsgTGF5ZXJPcHRpb25zIH0gZnJvbSAnLi4vLi4vbW9kZWxzL2xheWVyLW9wdGlvbnMnO1xyXG5cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgTGF5ZXJTZXJ2aWNlIHtcclxuICBwcml2YXRlIF9jb250ZXh0OiBhbnk7XHJcbiAgcHJpdmF0ZSBfb3B0aW9uczogTGF5ZXJPcHRpb25zO1xyXG4gIHByaXZhdGUgX3Nob3c6IGJvb2xlYW47XHJcbiAgcHJpdmF0ZSBfekluZGV4OiBudW1iZXI7XHJcbiAgcHJpdmF0ZSBfZW50aXR5TmFtZTogc3RyaW5nO1xyXG4gIHByaXZhdGUgX2NhY2hlID0gdHJ1ZTtcclxuICBwcml2YXRlIGRlc2NyaXB0aW9uczogSURlc2NyaXB0aW9uW10gPSBbXTtcclxuICBwcml2YXRlIGxheWVyVXBkYXRlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICBnZXQgY2FjaGUoKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gdGhpcy5fY2FjaGU7XHJcbiAgfVxyXG5cclxuICBzZXQgY2FjaGUodmFsdWU6IGJvb2xlYW4pIHtcclxuICAgIHRoaXMuX2NhY2hlID0gdmFsdWU7XHJcbiAgfVxyXG5cclxuICBnZXQgekluZGV4KCk6IG51bWJlciB7XHJcbiAgICByZXR1cm4gdGhpcy5fekluZGV4O1xyXG4gIH1cclxuXHJcbiAgc2V0IHpJbmRleCh2YWx1ZTogbnVtYmVyKSB7XHJcbiAgICBpZiAodmFsdWUgIT09IHRoaXMuX3pJbmRleCkge1xyXG4gICAgICB0aGlzLmxheWVyVXBkYXRlLmVtaXQoKTtcclxuICAgIH1cclxuICAgIHRoaXMuX3pJbmRleCA9IHZhbHVlO1xyXG4gIH1cclxuXHJcbiAgZ2V0IHNob3coKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gdGhpcy5fc2hvdztcclxuICB9XHJcblxyXG4gIHNldCBzaG93KHZhbHVlOiBib29sZWFuKSB7XHJcbiAgICBpZiAodmFsdWUgIT09IHRoaXMuX3Nob3cpIHtcclxuICAgICAgdGhpcy5sYXllclVwZGF0ZS5lbWl0KCk7XHJcbiAgICB9XHJcbiAgICB0aGlzLl9zaG93ID0gdmFsdWU7XHJcbiAgfVxyXG5cclxuICBnZXQgb3B0aW9ucygpOiBMYXllck9wdGlvbnMge1xyXG4gICAgcmV0dXJuIHRoaXMuX29wdGlvbnM7XHJcbiAgfVxyXG5cclxuICBzZXQgb3B0aW9ucyh2YWx1ZTogTGF5ZXJPcHRpb25zKSB7XHJcbiAgICB0aGlzLl9vcHRpb25zID0gdmFsdWU7XHJcbiAgICB0aGlzLmxheWVyVXBkYXRlLmVtaXQoKTtcclxuICB9XHJcblxyXG4gIGdldCBjb250ZXh0KCk6IGFueSB7XHJcbiAgICByZXR1cm4gdGhpcy5fY29udGV4dDtcclxuICB9XHJcblxyXG4gIHNldCBjb250ZXh0KGNvbnRleHQpIHtcclxuICAgIHRoaXMuX2NvbnRleHQgPSBjb250ZXh0O1xyXG4gICAgdGhpcy5sYXllclVwZGF0ZS5lbWl0KCk7XHJcbiAgfVxyXG5cclxuICBzZXRFbnRpdHlOYW1lKG5hbWU6IHN0cmluZykge1xyXG4gICAgdGhpcy5fZW50aXR5TmFtZSA9IG5hbWU7XHJcbiAgfVxyXG5cclxuICBnZXRFbnRpdHlOYW1lKCk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gdGhpcy5fZW50aXR5TmFtZTtcclxuICB9XHJcblxyXG4gIHJlZ2lzdGVyRGVzY3JpcHRpb24oZGVzY3JpcHRpb25Db21wb25lbnQ6IElEZXNjcmlwdGlvbikge1xyXG4gICAgaWYgKHRoaXMuZGVzY3JpcHRpb25zLmluZGV4T2YoZGVzY3JpcHRpb25Db21wb25lbnQpIDwgMCkge1xyXG4gICAgICB0aGlzLmRlc2NyaXB0aW9ucy5wdXNoKGRlc2NyaXB0aW9uQ29tcG9uZW50KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHVucmVnaXN0ZXJEZXNjcmlwdGlvbihkZXNjcmlwdGlvbkNvbXBvbmVudDogSURlc2NyaXB0aW9uKSB7XHJcbiAgICBjb25zdCBpbmRleCA9IHRoaXMuZGVzY3JpcHRpb25zLmluZGV4T2YoZGVzY3JpcHRpb25Db21wb25lbnQpO1xyXG4gICAgaWYgKGluZGV4ID4gLTEpIHtcclxuICAgICAgdGhpcy5kZXNjcmlwdGlvbnMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGdldERlc2NyaXB0aW9ucygpOiBJRGVzY3JpcHRpb25bXSB7XHJcbiAgICByZXR1cm4gdGhpcy5kZXNjcmlwdGlvbnM7XHJcbiAgfVxyXG5cclxuICBsYXllclVwZGF0ZXMoKTogRXZlbnRFbWl0dGVyPGFueT4ge1xyXG4gICAgcmV0dXJuIHRoaXMubGF5ZXJVcGRhdGU7XHJcbiAgfVxyXG59XHJcbiJdfQ==