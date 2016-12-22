/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TracksLayerComponent } from './tracks-layer.component';

describe('TracksLayerComponent', () => {
  let component: TracksLayerComponent;
  let fixture: ComponentFixture<TracksLayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TracksLayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TracksLayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
