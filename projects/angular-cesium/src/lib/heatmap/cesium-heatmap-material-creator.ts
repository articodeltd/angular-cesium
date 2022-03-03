import { Injectable } from '@angular/core';
import { WebMercatorProjection, Rectangle, Cartographic, ImageMaterialProperty, Cartesian2, Cartesian3 } from 'cesium';
import { GeoUtilsService } from '../angular-cesium/services/geo-utils/geo-utils.service';
import * as h337 from 'heatmap.js/build/heatmap.js';


// Consider moving to a different package.

if (!h337) {
  throw new Error('must install heatmap.js. please do npm -i heatmap.js ');
}


// export interface Rectangle {
//  west: number;
//  south: number;
//  east: number;
//  north: number;
// }


/**
 *  x: lon
 *  y: lat
 *  value: point value
 */
export interface HeatPointDataPoint {
  x: number;
  y: number;
  value: number;
}

/**
 *   min:  the minimum allowed value for the data values
 *  max:  the maximum allowed value for the data values
 *  heatPointsData: an array of data points in WGS84 coordinates and values like { x:lon, y:lat, value)
 */
export interface HeatmapDataSet {
  min?: number;
  max?: number;
  heatPointsData: HeatPointDataPoint[];
}

/**
 * a heatmap.js options object (see http://www.patrick-wied.at/static/heatmapjs/docs.html#h337-create)
 */
export interface HeatMapOptions {
  [propName: string]: any;

  gradient?: any;
  radius?: number;
  opacity?: number;
  maxOpacity?: number;
  minOpacity?: number;
  blur?: any;
}

/**
 * Create heatmap material (Cesium.ImageMaterialProperty with heatmap as the image)
 * works with http://www.patrick-wied.at/static/heatmapjs. must do npm -i heatmap.js
 * usage:
 * ```
 *
 const mCreator = new CesiumHeatMapMaterialCreator();
 const containingRect = CesiumHeatMapMaterialCreator.calcCircleContainingRect(this.circleCenter, this.circleRadius);
 const userHeatmapOptions = {
			radius : 2000,
			minOpacity : 0,
			maxOpacity : 0.9,
		} as any;

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
 * ```
 *
 * inspired by https://github.com/danwild/CesiumHeatmap
 */
@Injectable()
export class CesiumHeatMapMaterialCreator {


  private static containerCanvasCounter = 0;

  heatmapOptionsDefaults = {
    minCanvasSize: 700,           // minimum size (in pixels) for the heatmap canvas
    maxCanvasSize: 2000,          // maximum size (in pixels) for the heatmap canvas
    radiusFactor: 60,             // data point size factor used if no radius is given
    // (the greater of height and width divided by this number yields the used radius)
    spacingFactor: 1,           // extra space around the borders (point radius multiplied by this number yields the spacing)
    maxOpacity: 0.8,              // the maximum opacity used if not given in the heatmap options object
    minOpacity: 0.1,              // the minimum opacity used if not given in the heatmap options object
    blur: 0.85,                   // the blur used if not given in the heatmap options object
    gradient: {                   // the gradient used if not given in the heatmap options object
      '.3': 'blue',
      '.65': 'yellow',
      '.8': 'orange',
      '.95': 'red'
    },
  };

  WMP = new WebMercatorProjection();
  _spacing: number;
  width: number;
  height: number;
  _mbounds: any;
  bounds: any;
  _factor: number;
  _rectangle: Rectangle;
  heatmap: any;
  _xoffset: any;
  _yoffset: any;

  /**
   *
   * @param center - Cartesian3
   * @param radius - Meters
   */
  static calcCircleContainingRect(center: Cartesian3, radius: number) {
    return CesiumHeatMapMaterialCreator.calcEllipseContainingRect(center, radius, radius);
  }

  /**
   *
   * @param center - Cartesian3
   * @param semiMinorAxis - meters
   * @param semiMajorAxis - meters
   */
  static calcEllipseContainingRect(center: Cartesian3, semiMajorAxis: number, semiMinorAxis: number) {
    const top = GeoUtilsService.pointByLocationDistanceAndAzimuth(
      center,
      semiMinorAxis,
      0,
      true
    );
    const right = GeoUtilsService.pointByLocationDistanceAndAzimuth(
      center,
      semiMajorAxis,
      Math.PI / 2,
      true
    );
    const bottom = GeoUtilsService.pointByLocationDistanceAndAzimuth(
      center,
      semiMajorAxis,
      Math.PI,
      true
    );
    const left = GeoUtilsService.pointByLocationDistanceAndAzimuth(
      center,
      semiMajorAxis,
      Math.PI * 1.5,
      true
    );

    const ellipsePoints = [top, right, bottom, left];
    return Rectangle.fromCartesianArray(ellipsePoints);
  }

  /**
   *
   * @param points Cartesian3
   */
  static calculateContainingRectFromPoints(points: Cartesian3[]) {
    return Rectangle.fromCartesianArray(points);
  }


  /**  Set an array of heatmap locations
   *
   *  min:  the minimum allowed value for the data values
   *  max:  the maximum allowed value for the data values
   *  data: an array of data points in heatmap coordinates and values like {x, y, value}
   */
  setData(min: any, max: any, data: any) {
    if (data && data.length > 0 && min !== null && min !== false && max !== null && max !== false) {
      this.heatmap.setData({
        min: min,
        max: max,
        data: data
      });

      return true;
    }

    return false;
  }

  /**  Set an array of WGS84 locations
   *
   *  min:  the minimum allowed value for the data values
   *  max:  the maximum allowed value for the data values
   *  data: an array of data points in WGS84 coordinates and values like { x:lon, y:lat, value }
   */
  private setWGS84Data(min: any, max: any, data: any) {
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
  }

  /**  Convert a mercator location to the corresponding heatmap location
   *
   *  p: a WGS84 location like {x: lon, y:lat}
   */
  private mercatorPointToHeatmapPoint(p: Cartesian2) {
    const pn: any = {};

    pn.x = Math.round((p.x - this._xoffset) / this._factor + this._spacing);
    pn.y = Math.round((p.y - this._yoffset) / this._factor + this._spacing);
    pn.y = this.height - pn.y;

    return pn;
  }

  /**  Convert a WGS84 location to the corresponding heatmap location
   *
   *  p: a WGS84 location like {x:lon, y:lat}
   */
  private wgs84PointToHeatmapPoint = function (p: Cartesian2) {
    return this.mercatorPointToHeatmapPoint(this.wgs84ToMercator(p));
  };


  private createContainer(height: number, width: number) {
    const id = 'heatmap' + CesiumHeatMapMaterialCreator.containerCanvasCounter++;
    const container = document.createElement('div');
    container.setAttribute('id', id);
    container.setAttribute('style', 'width: ' + width + 'px; height: ' + height + 'px; margin: 0px; display: none;');
    document.body.appendChild(container);
    return {container, id};
  }

  /**  Convert a WGS84 location into a mercator location
   *
   *  p: the WGS84 location like {x: lon, y: lat}
   */
  private wgs84ToMercator(p: Cartesian2) {
    const mp = this.WMP.project(Cartographic.fromDegrees(p.x, p.y));
    return {
      x: mp.x,
      y: mp.y
    };
  }

  private rad2deg = function (r: number) {
    const d = r / (Math.PI / 180.0);
    return d;
  };

  /**  Convert a WGS84 bounding box into a mercator bounding box*
   *  bb: the WGS84 bounding box like {north, east, south, west}
   */
  private wgs84ToMercatorBB(bb: any) {
    // TODO validate rad or deg
    const sw = this.WMP.project(Cartographic.fromRadians(bb.west, bb.south));
    const ne = this.WMP.project(Cartographic.fromRadians(bb.east, bb.north));
    return {
      north: ne.y,
      east: ne.x,
      south: sw.y,
      west: sw.x
    };
  }

  /**  Convert a mercator bounding box into a WGS84 bounding box
   *
   *  bb: the mercator bounding box like {north, east, south, west}
   */
  private mercatorToWgs84BB(bb: any) {
    const sw = this.WMP.unproject(new Cartesian3(bb.west, bb.south));
    const ne = this.WMP.unproject(new Cartesian3(bb.east, bb.north));
    return {
      north: this.rad2deg(ne.latitude),
      east: this.rad2deg(ne.longitude),
      south: this.rad2deg(sw.latitude),
      west: this.rad2deg(sw.longitude)
    };
  }

  private setWidthAndHeight(mbb: any) {
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
  }

  /**
   * containingBoundingRect: Cesium.Rectangle like {north, east, south, west}
   * min:  the minimum allowed value for the data values
   * max:  the maximum allowed value for the data values
   * datapoint: {x,y,value}
   * heatmapOptions: a heatmap.js options object (see http://www.patrick-wied.at/static/heatmapjs/docs.html#h337-create)
   *
   */
  public create(containingBoundingRect: Rectangle, heatmapDataSet: HeatmapDataSet, heatmapOptions: HeatMapOptions) {
    const userBB = containingBoundingRect;
    const {heatPointsData, min = 0, max = 100} = heatmapDataSet;
    const finalHeatmapOptions = Object.assign({}, this.heatmapOptionsDefaults, heatmapOptions);

    this._mbounds = this.wgs84ToMercatorBB(userBB);
    this.setWidthAndHeight(this._mbounds);

    finalHeatmapOptions.radius = Math.round((heatmapOptions.radius) ?
      heatmapOptions.radius : ((this.width > this.height) ?
        this.width / this.heatmapOptionsDefaults.radiusFactor :
        this.height / this.heatmapOptionsDefaults.radiusFactor));
    this._spacing = finalHeatmapOptions.radius * this.heatmapOptionsDefaults.spacingFactor;
    this._xoffset = this._mbounds.west;
    this._yoffset = this._mbounds.south;

    this.width = Math.round(this.width + this._spacing * 2);
    this.height = Math.round(this.height + this._spacing * 2);

    this._mbounds.west -= this._spacing * this._factor;
    this._mbounds.east += this._spacing * this._factor;
    this._mbounds.south -= this._spacing * this._factor;
    this._mbounds.north += this._spacing * this._factor;

    this.bounds = this.mercatorToWgs84BB(this._mbounds);
    this._rectangle = Rectangle.fromDegrees(this.bounds.west, this.bounds.south, this.bounds.east, this.bounds.north);

    const {container, id} = this.createContainer(this.height, this.width);
    Object.assign(finalHeatmapOptions, {container});

    this.heatmap = h337.create(finalHeatmapOptions);


    this.setWGS84Data(0, 100, heatPointsData);
    const heatMapCanvas = this.heatmap._renderer.canvas;
    const heatMapMaterial = new ImageMaterialProperty({
      image: heatMapCanvas,
      transparent: true,
    });
    this.setClear(heatMapMaterial, id);

    return heatMapMaterial;
  }

  private setClear(heatMapMaterial: any, id: string) {
    heatMapMaterial.clear = () => {
      const elem = document.getElementById(id);
      return elem.parentNode.removeChild(elem);
    };
  }
}

