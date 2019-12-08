import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
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
