import { Component, OnInit, ViewChild } from '@angular/core';
import { AcNotification } from '../../../../src/models/ac-notification';
import { Observable } from 'rxjs';
import { AcLayerComponent } from '../../../../src/components/ac-layer/ac-layer.component';
import { TracksDataProvider } from '../../../utils/services/dataProvider/tracksDataProvider.service';

@Component({
	selector: 'dynamic-circle-layer',
	templateUrl: 'dynamic-circle-layer.component.html',
	styleUrls: ['dynamic-circle-layer.component.css'],
	providers: [TracksDataProvider]
})
export class DynamicCircleLayerComponent implements OnInit {
	@ViewChild(AcLayerComponent) layer: AcLayerComponent;

	circles$: Observable<AcNotification>;
	Cesium = Cesium;
	show = true;

	constructor(private tracksDataProvider: TracksDataProvider) {
	}

	ngOnInit() {
		this.circles$ = this.tracksDataProvider.get();
	}

	removeAll() {
		this.layer.removeAll();
	}

	setShow($event) {
		this.show = $event
	}
}