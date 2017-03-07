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
var settings_service_1 = require('../../services/settings.service');
var core_1 = require('@angular/core');
var forms_1 = require('@angular/forms');
var SettingsComponent = (function () {
    function SettingsComponent(_settingsService, fb) {
        this._settingsService = _settingsService;
        this.fb = fb;
        this._proxyUrl = "";
        this.invalidIp = false;
        this.proxyUrlForm = this.fb.group({
            ip: ["", forms_1.Validators.required]
        });
    }
    SettingsComponent.prototype.ngAfterViewInit = function () {
        this.sidebarAndContentHeight();
    };
    SettingsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this._proxyUrlSubscription = this._settingsService.proxyUrl$.subscribe(function (res) {
            _this._proxyUrl = res;
        });
    };
    SettingsComponent.prototype.ngOnDestroy = function () {
        // prevent memory leak when component is destroyed
        this._proxyUrlSubscription.unsubscribe();
    };
    SettingsComponent.prototype.setProxyUrl = function (event) {
        var ip = event.value.ip.trim();
        this._settingsService.setProxyUrl(ip);
        event.reset();
    };
    SettingsComponent.prototype.validURL = function (str) {
        if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(str)) {
            return true;
        }
        else {
            return false;
        }
    };
    // Makes .page-inner height same as .page-sidebar height
    SettingsComponent.prototype.sidebarAndContentHeight = function () {
        var content = $('.page-inner'), sidebar = $('.page-sidebar'), body = $('body'), height, footerHeight = $('.page-footer').outerHeight(), pageContentHeight = $('.page-content').height();
        content.attr('style', 'min-height:' + sidebar.height() + 'px !important');
        if (body.hasClass('page-sidebar-fixed')) {
            height = sidebar.height() + footerHeight;
        }
        else {
            height = sidebar.height() + footerHeight;
            if (height < $(window).height()) {
                height = $(window).height();
            }
        }
        if (height >= content.height()) {
            content.attr('style', 'min-height:' + height + 'px !important');
        }
    };
    ;
    SettingsComponent = __decorate([
        core_1.Component({
            selector: 'settings',
            template: require('./settings.component.html')
        }), 
        __metadata('design:paramtypes', [settings_service_1.SettingsService, forms_1.FormBuilder])
    ], SettingsComponent);
    return SettingsComponent;
}());
exports.SettingsComponent = SettingsComponent;
//# sourceMappingURL=settings.component.js.map