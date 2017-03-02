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
var domain_interface_1 = require('../../interfaces/domain.interface');
var bootstrap_1 = require('angular2-modal/plugins/bootstrap');
var DomainsTableComponent = (function () {
    function DomainsTableComponent(_domainService, _notificaionService, _datesProvider, modal) {
        this._domainService = _domainService;
        this._notificaionService = _notificaionService;
        this._datesProvider = _datesProvider;
        this.modal = modal;
        this._domains = [];
        this._temp = [];
        this._selections = [];
        this.editing = {};
        this.val = '';
        var day = new Date();
        day.setDate(day.getDate() - 7);
        var weekAgo = day;
        this._dateRange = new domain_interface_1.DateRange(weekAgo);
    }
    DomainsTableComponent.prototype.ngOnInit = function () {
        var _this = this;
        this._domainsSubscription = this._domainService.domains$.subscribe(function (res) {
            var rows = res.slice();
            _this._domains = rows;
            _this._temp = res.slice();
        });
    };
    DomainsTableComponent.prototype.ngOnDestroy = function () {
        // prevent memory leak when component is destroyed
        this._domainsSubscription.unsubscribe();
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
        this.table.rowDetail.toggleExpandRow(row);
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
    DomainsTableComponent.prototype.cellClass = function (row, pdate) {
        var style = '';
        var prevDate = new Date(pdate);
        prevDate.setDate(prevDate.getDate() - 1);
        var prevDomainStats = this._datesProvider.getStatForDate(row, prevDate);
        var currentDomainStats = this._datesProvider.getStatForDate(row, pdate);
        if (currentDomainStats != 'N/A' && prevDomainStats != 'N/A') {
            var prevStat = parseInt(prevDomainStats.replace(/,/g, ''), 10);
            var currentStat = parseInt(currentDomainStats.replace(/,/g, ''), 10);
            if (currentStat > prevStat) {
                style = 'greater-stat';
            }
            else if (currentStat < prevStat) {
                style = 'less-stat';
            }
        }
        return style;
    };
    DomainsTableComponent.prototype.showOnGraph = function (row) {
        this._domainService.selectToDraw(row);
    };
    DomainsTableComponent.prototype.onSort = function (event) {
        var ii = 0;
    };
    DomainsTableComponent.prototype.runNow = function (row) {
        this._domainService.processDomain(row);
    };
    DomainsTableComponent.prototype.togglePauseResume = function (row) {
        this._domainService.pauseDomain(row);
    };
    DomainsTableComponent.prototype.toggleDelete = function (row) {
        var _this = this;
        var dialogBodyText = 'Are you sure you wish to delete the domain ' + row.url + ' ?';
        var deleteDialog = this.modal.confirm()
            .size('lg')
            .isBlocking(true)
            .showClose(true)
            .keyboard(27)
            .title('Delete Domain')
            .body(dialogBodyText)
            .open()
            .catch(function (err) { return console.log(err); }) // catch error not related to the result (modal open...)
            .then(function (dialog) { return dialog.result; }) // dialog has more properties,lets just return the promise for a result. 
            .then(function (result) {
            return _this._domainService.deleteDomain(row);
        }) // if were here ok was clicked.
            .catch(function (err) { return console.log("Domain deletion canceled by used"); }); // if were here it was cancelled (click or non block click)     
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
        __metadata('design:paramtypes', [domain_service_1.DomainService, notification_service_1.NotificationService, dates_provider_service_1.DatesProviderService, bootstrap_1.Modal])
    ], DomainsTableComponent);
    return DomainsTableComponent;
}());
exports.DomainsTableComponent = DomainsTableComponent;
//# sourceMappingURL=domainsTable.component.js.map