import { Component, OnInit, ViewChild } from '@angular/core';
import { AcLayerComponent } from '../../../../src/angular-cesium/components/ac-layer/ac-layer.component';
import { AcNotification } from '../../../../src/angular-cesium/models/ac-notification';
import { ActionType } from '../../../../src/angular-cesium/models/action-type.enum';
import { Subject } from 'rxjs/Subject';
import { CesiumService } from '../../../../src/angular-cesium/services/cesium/cesium.service';
import { CoordinateConverter } from '../../../../src/angular-cesium/services/coordinate-converter/coordinate-converter.service';
import { CesiumHeatMapMaterialCreator } from '../../../../src/heatmap/cesium-heatmap-material-creator';

@Component({
	selector : 'heatmap-layer',
	templateUrl : 'heatmap-layer.component.html',
	providers : [CoordinateConverter]
})
export class HeatmapLayerComponent implements OnInit {
	@ViewChild(AcLayerComponent) layer: AcLayerComponent;
	
	entities$: Subject<AcNotification> = new Subject();
	Cesium = Cesium;
	show = true;
	rect = Cesium.Rectangle.fromDegrees(-120, 35, -90, 40);
	circleRadius = 500000;
	circleCenter = Cesium.Cartesian3.fromDegrees(-100, 24);
	
	circleHeatMapMaterial: any;
	rectHeatMapMaterial: any;
	viewer: any;
	
	constructor(cesiumService: CesiumService) {
		this.viewer = cesiumService.getViewer();
		setTimeout(() => {
			
			this.entities$.next({
				id : '1',
				actionType : ActionType.ADD_UPDATE,
				entity : {
					rectangle : this.rect,
					center : this.circleCenter,
					circleMaterial : this.circleHeatMapMaterial,
					rectMaterial : this.rectHeatMapMaterial,
				},
			})
		}, 1000);
	}
	
	ngOnInit() {
		const userHeatmapOptions = {
			radius : 2000,
			minOpacity : 0,
			maxOpacity : 0.9,
		} as any;
		
		const mCreator = new CesiumHeatMapMaterialCreator();
		const containingRect = CesiumHeatMapMaterialCreator.calcCircleContainingRect(this.circleCenter, this.circleRadius);
		this.circleHeatMapMaterial = mCreator.create(containingRect, {
			heatPointsData : [
				{
					x : -100.0,
					y : 24.0,
					value : 95
				}
			],
			min : 0,
			max : 100,
		}, userHeatmapOptions);
		
		
		this.rectHeatMapMaterial = mCreator.create(this.rect, {
			heatPointsData : [
				{
					x : -100,
					y : 34.0,
					value : 50,
				},
				{
					x : -95,
					y : 34.0,
					value : 80,
				},
			]
		}, {
			radius : 400,
		})
		
	}
	
	removeAll() {
		this.layer.removeAll();
	}
	
	setShow($event: boolean) {
		this.show = $event
	}
}

