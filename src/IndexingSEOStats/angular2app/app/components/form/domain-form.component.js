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
var domain_service_1 = require('../../services/domain.service');
var core_1 = require('@angular/core');
var domain_interface_1 = require('../../interfaces/domain.interface');
var DomainFormComponent = (function () {
    function DomainFormComponent(_domainService) {
        this._domainService = _domainService;
        this.domain = {
            url: '',
            notes: '',
            tags: ''
        };
        this.options = {
            readonly: undefined,
            placeholder: '+ Tag'
        };
    }
    DomainFormComponent.prototype.ngOnInit = function () {
    };
    DomainFormComponent.prototype.save = function (form, formModel, isValid) {
        this.submitted = true; // set form submit to true
        var tags = [];
        var notes = [];
        // check if model is valid
        // if valid, call API to save customer
        if (this.domain.tags != null) {
            tags = this.domain.tags.split(/[\n]/).filter(function (v) { return v.trim() != ''; });
        }
        if (this.domain.notes) {
            notes = this.domain.notes.split(/[\n]/).filter(function (v) { return v.trim() != ''; });
        }
        var urls = this.domain.url.split(/[ ,;\n]/).filter(function (v) { return v.trim() != ''; });
        if (isValid) {
            for (var index = 0; index < urls.length; index++) {
                var domain = new domain_interface_1.Domain('', '', '', [], false, false);
                domain.url = urls[index].trim();
                domain.tags = tags[index] ? tags[index].trim() : '';
                domain.notes = notes[index] ? notes[index].trim() : '';
                if (!this._domainService.domainExists(domain)) {
                    this._domainService.createDomain(domain);
                }
            }
            form.reset();
        }
    };
    DomainFormComponent.prototype.onAdd = function (item) {
        console.log(item + ' added');
    };
    DomainFormComponent.prototype.onRemove = function (item) {
        console.log(item + ' removed');
    };
    DomainFormComponent.prototype.onSelect = function (item) {
        console.log(item + ' selected');
    };
    DomainFormComponent.prototype.transform = function (item) {
        return "@" + item;
    };
    DomainFormComponent = __decorate([
        core_1.Component({
            selector: 'domain-form',
            template: require('./domain-form.component.html')
        }), 
        __metadata('design:paramtypes', [domain_service_1.DomainService])
    ], DomainFormComponent);
    return DomainFormComponent;
}());
exports.DomainFormComponent = DomainFormComponent;
//# sourceMappingURL=domain-form.component.js.map