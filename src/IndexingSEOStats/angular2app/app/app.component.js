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
var dashboard_component_1 = require('./components/dashboard/dashboard.component');
var angular2_modal_1 = require('angular2-modal');
var AppComponent = (function () {
    function AppComponent(overlay, vcRef) {
        overlay.defaultViewContainer = vcRef;
    }
    AppComponent = __decorate([
        core_1.NgModule({
            declarations: [dashboard_component_1.DashboardComponent]
        }),
        core_1.Component({
            selector: 'app',
            template: require('./app.component.html'),
        }), 
        __metadata('design:paramtypes', [angular2_modal_1.Overlay, core_1.ViewContainerRef])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map