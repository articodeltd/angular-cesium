/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EventTestLayerComponent } from './event-test-layer.component';

describe('EventTestLayerComponent', () => {
  let component: EventTestLayerComponent;
  let fixture: ComponentFixture<EventTestLayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventTestLayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventTestLayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
