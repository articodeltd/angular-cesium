import {
  MdButtonModule,
  MdCheckboxModule,
  MdDialogModule,
  MdIconModule,
  MdInputModule,
  MdSidenavModule,
  MdToolbarModule,
  MdSlideToggleModule,
  MdSnackBarModule
} from '@angular/material';
import { NgModule } from '@angular/core';

@NgModule({
  imports : [MdButtonModule, MdCheckboxModule, MdSidenavModule, MdSnackBarModule,
    MdDialogModule, MdInputModule, MdIconModule, MdToolbarModule, MdSlideToggleModule],
  exports : [MdButtonModule, MdCheckboxModule, MdSidenavModule, MdSnackBarModule,
    MdDialogModule, MdInputModule, MdIconModule, MdToolbarModule, MdSlideToggleModule],
})
export class AppMaterialModule {
}
