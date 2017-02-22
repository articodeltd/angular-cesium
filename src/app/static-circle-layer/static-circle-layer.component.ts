import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { AcNotification } from '../../angular-cesium/models/ac-notification';
import { AcLayerComponent } from '../../angular-cesium/components/ac-layer/ac-layer.component';
import { TracksDataProvider } from '../../utils/services/dataProvider/tracksDataProvider.service';

@Component({
	selector: 'ac-static-circle-layer',
	templateUrl: 'static-circle-layer.component.html',
	providers: [TracksDataProvider]
})
export class StaticCircleLayerComponent implements OnInit {
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
