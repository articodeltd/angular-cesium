import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';

import { AcNotification } from '../../angular-cesium/models/ac-notification';
import { AcLayerComponent } from '../../angular-cesium/components/ac-layer/ac-layer.component';
import { TracksDataProvider } from '../../utils/services/dataProvider/tracksDataProvider.service';

@Component({
	selector: 'polygon-layer',
	templateUrl: './polygon-layer.component.html',
	styleUrls: ['./polygon-layer.component.css'],
	providers: [TracksDataProvider]
})
export class PolygonLayerComponent implements OnInit {
	@ViewChild(AcLayerComponent) layer: AcLayerComponent;

	polygons$: Observable<AcNotification>;

	constructor(private tracksDataProvider: TracksDataProvider) {
	}

	ngOnInit() {
		this.polygons$ = this.tracksDataProvider.get();
	}

	removeAll() {
		this.layer.removeAll();
	}
}
