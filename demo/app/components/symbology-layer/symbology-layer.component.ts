import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { AcNotification } from '../../../../src/models/ac-notification';
import { AcLayerComponent } from '../../../../src/components/ac-layer/ac-layer.component';
import { TracksDataProvider } from '../../../utils/services/dataProvider/tracksDataProvider.service';
import { MapEventsManagerService } from '../../../../src/services/map-events-mananger/map-events-manager';
import { CesiumEvent } from '../../../../src/services/map-events-mananger/consts/cesium-event.enum';
import { PickOptions } from '../../../../src/services/map-events-mananger/consts/pickOptions.enum';

@Component({
	selector: 'symbology-layer',
	templateUrl: 'symbology-layer.component.html',
	providers: [TracksDataProvider]
})
export class SymbologyLayerComponent implements OnInit {
	@ViewChild(AcLayerComponent) layer: AcLayerComponent;

	entities: Observable<AcNotification>;
	Cesium = Cesium;
	show = true;

	constructor(private eventManager: MapEventsManagerService, private tracksDataProvider: TracksDataProvider) {
	}

	ngOnInit() {
		this.entities = this.tracksDataProvider.get();

		this.eventManager.register({event: CesiumEvent.LEFT_CLICK, pick: PickOptions.PICK_FIRST}).subscribe((result) => {
			console.log(result);
		});
	}

	removeAll() {
		this.layer.removeAll();
	}

	setShow($event) {
		this.show = $event;
	}
}
