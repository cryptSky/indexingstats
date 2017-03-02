import { Component, NgModule, ViewEncapsulation, ViewContainerRef } from '@angular/core';
import { DashboardComponent } from './components/dashboard/dashboard.component';

import { Overlay } from 'angular2-modal';
import { Modal } from 'angular2-modal/plugins/bootstrap';

@NgModule({
    declarations: [DashboardComponent]
})

@Component({
    selector: 'app',
    template: require('./app.component.html'),

})

export class AppComponent { 

  constructor(overlay: Overlay, vcRef: ViewContainerRef) {
    overlay.defaultViewContainer = vcRef;
  }

}
