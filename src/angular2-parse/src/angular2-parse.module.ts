import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Parse } from './services/parse/parse.service';

@NgModule({
	imports: [CommonModule],
	providers: [Parse]
})
export class Angular2ParseModule {
}
