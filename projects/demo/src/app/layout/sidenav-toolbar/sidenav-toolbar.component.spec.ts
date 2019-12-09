import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidenavToolbarComponent } from './sidenav-toolbar.component';
import { AppMaterialModule } from 'demo/app/app.material.module';
import { AppSettingsService } from 'demo/app/services/app-settings-service/app-settings-service';

describe('SidenavToolbarComponent', () => {
  let component: SidenavToolbarComponent;
  let fixture: ComponentFixture<SidenavToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppMaterialModule],
      declarations: [SidenavToolbarComponent],
      providers: [AppSettingsService]
    }).compileComponents();
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
