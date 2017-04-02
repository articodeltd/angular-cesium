import { Component, Input, OnInit, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { CesiumService } from '../../services/cesium/cesium.service';
import { isUndefined } from 'util';

/**
 *  This is an html implementation.
 *  The ac-html element must be a child ac-map element.
 *  __Usage:__
 *  ```
 *  &lt;ac-html [position]="position"&gt;
 *      &lt;p&gt;html element&lt;/p&gt;
 *  &lt;/ac-html&gt;
 *  ```
 */

@Component({
	selector: 'ac-html',
	template: `<ng-content></ng-content>`,
	styles: [`:host {
                position: absolute;
                z-index: 1;
				}`]
})
export class AcHtmlComponent implements OnInit, OnChanges{

	@Input() props: any = {show: true};
	private isDraw: boolean = false;
	preRenderEventListener: ()=>void;

	constructor(private cesiumService: CesiumService, private elementRef: ElementRef) {
	}

	ngOnInit():void {
		this.add();
	}

	setScreenPosition(screenPosition: any) {
		this.elementRef.nativeElement.style.top = `${screenPosition.y}px`;
		this.elementRef.nativeElement.style.left = `${screenPosition.x}px`;
	}

	remove() {
		if (!this.isDraw){
			this.isDraw = false;
			this.cesiumService.getScene().preRender.removeEventListener(this.preRenderEventListener);
			this.elementRef.nativeElement.style.display = 'none';
		}
	}

	add() {
		if (!this.isDraw) {
			this.isDraw = true;
			this.preRenderEventListener = ()=> {
				let screenPosition = Cesium.SceneTransforms.wgs84ToWindowCoordinates(this.cesiumService.getScene(),
					this.props.position);
				this.setScreenPosition(screenPosition);
			};
			this.elementRef.nativeElement.style.display = 'block';
			this.cesiumService.getScene().preRender.addEventListener(this.preRenderEventListener);
		}
	}

	ngOnChanges(changes:SimpleChanges):void {
		const props = changes['props'];
		if (isUndefined(props.currentValue.show) || props.currentValue.show) {
			this.add();
		}
		else {
			this.remove();
		}
	}
}
