import { Component } from '@angular/core';
import { faBolt, faCog, faFeatherAlt, faProjectDiagram, faTools } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'about',
  templateUrl: 'about.component.html',
  styleUrls: ['about.component.scss'],
})
export class AboutComponent {
  boltIcon = faBolt;
  cogIcon = faCog;
  featherIcon = faFeatherAlt;
  diagramIcon = faProjectDiagram;
  toolsIcon = faTools;

  constructor() {
  }
}
