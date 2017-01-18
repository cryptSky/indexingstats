"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var platform_browser_1 = require('@angular/platform-browser');
var http_1 = require('@angular/http');
var app_constants_1 = require('./app.constants');
var app_routes_1 = require('./app.routes');
var forms_1 = require('@angular/forms');
var app_component_1 = require('./app.component');
var dashboard_component_1 = require('./components/dashboard/dashboard.component');
var ngx_datatable_1 = require('@swimlane/ngx-datatable');
var domainsTable_component_1 = require('./components/datatables/domainsTable.component');
var domainsChart_component_1 = require('./components/charts/domainsChart.component');
var domain_form_component_1 = require('./components/form/domain-form.component');
var notification_component_1 = require('./components/notifications/notification.component');
var domain_statistics_pipe_1 = require('./pipes/domain-statistics.pipe');
var dates_in_range_pipe_1 = require('./pipes/dates-in-range.pipe');
var notification_message_pipe_1 = require('./pipes/notification-message.pipe');
var commas_pipe_1 = require('./pipes/commas.pipe');
var domain_service_1 = require('./services/domain.service');
var notification_service_1 = require('./services/notification.service');
var signalr_service_1 = require('./services/signalr.service');
var dates_provider_service_1 = require('./services/dates-provider.service');
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            bootstrap: [app_component_1.AppComponent],
            declarations: [
                app_component_1.AppComponent,
                dashboard_component_1.DashboardComponent,
                domainsTable_component_1.DomainsTableComponent,
                domainsChart_component_1.DomainsChartComponent,
                domain_form_component_1.DomainFormComponent,
                notification_component_1.NotifiationsComponent,
                domain_statistics_pipe_1.DomainStatisticsPipe,
                dates_in_range_pipe_1.DatesInRangePipe,
                notification_message_pipe_1.NotificationMessagePipe,
                commas_pipe_1.CommasPipe
            ],
            imports: [
                platform_browser_1.BrowserModule,
                app_routes_1.routing,
                http_1.HttpModule,
                http_1.JsonpModule,
                forms_1.ReactiveFormsModule,
                forms_1.FormsModule,
                ngx_datatable_1.NgxDatatableModule
            ],
            providers: [
                app_routes_1.appRoutingProviders,
                app_constants_1.Configuration,
                signalr_service_1.SignalRService,
                domain_service_1.DomainService,
                notification_service_1.NotificationService,
                dates_provider_service_1.DatesProviderService
            ],
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map