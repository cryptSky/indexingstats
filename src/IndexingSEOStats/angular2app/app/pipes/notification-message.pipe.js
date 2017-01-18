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
var common_1 = require('@angular/common');
var NotificationMessagePipe = (function () {
    function NotificationMessagePipe() {
    }
    NotificationMessagePipe.prototype.transform = function (domain) {
        var last = domain.indexingStats.length - 1;
        var message = 'Domain ' + domain.url + ' has been deindexed at ' + new common_1.DatePipe("en-US").transform(domain.indexingStats[last].processingDate, 'short');
        return message;
    };
    NotificationMessagePipe = __decorate([
        core_1.Pipe({ name: 'notification' }), 
        __metadata('design:paramtypes', [])
    ], NotificationMessagePipe);
    return NotificationMessagePipe;
}());
exports.NotificationMessagePipe = NotificationMessagePipe;
//# sourceMappingURL=notification-message.pipe.js.map