import { NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpModule, JsonpModule } from '@angular/http';
import { Configuration } from './app.constants';

import { routing, appRoutingProviders } from './app.routes';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component'
import { DashboardComponent } from './components/dashboard/dashboard.component';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { DomainsTableComponent } from './components/datatables/domainsTable.component';
import { DomainsChartComponent } from './components/charts/domainsChart.component';
import { DomainFormComponent } from './components/form/domain-form.component';
import { NotifiationsComponent } from './components/notifications/notification.component';

import { DomainStatisticsPipe } from './pipes/domain-statistics.pipe';
import { DatesInRangePipe } from './pipes/dates-in-range.pipe';
import { NotificationMessagePipe } from './pipes/notification-message.pipe';
import { CommasPipe } from './pipes/commas.pipe';

import { DomainService } from './services/domain.service';
import { NotificationService } from './services/notification.service';
import { SignalRService } from './services/signalr.service';
import { DatesProviderService } from './services/dates-provider.service';

@NgModule({
    bootstrap: [ AppComponent ],
    declarations: [
        AppComponent,
        DashboardComponent,
        DomainsTableComponent,
        DomainsChartComponent,
        DomainFormComponent,
        NotifiationsComponent,
        DomainStatisticsPipe,
        DatesInRangePipe,
        NotificationMessagePipe,
        CommasPipe
    ],
    imports: [
        BrowserModule,
        routing,
        HttpModule,
        JsonpModule,
        ReactiveFormsModule,
        FormsModule,
        NgxDatatableModule
    ],
    
    providers: [
        appRoutingProviders,
        Configuration,
        SignalRService,
        DomainService,
        NotificationService,
        DatesProviderService
    ],
})

export class AppModule {
 
}


