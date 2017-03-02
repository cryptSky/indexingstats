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
var http_1 = require('@angular/http');
require('rxjs/add/operator/map');
require('rxjs/add/operator/catch');
var BehaviorSubject_1 = require('rxjs/BehaviorSubject');
var domain_interface_1 = require('../interfaces/domain.interface');
var dates_provider_service_1 = require('./dates-provider.service');
var signalr_service_1 = require('./signalr.service');
var DomainService = (function () {
    function DomainService(http, _signalRService, _datesProviderService) {
        this.http = http;
        this._signalRService = _signalRService;
        this._datesProviderService = _datesProviderService;
        this.headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        this.domainsUrl = 'api/domains/get'; // URL to web api for all the domains
        this.createDomainUrl = 'api/domains/create'; // URL to web api for all the domains
        this.domainsUrlDateRange = 'api/domains/dates'; // URL to web api for all the domains
        this.domainUrlDateRange = 'api/domains/domain/dates';
        this.domainProcessUrl = 'api/domains/process';
        this.domainDeleteUrl = 'api/domains/delete';
        this.domainDisableUrl = 'api/domains/pause';
        this.domainsDeindexedUrl = 'api/domains/deindexed';
        this.subscribeToEvents();
        this.dataStore = {
            domains: [],
            deindexedDomains: [],
            selectedForChart: "",
            domainToDraw: null
        };
        this._domains$ = new BehaviorSubject_1.BehaviorSubject(this.dataStore.domains);
        this._deindexedDomains$ = new BehaviorSubject_1.BehaviorSubject(this.dataStore.deindexedDomains);
        this._domainToDraw$ = new BehaviorSubject_1.BehaviorSubject(this.dataStore.domainToDraw);
        this._selectedForChart$ = new BehaviorSubject_1.BehaviorSubject(this.dataStore.selectedForChart);
        this.getDomains();
        this.getDeindexedDomains();
    }
    DomainService.prototype.subscribeToEvents = function () {
        var _this = this;
        this._signalRService.domainStatReceived$.subscribe(function (domainStat) {
            var domain = _this.updateDomainStats(domainStat.domainURL, domainStat.indexingData);
            _this.updateDomainValue(domain);
            _this._domains$.next(_this.dataStore.domains);
            if (domainStat.indexingData.pagesNumber == 0) {
                _this.dataStore.deindexedDomains.push(domain);
                _this._deindexedDomains$.next(_this.dataStore.deindexedDomains);
            }
        });
        this._signalRService.domainReceived$.subscribe(function (domain) {
            _this.updateDomainValue(domain);
            _this._domains$.next(_this.dataStore.domains);
            if (domain.isDeindexed) {
                _this.dataStore.deindexedDomains.push(domain);
                _this._deindexedDomains$.next(_this.dataStore.deindexedDomains);
            }
            else {
            }
        });
    };
    Object.defineProperty(DomainService.prototype, "domains$", {
        get: function () {
            return this._domains$.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DomainService.prototype, "deindexedDomains$", {
        get: function () {
            return this._deindexedDomains$.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DomainService.prototype, "domainToDraw$", {
        get: function () {
            return this._domainToDraw$.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DomainService.prototype, "selectedDomain$", {
        /*get dateRange$() {
            return this._dateRange$.asObservable();
        }*/
        get: function () {
            return this._selectedForChart$.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    /*public dateRange() {
        return this.dataStore.dateRange;
    }*/
    DomainService.prototype.selectToDraw = function (domain) {
        this.dataStore.selectedForChart = domain.url;
        this._selectedForChart$.next(this.dataStore.selectedForChart);
    };
    DomainService.prototype.getDomains = function () {
        var _this = this;
        this.http.get(this.domainsUrl)
            .map(function (response) {
            var res = JSON.parse(response['_body']);
            var result = new Array();
            res.forEach(function (item) {
                var domain = item;
                result.push(domain);
            });
            return result;
        })
            .subscribe(function (res) {
            _this.dataStore.domains = res;
            _this._domains$.next(_this.dataStore.domains);
        }, function (error) { _this.handleError(error); });
    };
    DomainService.prototype.getDeindexedDomains = function () {
        var _this = this;
        return this.http.get(this.domainsDeindexedUrl)
            .map(function (response) {
            var res = JSON.parse(response['_body']);
            var result = new Array();
            res.forEach(function (item) {
                var domain = item;
                result.push(domain);
            });
            return result;
        })
            .subscribe(function (res) {
            _this.dataStore.deindexedDomains = res;
            _this._deindexedDomains$.next(_this.dataStore.deindexedDomains);
        }, function (error) { _this.handleError(error); });
    };
    DomainService.prototype.createDomain = function (domainDto) {
        var _this = this;
        this.http
            .post(this.createDomainUrl, JSON.stringify(domainDto), { headers: this.headers })
            .map(function (response) {
            var result = JSON.parse(response['_body']);
            var domain = result;
            return domain;
        })
            .subscribe(function (domain) {
            _this.dataStore.domains.push(domain);
            _this._domains$.next(_this.dataStore.domains);
            if (domain.isDeindexed) {
                _this.dataStore.deindexedDomains.push(domain);
                _this._deindexedDomains$.next(_this.dataStore.deindexedDomains);
            }
        }, function (error) { _this.handleError(error); });
    };
    DomainService.prototype.processDomain = function (domainDto) {
        var _this = this;
        this.http
            .post(this.domainProcessUrl, JSON.stringify(domainDto), { headers: this.headers })
            .map(function (response) {
            var result = JSON.parse(response['_body']);
            var domain = result;
            return domain;
        })
            .subscribe(function (domain) {
            _this.updateDomainValue(domain);
            _this._domains$.next(_this.dataStore.domains);
            if (domain.isDeindexed && !domainDto.isDeindexed) {
                _this.dataStore.deindexedDomains.push(domain);
                _this._deindexedDomains$.next(_this.dataStore.deindexedDomains);
            }
        }, function (error) { _this.handleError(error); });
    };
    DomainService.prototype.pauseDomain = function (domainDto) {
        var _this = this;
        this.http
            .post(this.domainDisableUrl, JSON.stringify(domainDto), { headers: this.headers })
            .map(function (response) {
            var result = JSON.parse(response['_body']);
            var domain = result;
            return domain;
        })
            .subscribe(function (domain) {
            _this.updateDomainValue(domain);
            _this._domains$.next(_this.dataStore.domains);
        }, function (error) { _this.handleError(error); });
    };
    DomainService.prototype.deleteDomain = function (domain) {
        var _this = this;
        this.http
            .post(this.domainDeleteUrl, JSON.stringify(domain), { headers: this.headers })
            .map(function (res) { return res; })
            .subscribe(function (res) {
            _this.dataStore.domains = _this.dataStore.domains.filter(function (d) { return d.url !== domain.url; });
            _this._domains$.next(_this.dataStore.domains);
            _this.dataStore.deindexedDomains = _this.dataStore.deindexedDomains.filter(function (d) { return d.url != domain.url; });
            _this._deindexedDomains$.next(_this.dataStore.deindexedDomains);
        }, function (error) { _this.handleError(error); });
    };
    DomainService.prototype.domainExists = function (domain) {
        var sameDomain = this.dataStore.domains.filter(function (d) {
            return d.url.replace(/^https?\:\/\//i, "").replace(/\/$/, "") === domain.url.replace(/^https?\:\/\//i, "").replace(/\/$/, "");
        });
        if (sameDomain != null) {
            return true;
        }
        else {
            return false;
        }
    };
    /*public setDateRange(dateRange : DateRange) {
        this.dataStore.dateRange = dateRange;
        this._dateRange$.next(this.dataStore.dateRange);
    }

    public getDomainsForDateRange() {
        this.http
            .post(this.domainsUrlDateRange, JSON.stringify(this.dataStore.dateRange), { headers: this.headers })
            .map((response) => {
                let res = JSON.parse(response['_body']);
                let result = new Array<Domain>();
                res.forEach((item) => {
                    let domain = item as Domain;
                    result.push(domain);
                });
                return result;
            })
            .subscribe((res: Array<Domain>) => {
                this.dataStore.domains = res;
                this._domains$.next(this.dataStore.domains);
            },
            error => { this.handleError(error) });
    }

    public getGetStatsForPeriod(domain: Domain, range: DateRange) : Observable<Array<IndexingData>> {
        let toSend = JSON.stringify({
                domain: domain,
                range: range
        });
        return this.http
            .post(this.domainUrlDateRange, JSON.stringify(this.dataStore.dateRange), { headers: this.headers })
            .map((response) => {
                let res = JSON.parse(response['_body']);
                let result = new Array<Domain>();
                res.forEach((item) => {
                    let domain = item as Domain;
                    result.push(domain);
                });
                return result;
            })
            .catch(this.handleError);
    }*/
    DomainService.prototype.handleError = function (error) {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    };
    DomainService.prototype.updateDomainStats = function (domainUrl, indexingData) {
        for (var i = 0; i < this.dataStore.domains.length; i++) {
            if (this.dataStore.domains[i].url == domainUrl) {
                var domain = new domain_interface_1.Domain(this.dataStore.domains[i].url, this.dataStore.domains[i].notes, this.dataStore.domains[i].tags, this.dataStore.domains[i].indexingStats, this.dataStore.domains[i].isDeindexed, this.dataStore.domains[i].isDisabled);
                if (this._datesProviderService.getStatForDate(domain, new Date()) != 'N/A') {
                    domain.indexingStats.pop();
                    domain.indexingStats.push(indexingData);
                }
                else {
                    domain.indexingStats.push(indexingData);
                }
                this.dataStore.domains[i] = domain;
                return domain;
            }
        }
    };
    DomainService.prototype.updateDomainValue = function (value) {
        for (var i = 0; i < this.dataStore.domains.length; i++) {
            if (this.dataStore.domains[i].url == value.url) {
                this.dataStore.domains[i] = value;
                break; //Stop this loop, we found it!
            }
        }
    };
    DomainService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http, signalr_service_1.SignalRService, dates_provider_service_1.DatesProviderService])
    ], DomainService);
    return DomainService;
}());
exports.DomainService = DomainService;
//# sourceMappingURL=domain.service.js.map