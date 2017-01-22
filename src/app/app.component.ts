import {Component, OnInit} from "@angular/core";
import {Parse} from "../angular2-parse/src/services/parse/parse.service";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers: [Parse]
})

export class AppComponent implements OnInit {
    constructor() {}

    ngOnInit() {}
}
