import { Component, Input, OnInit, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { CesiumService } from '../../services/cesium/cesium.service';

/**
 *  This is a label implementation.
 *  The ac-label element must be a child ac-map element.
 *  The properties of props are the same as the properties of label:
 *  https://cesiumjs.org/Cesium/Build/Documentation/Label.html
 *  __Usage:__
 *  ```
 *  &lt;ac-label [props]="{position: position,
 *                         text: 'labelText',
 *                         font: '30px sans-serif',
 *                         fillColor : aquamarine}"
 *  &gt;
 *  &lt;/ac-label&gt;
 *  ```
 */

@Component({
	selector: 'ac-html',
	template: `<ng-content></ng-content>`,
	styleUrls: ['ac-html.component.css']
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
