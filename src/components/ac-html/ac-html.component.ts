import { Component, Input, ElementRef, DoCheck, OnDestroy, Renderer2 } from '@angular/core';
import { CesiumService } from '../../services/cesium/cesium.service';

/**
 *  This is an html implementation.
 *  The ac-html element must be a child ac-map element.
 *  __Usage:__
 *  ```
 *  &lt;ac-html [props]="position: position, show: true"&gt;
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
export class AcHtmlComponent implements DoCheck, OnDestroy {

  @Input() props: any;
  private isDraw = false;
  preRenderEventListener: () => void;

  constructor(private cesiumService: CesiumService, private elementRef: ElementRef, private renderer: Renderer2) {
  }

  setScreenPosition(screenPosition: any) {
    if (screenPosition) {
      this.renderer.setStyle(this.elementRef.nativeElement, 'top', `${screenPosition.y}px`);
      this.renderer.setStyle(this.elementRef.nativeElement, 'left', `${screenPosition.x}px`);
    }
  }

  remove() {
    if (this.isDraw) {
      this.isDraw = false;
      this.cesiumService.getScene().preRender.removeEventListener(this.preRenderEventListener);
      this.renderer.setStyle(this.elementRef.nativeElement, 'display', `none`);
    }
  }

  add() {
    if (!this.isDraw) {
      this.isDraw = true;
      this.preRenderEventListener = () => {
        const screenPosition = Cesium.SceneTransforms.wgs84ToWindowCoordinates(this.cesiumService.getScene(),
          this.props.position);
        this.setScreenPosition(screenPosition);
      };
      this.renderer.setStyle(this.elementRef.nativeElement, 'display', `block`);
      this.cesiumService.getScene().preRender.addEventListener(this.preRenderEventListener);
    }
  }

  ngDoCheck() {
    if (this.props.show === undefined || this.props.show) {
      this.add();
    }
    else {
      this.remove();
    }
  }

  ngOnDestroy(): void {
		this.remove();
	}
}
