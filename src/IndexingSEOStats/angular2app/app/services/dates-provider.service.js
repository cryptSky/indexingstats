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
var DatesProviderService = (function () {
    function DatesProviderService() {
    }
    DatesProviderService.prototype.getDate = function (days) {
        var d = new Date();
        d.setDate(d.getDate() + days);
        return d;
    };
    DatesProviderService.prototype.getDateStat = function (domain, dayNumber) {
        var d = this.getDate(dayNumber);
        var result = this.getStatForDate(domain, d);
        return result;
    };
    DatesProviderService.prototype.numberWithCommas = function (x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };
    DatesProviderService.prototype.getStatForDate = function (domain, date) {
        var indexingData = domain.indexingStats.filter(function (st) {
            return new Date(new Date(st.processingDate).getTime() + 60000 * new Date(st.processingDate).getTimezoneOffset()).getDate() == date.getDate();
        }).pop();
        if (indexingData == undefined || indexingData == null) {
            return 'N/A';
        }
        else {
            return this.numberWithCommas(indexingData.pagesNumber);
        }
    };
    DatesProviderService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], DatesProviderService);
    return DatesProviderService;
}());
exports.DatesProviderService = DatesProviderService;
//# sourceMappingURL=dates-provider.service.js.map