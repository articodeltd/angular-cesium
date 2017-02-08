import { Observable } from 'rxjs';
import { LayerService } from '../services/layer-service/layer-service.service';
import { Directive, TemplateRef, ViewContainerRef, ChangeDetectorRef, Input } from '@angular/core';

export class LayerData {
	constructor(public entity: Object = null,
	            public $implicit: any = null) {
	}
}

@Directive({
	selector: '[acLayer2]'
})
export class AcLayer2Directive {

	private _observable: Observable<any>;

	@Input()
	set acLayer2Of(observable: Observable<any>) {
		if (this._observable) {
			return;
		}

		let view = null;
		this._observable = observable;
		const context = new LayerData();

		observable.subscribe((data) => {
			if (!view) {
				view = this.viewContainerRef.createEmbeddedView(this.templateRef, context);
			}

			context.$implicit = data;
			context.entity = data.entity;
			// this.layerService.setCurrentNotification(data);
			this.changeDetector.detectChanges();
		});
	}

	constructor(private templateRef: TemplateRef<any>,
	            private viewContainerRef: ViewContainerRef,
	            private changeDetector: ChangeDetectorRef,
	            private layerService: LayerService) {
	}
}
