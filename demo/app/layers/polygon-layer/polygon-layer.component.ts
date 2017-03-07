import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';

import { AcNotification } from '../../../../src/models/ac-notification';
import { TracksDataProvider } from '../../../utils/services/dataProvider/tracksDataProvider.service';
import { AcLayerComponent } from '../../../../src/components/ac-layer/ac-layer.component';

@Component({
	selector: 'polygon-layer',
	templateUrl: 'polygon-layer.component.html',
	styleUrls: ['polygon-layer.component.css'],
	providers: [TracksDataProvider]
})
export class PolygonLayerComponent implements OnInit {
	@ViewChild(AcLayerComponent) layer: AcLayerComponent;

	polygons$: Observable<AcNotification>;
	show = true;

	constructor(private tracksDataProvider: TracksDataProvider) {
	}

	ngOnInit() {
		this.polygons$ = this.tracksDataProvider.get();
	}

	removeAll() {
		this.layer.removeAll();
	}

	setShow($event) {
		this.show = $event
	}
}
