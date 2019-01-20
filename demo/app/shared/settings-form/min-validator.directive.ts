import { Directive, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator, Validators } from '@angular/forms';

@Directive({
  selector: '[validateMin]',
  providers: [
    {provide: NG_VALIDATORS, useExisting: MinValidatorDirective, multi: true}
  ]
})
export class MinValidatorDirective implements Validator, OnChanges {
  constructor(private element: ElementRef) {
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  validate(c: AbstractControl): { [key: string]: any; } {
    if (this.element.nativeElement.min) {
      const min = parseInt(this.element.nativeElement.min, 10);
      return Validators.min(min)(c);
    }
    return null;
  }

  registerOnValidatorChange(fn: () => void): void {
  }


}
