import { Component, Input, OnInit, ElementRef, DoCheck } from '@angular/core';
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
export class AcHtmlComponent implements OnInit, DoCheck {

  @Input() props: any;
  private isDraw = false;
  preRenderEventListener: () => void;

  constructor(private cesiumService: CesiumService, private elementRef: ElementRef) {
  }

  ngOnInit(): void {
  }

  setScreenPosition(screenPosition: any) {
    this.elementRef.nativeElement.style.top = `${screenPosition.y}px`;
    this.elementRef.nativeElement.style.left = `${screenPosition.x}px`;
  }

  remove() {
    if (this.isDraw) {
      this.isDraw = false;
      this.cesiumService.getScene().preRender.removeEventListener(this.preRenderEventListener);
      this.elementRef.nativeElement.style.display = 'none';
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
      this.elementRef.nativeElement.style.display = 'block';
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
}
