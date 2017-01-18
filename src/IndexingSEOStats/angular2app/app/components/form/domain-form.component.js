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
var forms_1 = require('@angular/forms');
var DomainFormComponent = (function () {
    function DomainFormComponent(_domainService, _fb) {
        this._domainService = _domainService;
        this._fb = _fb;
        this.events = []; // use later to display form changes
        this.options = {
            readonly: undefined,
            placeholder: '+ Tag'
        };
    }
    DomainFormComponent.prototype.ngOnInit = function () {
        this.createForm();
    };
    DomainFormComponent.prototype.createForm = function () {
        // the short way
        this.myForm = this._fb.group({
            url: ['', [forms_1.Validators.required]],
            notes: [''],
            tags: ['']
        });
    };
    DomainFormComponent.prototype.reset = function () {
        this.createForm();
    };
    DomainFormComponent.prototype.save = function (formModel, isValid) {
        this.submitted = true; // set form submit to true
        // check if model is valid
        // if valid, call API to save customer
        var tags = formModel.tags.split('\n');
        var urls = formModel.url.split('\n');
        var notes = formModel.notes.split('\n');
        if (isValid) {
            for (var index = 0; index < urls.length; index++) {
                var domain = new domain_interface_1.Domain('', '', '', [], false, false);
                domain.url = urls[index].trim();
                domain.tags = tags[index] ? tags[index].trim() : '';
                domain.notes = notes[index] ? notes[index].trim() : '';
                this._domainService.createDomain(domain);
            }
            this.reset();
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
        __metadata('design:paramtypes', [domain_service_1.DomainService, forms_1.FormBuilder])
    ], DomainFormComponent);
    return DomainFormComponent;
}());
exports.DomainFormComponent = DomainFormComponent;
//# sourceMappingURL=domain-form.component.js.map