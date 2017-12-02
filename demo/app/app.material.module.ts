import {
  MatButtonModule,
  MatCheckboxModule,
  MatDialogModule,
  MatIconModule,
  MatInputModule,
  MatSidenavModule,
  MatToolbarModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatTooltipModule
} from '@angular/material';
import { NgModule } from '@angular/core';

@NgModule({
  imports : [MatButtonModule, MatCheckboxModule, MatSidenavModule, MatSnackBarModule, MatTooltipModule,
    MatDialogModule, MatInputModule, MatIconModule, MatToolbarModule, MatSlideToggleModule],
  exports : [MatButtonModule, MatCheckboxModule, MatSidenavModule, MatSnackBarModule, MatTooltipModule,
    MatDialogModule, MatInputModule, MatIconModule, MatToolbarModule, MatSlideToggleModule],
})
export class AppMaterialModule {
}
