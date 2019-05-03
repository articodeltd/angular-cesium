import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainNavbarComponent } from './main-navbar.component';
import { AppMaterialModule } from 'demo/app/app.material.module';
import { AngularCesiumWidgetsModule } from 'angular-cesium';
import { AppSettingsService } from 'demo/app/services/app-settings-service/app-settings-service';

describe('MainNavbarComponent', () => {
  let component: MainNavbarComponent;
  let fixture: ComponentFixture<MainNavbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppMaterialModule, AngularCesiumWidgetsModule],
      declarations: [MainNavbarComponent],
      providers: [AppSettingsService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
