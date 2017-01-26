import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { AcNotification } from '../../angular-cesium/models/ac-notification';
import { ActionType } from '../../angular-cesium/models/action-type.enum';
import { AcLayerComponent } from '../../angular-cesium/components/ac-layer/ac-layer.component';
import { AsyncService } from "../../utils/services/async/async.service";

@Component({
	selector: 'ellipse-layer',
	templateUrl: './ellipse-layer.component.html',
	styleUrls: ['./ellipse-layer.component.css']
})
export class EllipseLayerComponent implements OnInit, AfterViewInit {
	@ViewChild(AcLayerComponent) layer: AcLayerComponent;

	ellipses$: Observable<AcNotification>;

	constructor(private asyncService: AsyncService) {
	}

	ngOnInit() {
		let socket = io.connect('http://localhost:3000');
		this.ellipses$ = Observable.create((observer) => {
			socket.on('birds', (data) => {
				this.asyncService.forEach(
					data,
					(acEntity) => {
						let action;
						if (acEntity.action === "ADD_OR_UPDATE") {
							action = ActionType.ADD_UPDATE;
						}
						else if (acEntity.action === "DELETE") {
							action = ActionType.DELETE
						}
						acEntity.actionType = action;
						acEntity.entity = this.convertToCesiumObj(acEntity);
						observer.next(acEntity);
					},
					2000);
			});
		})
	}

	oneAndOnlyMaterial = new Cesium.PerInstanceColorAppearance({
		translucent: false,
		closed: true
	});

	convertToCesiumObj(data): any {
		return {
			geometry: {
				center: Cesium.Cartesian3.fromRadians(Math.random(), Math.random()),
				semiMajorAxis: 500000.0,
				semiMinorAxis: 300000.0,
				height: 15000.0,
				rotation: Cesium.Math.toRadians(45)
			},
			attributes: {
				color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.fromRandom())
			},
			appearance: this.oneAndOnlyMaterial
		}
	}

	removeAll() {
		this.layer.removeAll();
	}

	ngAfterViewInit() {
	}
import {Component, OnInit, ViewChild} from "@angular/core";
import {AcNotification} from "../../angular-cesium/models/ac-notification";
import {AcLayerComponent} from "../../angular-cesium/components/ac-layer/ac-layer.component";
import {Observable} from "rxjs";
import {TracksDataProvider} from "../../utils/services/dataProvider/tracksDataProvider.service";

@Component({
    selector: 'ellipse-layer',
    templateUrl: './ellipse-layer.component.html',
    providers:[TracksDataProvider]
})
export class EllipseLayerComponent implements OnInit {
    @ViewChild(AcLayerComponent) layer: AcLayerComponent;

    ellipses$: Observable<AcNotification>;
    Cesium = Cesium;
    show = true;

    constructor(private tracksDataProvider: TracksDataProvider) {
    }

    ngOnInit() {
        this.ellipses$ = this.tracksDataProvider.get();
    }

    removeAll() {
        this.layer.removeAll();
    }
}
