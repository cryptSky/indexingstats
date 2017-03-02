import { NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpModule, JsonpModule } from '@angular/http';
import { Configuration } from './app.constants';

import { routing, appRoutingProviders } from './app.routes';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component'
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SettingsComponent } from './components/settings/settings.component';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { DomainsTableComponent } from './components/datatables/domainsTable.component';
import { DomainsChartComponent } from './components/charts/domainsChart.component';
import { DomainFormComponent } from './components/form/domain-form.component';
import { NotifiationsComponent } from './components/notifications/notification.component';
import { StatsComponent } from './components/stats/stats.component';

import { DomainStatisticsPipe } from './pipes/domain-statistics.pipe';
import { DatesInRangePipe } from './pipes/dates-in-range.pipe';
import { NotificationMessagePipe } from './pipes/notification-message.pipe';
import { CommasPipe } from './pipes/commas.pipe';

import { DomainService } from './services/domain.service';
import { SettingsService } from './services/settings.service';
import { NotificationService } from './services/notification.service';
import { SignalRService } from './services/signalr.service';
import { DatesProviderService } from './services/dates-provider.service';
import { NewLineDirective } from './directives/newline.directive';

import { ModalModule } from 'angular2-modal';
import { BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';

@NgModule({
    bootstrap: [ AppComponent ],
    declarations: [
        AppComponent,
        DashboardComponent,
        SettingsComponent,
        StatsComponent,
        DomainsTableComponent,
        DomainsChartComponent,
        DomainFormComponent,
        NotifiationsComponent,
        DomainStatisticsPipe,
        DatesInRangePipe,
        NotificationMessagePipe,
        CommasPipe,
        NewLineDirective
    ],
    imports: [
        BrowserModule,
        routing,
        HttpModule,
        JsonpModule,
        ReactiveFormsModule,
        FormsModule,
        NgxDatatableModule,
        ModalModule.forRoot(),
        BootstrapModalModule
    ],
    
    providers: [
        appRoutingProviders,
        Configuration,
        SignalRService,
        DomainService,
        SettingsService,
        NotificationService,
        DatesProviderService
    ],
})

export class AppModule {
 
}


