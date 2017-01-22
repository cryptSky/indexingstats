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
var core_1 = require("@angular/core");
var NewLineDirective = (function () {
    function NewLineDirective(elementRef) {
        this.elementRef = elementRef;
        this.el = this.elementRef.nativeElement;
    }
    NewLineDirective.prototype.ngOnInit = function () {
    };
    NewLineDirective.prototype.onChange = function (value) {
        this.el.value = this.splitByNewLine(value);
        //let event = new CustomEvent('change', { bubbles: true });
        //this.renderer.invokeElementMethod(this.el, 'dispatchEvent', [event]);
    };
    NewLineDirective.prototype.splitByNewLine = function (value) {
        var splitted = value.split(/[ ,;]/);
        splitted = splitted.filter(function (v) { return v.trim() != ''; });
        var result = splitted.join('\r\n');
        return result;
    };
    __decorate([
        core_1.HostListener("change", ["$event.target.value"]), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', void 0)
    ], NewLineDirective.prototype, "onChange", null);
    NewLineDirective = __decorate([
        core_1.Directive({ selector: "[newLine]" }), 
        __metadata('design:paramtypes', [core_1.ElementRef])
    ], NewLineDirective);
    return NewLineDirective;
}());
exports.NewLineDirective = NewLineDirective;
//# sourceMappingURL=newline.directive.js.map