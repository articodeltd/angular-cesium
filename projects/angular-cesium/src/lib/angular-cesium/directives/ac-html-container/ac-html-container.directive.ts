import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { AcHtmlManager } from '../../services/ac-html-manager/ac-html-manager.service';

@Directive({
  selector: '[acHtmlContainer]'
})
export class AcHtmlContainerDirective implements OnInit {

  private _id: any;

  constructor(
    private _element: ElementRef,
    private _acHtmlManager: AcHtmlManager
  ) {
  }

  @Input()
  set acHtmlContainer(id: string) {
    this._id = id;
  }

  ngOnInit() {
    if (this._id === undefined) {
      throw new Error(`AcHtml container ERROR: entity id not defined`);
    }

    const entity = this._acHtmlManager.get(this._id);
    entity.primitive.element = this._element.nativeElement;
  }
}
