import {
  MdButtonModule,
  MdCheckboxModule,
  MdDialogModule,
  MdIconModule,
  MdInputModule,
  MdSidenavModule,
  MdToolbarModule
} from '@angular/material';
import { NgModule } from '@angular/core';

@NgModule({
  imports : [MdButtonModule, MdCheckboxModule, MdSidenavModule, MdDialogModule, MdInputModule, MdIconModule, MdToolbarModule],
  exports : [MdButtonModule, MdCheckboxModule, MdSidenavModule, MdDialogModule, MdInputModule, MdIconModule, MdToolbarModule],
})
export class AppMaterialModule {
}