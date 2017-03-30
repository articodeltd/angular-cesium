import { Component, Input, OnInit, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { CesiumService } from '../../services/cesium/cesium.service';

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

	@Input() position: any;
	preRenderEventListener: ()=>void;
	private selfElementIsDraw: boolean;

	constructor(private cesiumService: CesiumService, private elementRef: ElementRef) {
		this.selfElementIsDraw = false;
	}

	ngOnInit():void {
		this.add();
	}

	setScreenPosition(screenPosition: any) {
		this.elementRef.nativeElement.style.display = 'block';
		this.elementRef.nativeElement.style.top = `${screenPosition.y}px`;
		this.elementRef.nativeElement.style.left = `${screenPosition.x}px`;
	}

	remove() {
		this.cesiumService.getScene().preRender.removeEventListener(this.preRenderEventListener);
		this.elementRef.nativeElement.style.display = 'none';
		this.selfElementIsDraw = false;
	}

	add() {
		this.preRenderEventListener = ()=> {
			let screenPosition = Cesium.SceneTransforms.wgs84ToWindowCoordinates(this.cesiumService.getScene(), this.position);
			this.setScreenPosition(screenPosition);
		};

		this.cesiumService.getScene().preRender.addEventListener(this.preRenderEventListener);
		this.selfElementIsDraw = true;
	}

	update() {
		this.remove();
		this.add();
	}

	ngOnChanges(changes:SimpleChanges):void {
		const position = changes['position'];
		if (position.currentValue !== position.previousValue && this.selfElementIsDraw) {
			this.update();
		}
	}
}
