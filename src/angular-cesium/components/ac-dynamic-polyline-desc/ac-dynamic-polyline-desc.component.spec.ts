/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from "@angular/core/testing";
import {AcDynamicPolylineDescComponent} from "./ac-dynamic-polyline-desc.component";

describe('AcBillboradDescComponent', () => {
  let component: AcDynamicPolylineDescComponent;
  let fixture: ComponentFixture<AcDynamicPolylineDescComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcDynamicPolylineDescComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcDynamicPolylineDescComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
