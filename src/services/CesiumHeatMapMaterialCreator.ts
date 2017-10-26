import { GeoUtilsService } from '../angular-cesium/services/geo-utils/geo-utils.service';
import { Cartesian3 } from '../angular-cesium/models/cartesian3';
import * as h337 from 'heatmap.js/build/heatmap.js';

export class CesiumHeatMapMaterialCreator {
	static calaculateCircleCotainingRect(center, radius) {
		// (-100, 24),
		
		const top = GeoUtilsService.pointByLocationDistanceAndAzimuth(
			center,
			radius,
			Cesium.Math.toRadians(0),
			true
		);
		
		const right = GeoUtilsService.pointByLocationDistanceAndAzimuth(
			center,
			radius,
			Cesium.Math.toRadians(90),
			true
		);
		
		const bottom = GeoUtilsService.pointByLocationDistanceAndAzimuth(
			center,
			radius,
			Cesium.Math.toRadians(180),
			true
		);
		
		const left = GeoUtilsService.pointByLocationDistanceAndAzimuth(
			center,
			radius,
			Cesium.Math.toRadians(270),
			true
		);
		
		return Cesium.Rectangle.fromCartesianArray([top, bottom, right, left]);
	}
	
	static calculateContainingRectFromPoints(points: Cartesian3[]) {
		return Cesium.Rectangle.fromCartesianArray(points);
	}
	
	
	heatmapOptionsDefaults = {
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
	
	/**  Convert a mercator location to the corresponding heatmap location
	 *
	 *  p: a WGS84 location like {x: lon, y:lat}
	 */
	private mercatorPointToHeatmapPoint(p) {
		const pn: any = {};
		
		pn.x = Math.round((p.x - this._xoffset) / this._factor + this._spacing);
		pn.y = Math.round((p.y - this._yoffset) / this._factor + this._spacing);
		pn.y = this.height - pn.y;
		
		return pn;
	};
	
	/**  Convert a WGS84 location to the corresponding heatmap location
	 *
	 *  p: a WGS84 location like {x:lon, y:lat}
	 */
	private wgs84PointToHeatmapPoint = function (p) {
		return this.mercatorPointToHeatmapPoint(this.wgs84ToMercator(p));
	};
	
	
	private createContainer(height, width) {
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
	private wgs84ToMercator(p) {
		const mp = this.WMP.project(Cesium.Cartographic.fromDegrees(p.x, p.y));
		return {
			x : mp.x,
			y : mp.y
		};
	};
	
	private rad2deg = function (r) {
		const d = r / (Math.PI / 180.0);
		return d;
	};
	
	/**  Convert a WGS84 bounding box into a mercator bounding box*
	 *  bb: the WGS84 bounding box like {north, east, south, west}
	 */
	private wgs84ToMercatorBB(bb) {
		// TODO validate rad or deg
		const sw = this.WMP.project(Cesium.Cartographic.fromRadians(bb.west, bb.south));
		const ne = this.WMP.project(Cesium.Cartographic.fromRadians(bb.east, bb.north));
		return {
			north : ne.y,
			east : ne.x,
			south : sw.y,
			west : sw.x
		};
	};
	
	/**  Convert a mercator bounding box into a WGS84 bounding box
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
	
	private setWidthAndHeight(mbb) {
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
	
	
	public destory() {
		// TODO
	}
	
	// min:  the minimum allowed value for the data values
	// max:  the maximum allowed value for the data values
	// datapoint: {x,y,value}
	// heatmapOptions: a heatmap.js options object (see http://www.patrick-wied.at/static/heatmapjs/docs.html#h337-create)
	public create(containingBoundingRect, {heatPointsData, min = 0, max = 100}, heatmapOptions) {
		const userHeatmapOptions = Object.assign({}, heatmapOptions);
		const userBB = containingBoundingRect;
		console.log(userBB);
		
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
		
		
		this.setWGS84Data(0, 100, heatPointsData);
		const heatMapCanvas = this.heatmap._renderer.canvas;
		const heatMapMaterial = new Cesium.ImageMaterialProperty({
			image : heatMapCanvas,
			transparent : true,
		});
		return heatMapMaterial;
	}
	
}

