import {
  MatButtonModule,
  MatButtonToggleModule,
  MatCheckboxModule,
  MatDialogModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatSidenavModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatToolbarModule,
  MatTooltipModule,
} from '@angular/material';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [MatButtonModule, MatCheckboxModule, MatSidenavModule, MatSnackBarModule, MatTooltipModule,
    MatButtonToggleModule,
    MatDialogModule, MatInputModule, MatIconModule, MatToolbarModule, MatSlideToggleModule, MatListModule],
  exports: [MatButtonModule, MatCheckboxModule, MatSidenavModule, MatSnackBarModule, MatTooltipModule,
    MatButtonToggleModule,
    MatDialogModule, MatInputModule, MatIconModule, MatToolbarModule, MatSlideToggleModule, MatListModule],
})
export class AppMaterialModule {
}
