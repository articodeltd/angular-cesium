import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';

import { AcNotification } from '../../angular-cesium/models/ac-notification';
import { AcLayerComponent } from '../../angular-cesium/components/ac-layer/ac-layer.component';
import { TracksDataProvider } from '../../utils/services/dataProvider/tracksDataProvider.service';

@Component({
	selector: 'static-polyline-layer',
	templateUrl: 'static-polyline-layer.component.html',
	providers: [TracksDataProvider]
})
export class staticPolylineLayerComponent implements OnInit {
	@ViewChild(AcLayerComponent) layer: AcLayerComponent;

	staticPolylines$: Observable<AcNotification>;
	Cesium = Cesium;
	show = true;

	constructor(private tracksDataProvider: TracksDataProvider) {
	}

	ngOnInit() {
		this.staticPolylines$ = this.tracksDataProvider.get();
	}

	removeAll() {
		this.layer.removeAll();
	}
}
