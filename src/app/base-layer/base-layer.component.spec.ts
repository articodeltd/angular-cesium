/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BaseLayerComponent } from './base-layer.component';

describe('BaseLayerComponent', () => {
  let component: BaseLayerComponent;
  let fixture: ComponentFixture<BaseLayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaseLayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseLayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
