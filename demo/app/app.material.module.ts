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
  MatTooltipModule,
  MatListModule,
} from '@angular/material';
import { NgModule } from '@angular/core';

@NgModule({
  imports : [MatButtonModule, MatCheckboxModule, MatSidenavModule, MatSnackBarModule, MatTooltipModule,
    MatDialogModule, MatInputModule, MatIconModule, MatToolbarModule, MatSlideToggleModule, MatListModule],
  exports : [MatButtonModule, MatCheckboxModule, MatSidenavModule, MatSnackBarModule, MatTooltipModule,
    MatDialogModule, MatInputModule, MatIconModule, MatToolbarModule, MatSlideToggleModule, MatListModule],
})
export class AppMaterialModule {
}
