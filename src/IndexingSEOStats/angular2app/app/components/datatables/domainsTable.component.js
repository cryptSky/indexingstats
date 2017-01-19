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
//our root app component
var core_1 = require('@angular/core');
var domain_service_1 = require('../../services/domain.service');
var notification_service_1 = require('../../services/notification.service');
var dates_provider_service_1 = require('../../services/dates-provider.service');
var DomainsTableComponent = (function () {
    function DomainsTableComponent(_domainService, _notificaionService, _datesProvider) {
        this._domainService = _domainService;
        this._notificaionService = _notificaionService;
        this._datesProvider = _datesProvider;
        this._domains = [];
        this._temp = [];
        this._selections = [];
        this.editing = {};
        this.val = '';
    }
    DomainsTableComponent.prototype.ngOnInit = function () {
        var _this = this;
        this._domainsSubscription = this._domainService.domains$.subscribe(function (res) {
            _this._domains.splice(0, _this._domains.length);
            (_a = _this._domains).push.apply(_a, res);
            _this._temp = res.slice();
            var _a;
        });
        this._datesSubscription = this._domainService.dateRange$.subscribe(function (res) {
            //this._domainService.getDomainsForDateRange();
            _this._dateRange = res;
        });
    };
    DomainsTableComponent.prototype.ngOnDestroy = function () {
        // prevent memory leak when component is destroyed
        this._domainsSubscription.unsubscribe();
        this._datesSubscription.unsubscribe();
    };
    DomainsTableComponent.prototype.updateFilter = function (val) {
        // remove existing
        this._domains.splice(0, this._domains.length);
        // filter our data
        var temp = this._temp.filter(function (d) {
            return d.url.toLowerCase().indexOf(val) !== -1 || d.tags.toLowerCase().indexOf(val) !== -1 ||
                d.notes.toLowerCase().indexOf(val) !== -1 || !val;
        });
        // update the rows
        (_a = this._domains).push.apply(_a, temp);
        var _a;
    };
    DomainsTableComponent.prototype.onSelectionChange = function (selected) {
        console.log('Selection!', selected);
    };
    DomainsTableComponent.prototype.toggleExpandRow = function (row) {
        this.table.toggleExpandRow(row);
    };
    DomainsTableComponent.prototype.paged = function (event) {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(function () {
            console.log('paged!', event);
        }, 100);
    };
    DomainsTableComponent.prototype.updateValue = function (event, cell, cellValue, row) {
        this.editing[row.$$index] = false;
        console.log('ev', event);
        this._domains[row.$$index][cell] = event.target.value;
    };
    DomainsTableComponent.prototype.showOnGraph = function (row) {
        this._domainService.selectToDraw(row);
    };
    DomainsTableComponent.prototype.runNow = function (row) {
        this._domainService.processDomain(row);
    };
    DomainsTableComponent.prototype.togglePauseResume = function (row) {
        this._domainService.pauseDomain(row);
    };
    DomainsTableComponent.prototype.toggleDelete = function (row) {
        this._domainService.deleteDomain(row);
    };
    __decorate([
        core_1.ViewChild('domainsTable'), 
        __metadata('design:type', Object)
    ], DomainsTableComponent.prototype, "table", void 0);
    DomainsTableComponent = __decorate([
        core_1.Component({
            selector: 'domains-table',
            template: require('./domainsTable.component.html'),
            providers: [dates_provider_service_1.DatesProviderService],
            encapsulation: core_1.ViewEncapsulation.None
        }), 
        __metadata('design:paramtypes', [domain_service_1.DomainService, notification_service_1.NotificationService, dates_provider_service_1.DatesProviderService])
    ], DomainsTableComponent);
    return DomainsTableComponent;
}());
exports.DomainsTableComponent = DomainsTableComponent;
//# sourceMappingURL=domainsTable.component.js.map