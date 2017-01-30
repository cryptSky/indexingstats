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
var app_constants_1 = require('../app.constants');
var Subject_1 = require('rxjs/Subject');
var SignalRService = (function () {
    function SignalRService(_conf) {
        this._conf = _conf;
        this.proxyName = 'domainstatsender';
        this._connectionEstablished$ = new Subject_1.Subject();
        this._domainStatReceived$ = new Subject_1.Subject();
        this._domainReceived$ = new Subject_1.Subject();
        this._connectionExists = false;
        this.connection = $.hubConnection('signalr/');
        this.proxy = this.connection.createHubProxy(this.proxyName);
        this.registerOnServerEvents();
        this.startConnection();
        this.connection.disconnected(function () {
            var self = this;
            setTimeout(function () {
                self.startConnection();
            }, 5000); // Restart connection after 5 seconds.
        });
    }
    Object.defineProperty(SignalRService.prototype, "domainStatReceived$", {
        get: function () {
            return this._domainStatReceived$.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SignalRService.prototype, "domainReceived$", {
        get: function () {
            return this._domainReceived$.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SignalRService.prototype, "connectionEstablished$", {
        get: function () {
            return this._connectionEstablished$.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    SignalRService.prototype.sendDomainStat = function (domainStat) {
        this.proxy.invoke('SendDomainStat', domainStat);
    };
    SignalRService.prototype.sendDomain = function (domain) {
        this.proxy.invoke('SendDomain', domain);
    };
    SignalRService.prototype.startConnection = function () {
        var _this = this;
        this.connection.start().done(function (data) {
            console.log('Now connected ' + data.transport.name + ', connection ID= ' + data.id);
            _this._connectionExists = true;
            _this._connectionEstablished$.next(_this._connectionExists);
        }).fail(function (error) {
            console.log('Could not connect ' + error);
            _this._connectionEstablished$.next(false);
        });
    };
    SignalRService.prototype.registerOnServerEvents = function () {
        var _this = this;
        this.proxy.on('SendDomainStat', function (data) {
            console.log('received in SignalRService: ' + JSON.stringify(data));
            _this._domainStatReceived$.next(data);
        });
        this.proxy.on('SendDomain', function (data) {
            console.log('received in SignalRService: ' + JSON.stringify(data));
            _this._domainReceived$.next(data);
        });
    };
    SignalRService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [app_constants_1.Configuration])
    ], SignalRService);
    return SignalRService;
}());
exports.SignalRService = SignalRService;
//# sourceMappingURL=signalr.service.js.map