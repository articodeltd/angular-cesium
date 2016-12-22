import {
  Component, OnInit, Input, ChangeDetectionStrategy, ChangeDetectorRef, OnChanges,
  SimpleChange, SimpleChanges
} from '@angular/core';
import {Observable} from "rxjs";
import {BillboardDrawerService} from "../../services/billboard-drawer/billboard-drawer.service";

@Component({
  selector: 'ac-billboard',
  templateUrl: './ac-billboard.component.html',
  styleUrls: ['./ac-billboard.component.css']
})
export class AcBillboardComponent implements OnChanges {

  @Input()
  props: Object;

  private key: any = Symbol();

  constructor(private billboardDrawer: BillboardDrawerService) {
  }

  ngOnChanges(changes : SimpleChanges){
    const props = changes['props'];
    if(props.currentValue !== props.previousValue){
      this.billboardDrawer.update(this.key, props.currentValue);
    }
  }

}
