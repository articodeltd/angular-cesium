/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from "@angular/core/testing";
import {AcLayerComponent} from "./ac-layer.component";

describe('AcLayerComponent', () => {
  let component: AcLayerComponent;
  let fixture: ComponentFixture<AcLayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcLayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcLayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
