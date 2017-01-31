import {async, ComponentFixture, TestBed} from "@angular/core/testing";
import {AcDynamicEllipseDescComponent} from "./ac-dynamic-ellipse-desc.component";

describe('AcDynamicEllipseDescComponent', () => {
  let component: AcDynamicEllipseDescComponent;
  let fixture: ComponentFixture<AcDynamicEllipseDescComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcDynamicEllipseDescComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcDynamicEllipseDescComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
