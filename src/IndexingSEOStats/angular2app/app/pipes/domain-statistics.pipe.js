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
var dates_provider_service_1 = require('../services/dates-provider.service');
var DomainStatisticsPipe = (function () {
    function DomainStatisticsPipe(_datesProvider) {
        this._datesProvider = _datesProvider;
    }
    DomainStatisticsPipe.prototype.transform = function (domain, date) {
        var result = this._datesProvider.getStatForDate(domain, date);
        return result;
    };
    DomainStatisticsPipe = __decorate([
        core_1.Pipe({ name: 'domainStats' }), 
        __metadata('design:paramtypes', [dates_provider_service_1.DatesProviderService])
    ], DomainStatisticsPipe);
    return DomainStatisticsPipe;
}());
exports.DomainStatisticsPipe = DomainStatisticsPipe;
//# sourceMappingURL=domain-statistics.pipe.js.map