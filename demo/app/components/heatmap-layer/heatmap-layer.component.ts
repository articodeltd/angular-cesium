import { Component, OnInit, ViewChild } from '@angular/core';
import { AcLayerComponent } from '../../../../src/angular-cesium/components/ac-layer/ac-layer.component';
import { AcNotification } from '../../../../src/angular-cesium/models/ac-notification';
import { TracksDataProvider } from '../../../utils/services/dataProvider/tracksDataProvider.service';
import * as h337 from 'heatmap.js/build/heatmap.js';
import { ActionType } from '../../../../src/angular-cesium/models/action-type.enum';
import { Subject } from 'rxjs/Subject';
import { CesiumService } from '../../../../src/angular-cesium/services/cesium/cesium.service';

//
@Component({
	selector : 'heatmap-layer',
	templateUrl : 'heatmap-layer.component.html',
	providers : [TracksDataProvider]
})
export class HeatmapLayerComponent implements OnInit {
	@ViewChild(AcLayerComponent) layer: AcLayerComponent;
	
	circles$: Subject<AcNotification> = new Subject();
	// circles$;
	Cesium = Cesium;
	show = true;
	
	heatmapOptionsDefaults;
	heatMapMaterial;
	_HeatmapOptions: any = {};
	_spacing: number;
	width;
	height;
	_mbounds;
	bounds;
	WMP = new Cesium.WebMercatorProjection();
	_factor: number;
	_rectangle;
	heatmap;
	rect = Cesium.Rectangle.fromDegrees(-110.0, 20.0, -80.0, 25.0);
	_xoffset;
	_yoffset;
	
	viewer;
	
	constructor(cesiumService: CesiumService) {
		
		this.viewer = cesiumService.getViewer();
		// this.circles$ = Observable.of({
		// 	id : '1',
		// 	actionType : ActionType.ADD_UPDATE,
		// 	entity : {
		// 		pos: this.rect,
		// 	},
		// })
		
		setTimeout(() => {
			this.circles$.next({
				id : '1',
				actionType : ActionType.ADD_UPDATE,
				entity : {
					pos : this._rectangle,
					center: Cesium.Cartesian3.fromDegrees(-110, 20),
					material: this.heatMapMaterial,
				},
			})
		}, 1000);
	}
	
	/**  Convert a mercator location to the corresponding heatmap location
	 *
	 *  p: a WGS84 location like {x: lon, y:lat}
	 */
	mercatorPointToHeatmapPoint(p) {
		let pn = {};
		
		pn.x = Math.round((p.x - this._xoffset) / this._factor + this._spacing);
		pn.y = Math.round((p.y - this._yoffset) / this._factor + this._spacing);
		pn.y = this.height - pn.y;
		
		return pn;
	};
	
	/**  Convert a WGS84 location to the corresponding heatmap location
	 *
	 *  p: a WGS84 location like {x:lon, y:lat}
	 */
	wgs84PointToHeatmapPoint = function (p) {
		return this.mercatorPointToHeatmapPoint(this.wgs84ToMercator(p));
	};
	
	
	/**  Set an array of heatmap locations
	 *
	 *  min:  the minimum allowed value for the data values
	 *  max:  the maximum allowed value for the data values
	 *  data: an array of data points in heatmap coordinates and values like {x, y, value}
	 */
	setData(min, max, data) {
		if (data && data.length > 0 && min !== null && min !== false && max !== null && max !== false) {
			this.heatmap.setData({
				min : min,
				max : max,
				data : data
			});
			
			return true;
		}
		
		return false;
	};
	
	
	/**  Set an array of WGS84 locations
	 *
	 *  min:  the minimum allowed value for the data values
	 *  max:  the maximum allowed value for the data values
	 *  data: an array of data points in WGS84 coordinates and values like { x:lon, y:lat, value }
	 */
	setWGS84Data(min, max, data) {
		if (data && data.length > 0 && min !== null && min !== false && max !== null && max !== false) {
			const convdata = [];
			
			for (let i = 0; i < data.length; i++) {
				const gp = data[i];
				
				const hp = this.wgs84PointToHeatmapPoint(gp);
				if (gp.value || gp.value === 0) {
					hp.value = gp.value;
				}
				
				convdata.push(hp);
			}
			
			return this.setData(min, max, convdata);
		}
		
		return false;
	};
	
	createContainer(height, width) {
		const id = 'heatmap';
		const c = document.createElement('div');
		if (id) {
			c.setAttribute('id', id);
		}
		c.setAttribute('style', 'width: ' + width + 'px; height: ' + height + 'px; margin: 0px; display: none;');
		document.body.appendChild(c);
		return c;
	}
	
	/**  Convert a WGS84 location into a mercator location
	 *
	 *  p: the WGS84 location like {x: lon, y: lat}
	 */
	wgs84ToMercator(p) {
		const mp = this.WMP.project(Cesium.Cartographic.fromDegrees(p.x, p.y));
		return {
			x : mp.x,
			y : mp.y
		};
	};
	
	rad2deg = function (r) {
		const d = r / (Math.PI / 180.0);
		return d;
	};
	
	
	/**  Convert a WGS84 bounding box into a mercator bounding box*
	 *  bb: the WGS84 bounding box like {north, east, south, west}
	 */
	wgs84ToMercatorBB(bb) {
		const sw = this.WMP.project(Cesium.Cartographic.fromDegrees(bb.west, bb.south));
		const ne = this.WMP.project(Cesium.Cartographic.fromDegrees(bb.east, bb.north));
		return {
			north : ne.y,
			east : ne.x,
			south : sw.y,
			west : sw.x
		};
	};
	
	/*  Convert a mercator bounding box into a WGS84 bounding box
		 *
		 *  bb: the mercator bounding box like {north, east, south, west}
		 */
	mercatorToWgs84BB(bb) {
		const sw = this.WMP.unproject(new Cesium.Cartesian3(bb.west, bb.south));
		const ne = this.WMP.unproject(new Cesium.Cartesian3(bb.east, bb.north));
		return {
			north : this.rad2deg(ne.latitude),
			east : this.rad2deg(ne.longitude),
			south : this.rad2deg(sw.latitude),
			west : this.rad2deg(sw.longitude)
		};
	};
	
	setWidthAndHeight(mbb) {
		this.width = ((mbb.east > 0 && mbb.west < 0) ? mbb.east + Math.abs(mbb.west) : Math.abs(mbb.east - mbb.west));
		this.height = ((mbb.north > 0 && mbb.south < 0) ? mbb.north + Math.abs(mbb.south) : Math.abs(mbb.north - mbb.south));
		this._factor = 1;
		
		if (this.width > this.height && this.width > this.heatmapOptionsDefaults.maxCanvasSize) {
			this._factor = this.width / this.heatmapOptionsDefaults.maxCanvasSize;
			
			if (this.height / this._factor < this.heatmapOptionsDefaults.minCanvasSize) {
				this._factor = this.height / this.heatmapOptionsDefaults.minCanvasSize;
			}
		} else if (this.height > this.width && this.height > this.heatmapOptionsDefaults.maxCanvasSize) {
			this._factor = this.height / this.heatmapOptionsDefaults.maxCanvasSize;
			
			if (this.width / this._factor < this.heatmapOptionsDefaults.minCanvasSize) {
				this._factor = this.width / this.heatmapOptionsDefaults.minCanvasSize;
			}
		} else if (this.width < this.height && this.width < this.heatmapOptionsDefaults.minCanvasSize) {
			this._factor = this.width / this.heatmapOptionsDefaults.minCanvasSize;
			
			if (this.height / this._factor > this.heatmapOptionsDefaults.maxCanvasSize) {
				this._factor = this.height / this.heatmapOptionsDefaults.maxCanvasSize;
			}
		} else if (this.height < this.width && this.height < this.heatmapOptionsDefaults.minCanvasSize) {
			this._factor = this.height / this.heatmapOptionsDefaults.minCanvasSize;
			
			if (this.width / this._factor > this.heatmapOptionsDefaults.maxCanvasSize) {
				this._factor = this.width / this.heatmapOptionsDefaults.maxCanvasSize;
			}
		}
		
		this.width = this.width / this._factor;
		this.height = this.height / this._factor;
	};
	
	ngOnInit() {
		
		const userHeatmapOptions = {radius : 500} as any;
		const userBB = {
			north : 25,
			east : -80,
			west : -110,
			south : 20,
		}; // {north, east, south, west}
		
		
		this.heatmapOptionsDefaults = {
			minCanvasSize : 700,           // minimum size (in pixels) for the heatmap canvas
			maxCanvasSize : 2000,          // maximum size (in pixels) for the heatmap canvas
			radiusFactor : 60,             // data point size factor used if no radius is given (the greater of height and width divided by this number yields the used radius)
			spacingFactor : 1.5,           // extra space around the borders (point radius multiplied by this number yields the spacing)
			maxOpacity : 0.8,              // the maximum opacity used if not given in the heatmap options object
			minOpacity : 0.1,              // the minimum opacity used if not given in the heatmap options object
			blur : 0.85,                   // the blur used if not given in the heatmap options object
			gradient : {                   // the gradient used if not given in the heatmap options object
				'.3' : 'blue',
				'.65' : 'yellow',
				'.8' : 'orange',
				'.95' : 'red'
			},
		};
		
		Object.assign(this._HeatmapOptions, this.heatmapOptionsDefaults);
		
		
		this._mbounds = this.wgs84ToMercatorBB(userBB);
		this.setWidthAndHeight(this._mbounds);
		
		this._HeatmapOptions.radius = Math.round((userHeatmapOptions.radius) ?
			userHeatmapOptions.radius : ((this.width > this.height) ?
				this.width / this.heatmapOptionsDefaults.radiusFactor :
				this.height / this.heatmapOptionsDefaults.radiusFactor));
		this._spacing = this._HeatmapOptions.radius * this.heatmapOptionsDefaults.spacingFactor;
		this._xoffset = this._mbounds.west;
		this._yoffset = this._mbounds.south;
		
		this.width = Math.round(this.width + this._spacing * 2);
		this.height = Math.round(this.height + this._spacing * 2);
		
		
		this._mbounds.west -= this._spacing * this._factor;
		this._mbounds.east += this._spacing * this._factor;
		this._mbounds.south -= this._spacing * this._factor;
		this._mbounds.north += this._spacing * this._factor;
		
		this.bounds = this.mercatorToWgs84BB(this._mbounds);
		this._rectangle = Cesium.Rectangle.fromDegrees(this.bounds.west, this.bounds.south, this.bounds.east, this.bounds.north);
		
		const container = this.createContainer(this.height, this.width);
		Object.assign(this._HeatmapOptions, {container});
		
		this.heatmap = h337.create(this._HeatmapOptions);
		
		// TODO setdata and set wgs84 data
		
		
		// w s e n
		// (-110.0, 20.0, -80.0, 25.0);
		const dataPoints = [{
			x : -90.0,
			y : 22.0,
			value : 20
		},
			{
				x : -85.0,
				y : 24.0,
				value : 45
			},
			{
				x : -95.0,
				y : 24.0,
				value : 65
			},
			{
				x : -100.0,
				y : 24.0,
				value : 95
			}
		];
		this.setWGS84Data(0, 100, dataPoints);
		
		const heatMapCanvas = this.heatmap._renderer.canvas;
		this.heatMapMaterial = new Cesium.ImageMaterialProperty({
			image : heatMapCanvas,
			transparent : true,
		});
		
		
		// this.circles$.next({
		// 	id : '1',
		// 	actionType : ActionType.ADD_UPDATE,
		// 	entity : {
		// 		pos: this._rectangle,
		// 	},
		// })
		
		// this.viewer.entities.add({
		// 	show: true,
		// 	rectangle: {
		// 		coordinates: this._rectangle,
		// 		material: this.heatMapMaterial
		// 	}
		// });
		
	}
	
	removeAll() {
		this.layer.removeAll();
	}
	
	setShow($event) {
		this.show = $event
	}
}
