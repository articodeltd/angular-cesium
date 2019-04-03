import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidenavToolbarComponent } from './sidenav-toolbar.component';

describe('SidenavToolbarComponent', () => {
  let component: SidenavToolbarComponent;
  let fixture: ComponentFixture<SidenavToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidenavToolbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidenavToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
