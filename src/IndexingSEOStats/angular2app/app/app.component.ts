import './app.loader';
import { Component, NgModule, ViewEncapsulation } from '@angular/core';
import { DashboardComponent } from './components/dashboard/dashboard.component';

@NgModule({
    declarations: [DashboardComponent]
})

@Component({
    selector: 'app',
    template: require('./app.component.html'),
    styles: [require('./app.component.css')],

})

export class AppComponent { }
