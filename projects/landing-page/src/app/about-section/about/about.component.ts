import { Component } from "@angular/core";
import { faBolt } from '@fortawesome/free-solid-svg-icons';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { faFeatherAlt } from '@fortawesome/free-solid-svg-icons';
import { faProjectDiagram } from '@fortawesome/free-solid-svg-icons';
import { faTools } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: "about",
  templateUrl: "about.component.html",
  styleUrls: ["about.component.scss"],
})
export class AboutComponent {
  boltIcon = faBolt;
  cogIcon = faCog;
  featherIcon = faFeatherAlt;
  diagramIcon = faProjectDiagram;
  toolsIcon = faTools;

  constructor() {}
}
