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
var domain_service_1 = require('../../services/domain.service');
var NotifiationsComponent = (function () {
    function NotifiationsComponent(_domainService) {
        this._domainService = _domainService;
        this._deindexedDomains = [];
    }
    NotifiationsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this._domainsSubscription = this._domainService.deindexedDomains$.subscribe(function (res) {
            _this._deindexedDomains.splice(0, _this._deindexedDomains.length);
            (_a = _this._deindexedDomains).push.apply(_a, res);
            var _a;
        });
    };
    NotifiationsComponent.prototype.toggleDelete = function (domain) {
        //this._notificationService.deleteNotification(domain);
        this._deindexedDomains = this._deindexedDomains.filter(function (d) { return d.url != domain.url; });
    };
    NotifiationsComponent.prototype.toggleDeleteAll = function () {
        this._deindexedDomains = [];
    };
    NotifiationsComponent = __decorate([
        core_1.Component({
            selector: 'notifications',
            template: require('./notification.component.html')
        }), 
        __metadata('design:paramtypes', [domain_service_1.DomainService])
    ], NotifiationsComponent);
    return NotifiationsComponent;
}());
exports.NotifiationsComponent = NotifiationsComponent;
//# sourceMappingURL=notification.component.js.map