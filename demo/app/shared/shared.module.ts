import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidenavToolbarComponent } from './sidenav-toolbar/sidenav-toolbar.component';

@NgModule({
  imports: [CommonModule],
  exports: [CommonModule, FormsModule],
  declarations: [SidenavToolbarComponent]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule
    };
  }
}
