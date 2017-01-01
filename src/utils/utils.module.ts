import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {AsyncService} from "./services/async/async.service";

@NgModule({
    imports: [CommonModule],
    providers: [AsyncService]
})
export class UtilsModule {
}
