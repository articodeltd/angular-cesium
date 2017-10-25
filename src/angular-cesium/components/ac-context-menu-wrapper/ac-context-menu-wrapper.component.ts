import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { ContextMenuService } from '../../services/context-menu/context-menu.service';
import { Subscription } from 'rxjs/Subscription';
import { BasicContextMenu } from '../../models/basic-context-menu';

/**
 * This component is used to inject the component that is passed to the ContextMenuService when opening a context menu.
 * It shouldn't be used directly.
 */

@Component({
  selector: 'ac-context-menu-wrapper',
  template: `
      <ac-html *ngIf="contextMenuService.showContextMenu" [props]="{position: contextMenuService.position}">
          <div #contextMenuContainer></div>
      </ac-html>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AcContextMenuWrapperComponent implements OnInit, OnDestroy {

  private contextMenuChangeSubscription: Subscription;
  private contextMenuOpenSubscription: Subscription;

  @ViewChild('contextMenuContainer', { read: ViewContainerRef }) viewContainerRef: ViewContainerRef;

  constructor(public contextMenuService: ContextMenuService,
              private cd: ChangeDetectorRef,
              private componentFactoryResolver: ComponentFactoryResolver) {
  }

  ngOnInit() {
    this.contextMenuChangeSubscription =
      this.contextMenuService.contextMenuChangeNotifier.subscribe(() => this.cd.detectChanges());
    this.contextMenuOpenSubscription =
      this.contextMenuService.onOpen.subscribe(() => {
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.contextMenuService.content);
        this.viewContainerRef.clear();
        const componentRef = this.viewContainerRef.createComponent(componentFactory);
        (componentRef.instance as BasicContextMenu).data = this.contextMenuService.options.data;
        this.cd.detectChanges();
      })
  }

  ngOnDestroy(): void {
    if (this.contextMenuChangeSubscription) {
      this.contextMenuChangeSubscription.unsubscribe();
    }

    if (this.contextMenuOpenSubscription) {
      this.contextMenuOpenSubscription.unsubscribe();
    }
  }
}
