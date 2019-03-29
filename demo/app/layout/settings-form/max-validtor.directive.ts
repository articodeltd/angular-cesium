import { Directive, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator, Validators } from '@angular/forms';

@Directive({
  selector: '[validateMax]',
  providers: [
    {provide: NG_VALIDATORS, useExisting: MaxValidatorDirective, multi: true}
  ]
})
export class MaxValidatorDirective implements Validator, OnChanges {
  constructor(private element: ElementRef) {
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  validate(c: AbstractControl): { [key: string]: any; } {

    if (this.element.nativeElement.max) {
      const max = parseInt(this.element.nativeElement.max, 10);
      return Validators.max(max)(c);
    }
    return null;
  }

  registerOnValidatorChange(fn: () => void): void {
  }


}
