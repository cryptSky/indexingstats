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
var SettingsService = (function () {
    function SettingsService(http) {
        this.http = http;
        this.headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        this.getProxyUrlUrl = 'api/settings/getProxyUrl';
        this.setProxyUrlUrl = 'api/settings/setProxyUrl';
        this.dataStore = {
            proxyUrl: ""
        };
        this._proxyUrl$ = new BehaviorSubject_1.BehaviorSubject(this.dataStore.proxyUrl);
        this.getProxyUrl();
    }
    Object.defineProperty(SettingsService.prototype, "proxyUrl$", {
        get: function () {
            return this._proxyUrl$.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    SettingsService.prototype.getProxyUrl = function () {
        var _this = this;
        this.http.get(this.getProxyUrlUrl)
            .map(function (response) {
            var res = JSON.parse(response['_body']);
            return res.proxy;
        })
            .subscribe(function (res) {
            _this.dataStore.proxyUrl = res;
            _this._proxyUrl$.next(_this.dataStore.proxyUrl);
        }, function (error) { _this.handleError(error); });
    };
    SettingsService.prototype.setProxyUrl = function (url) {
        var _this = this;
        this.http
            .post(this.setProxyUrlUrl, JSON.stringify(url), { headers: this.headers })
            .map(function (response) {
            var result = JSON.parse(response['_body']);
            var proxyUrl = result.proxy;
            return proxyUrl;
        })
            .subscribe(function (proxyUrl) {
            _this.dataStore.proxyUrl = proxyUrl;
            _this._proxyUrl$.next(_this.dataStore.proxyUrl);
        }, function (error) { _this.handleError(error); });
    };
    SettingsService.prototype.handleError = function (error) {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    };
    SettingsService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], SettingsService);
    return SettingsService;
}());
exports.SettingsService = SettingsService;
//# sourceMappingURL=settings.service.js.map