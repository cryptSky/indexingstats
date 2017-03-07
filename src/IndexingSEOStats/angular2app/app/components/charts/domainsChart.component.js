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
var domain_service_1 = require('../../services/domain.service');
var domain_interface_1 = require('../../interfaces/domain.interface');
var DomainsChartComponent = (function () {
    function DomainsChartComponent(_elem, _renderer, _domainsService) {
        this._elem = _elem;
        this._renderer = _renderer;
        this._domainsService = _domainsService;
        this._domains = [];
        this._selectedDomain = "";
        this._chartData = [];
    }
    DomainsChartComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        var self = this;
        this._domainsSubscription = this._domainsService.domains$.subscribe(function (data) {
            _this._domains = data;
            if (AmCharts.isReady) {
                self.createStockChart(data);
            }
            else {
                AmCharts.ready(function () { return self.createStockChart(data); });
            }
        });
        this._selectedDomainSubscription = this._domainsService.selectedDomain$.subscribe(function (url) {
            if (url != "") {
                _this._selectedDomain = url.replace(/^https?\:\/\//i, "").replace(/\/$/, "");
                var elementPos = _this.chart.dataSets.map(function (x) { return x.title; }).indexOf(_this._selectedDomain);
                var dataSelectorElem = _this._elem.nativeElement.querySelector('.amcharts-data-set-select');
                _this._renderer.setElementProperty(dataSelectorElem, "selectedIndex", elementPos);
                var event_1 = new CustomEvent('change', { bubbles: true });
                _this._renderer.invokeElementMethod(dataSelectorElem, 'dispatchEvent', [event_1]);
            }
        });
    };
    DomainsChartComponent.prototype.ngOnInit = function () {
        var _this = this;
        this._domainsSubscription = this._domainsService.domainToDraw$.subscribe(function (res) {
            if (res != null) {
                _this.addDomainDataSet(res);
            }
        });
    };
    DomainsChartComponent.prototype.ngOnDestroy = function () {
        // prevent memory leak when component is destroyed
        this._domainsSubscription.unsubscribe();
        this._selectedDomainSubscription.unsubscribe();
    };
    DomainsChartComponent.prototype.createStockChart = function (data) {
        var dataSets = [];
        for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
            var domain = data_1[_i];
            var dataSet = this.getDomainDataset(domain);
            dataSets.push(dataSet);
        }
        this.chart = AmCharts.makeChart("chartdiv", {
            "type": "stock",
            "theme": "light",
            "dataSets": dataSets,
            "categoryField": "processingDate",
            "panels": [{
                    "showCategoryAxis": true,
                    "categoryAxis": {
                        "dateFormats": [{
                                period: 'fff',
                                format: 'JJ:NN:SS'
                            }, {
                                period: 'ss',
                                format: 'JJ:NN:SS'
                            }, {
                                period: 'mm',
                                format: 'JJ:NN'
                            }, {
                                period: 'hh',
                                format: 'JJ:NN'
                            }, {
                                period: 'DD',
                                format: 'MMM DD'
                            }, {
                                period: 'WW',
                                format: 'MMM DD'
                            }, {
                                period: 'MM',
                                format: 'MMM DD'
                            }, {
                                period: 'YYYY',
                                format: 'YYYY'
                            }]
                    },
                    "title": "Value",
                    "percentHeight": 70,
                    "stockGraphs": [{
                            "id": "g1",
                            "valueField": "value",
                            "comparable": true,
                            "compareField": "value",
                            "balloonFunction": function (graphDataItem, graph) {
                                console.log(graphDataItem);
                                var value = graphDataItem.values.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                var category = graphDataItem.category;
                                var key = AmCharts.formatDate(category, "EEEE, MMM DD, YYYY");
                                var result = key + "<br>Indexed Pages: " + value;
                                return result;
                            },
                            "compareGraphBalloonText": "<b>[[value]]</b>",
                            "bullet": "round",
                            "bulletSize": 4,
                            "lineThickness": 1
                        }],
                }],
            "chartScrollbarSettings": {
                "graph": "g1"
            },
            "chartCursorSettings": {
                "valueBalloonsEnabled": true,
                "fullWidth": true,
                "cursorAlpha": 0.1,
                "valueLineBalloonEnabled": false,
                "valueLineEnabled": false,
                "valueLineAlpha": 0.5
            },
            "periodSelector": {
                "position": "left",
                "width": 250,
                "periods": [{
                        "period": "DD",
                        "selected": true,
                        "count": 10,
                        "label": "10 days"
                    },
                    {
                        "period": "MM",
                        "count": 1,
                        "label": "1 month"
                    }, {
                        "period": "YYYY",
                        "count": 1,
                        "label": "1 year"
                    }, {
                        "period": "YTD",
                        "label": "YTD"
                    }, {
                        "period": "MAX",
                        "label": "MAX"
                    }],
            },
            "dataSetSelector": {
                "position": "left",
                "width": 250
            },
            "export": {
                "enabled": true
            },
            "responsive": {
                "enabled": true
            }
        });
    };
    // generate some random data, quite different range
    DomainsChartComponent.prototype.generateChartData = function () {
        var initData = new domain_interface_1.IndexingData(new Date(), 0);
        this._chartData.push([initData]);
    };
    DomainsChartComponent.prototype.getDomainDataset = function (domain) {
        var dataset = {
            "title": domain.url.replace(/^https?\:\/\//i, "").replace(/\/$/, ""),
            "fieldMappings": [
                {
                    "fromField": "pagesNumber",
                    "toField": "value"
                }, {
                    "fromField": "pagesNumber",
                    "toField": "volume"
                }],
            "dataProvider": domain.indexingStats,
            "categoryField": "processingDate"
        };
        return dataset;
    };
    DomainsChartComponent.prototype.addDomainDataSet = function (domain) {
        var dataset = {
            "title": domain.url.replace(/^https?\:\/\//i, "").replace(/\/$/, ""),
            "fieldMappings": [
                {
                    "fromField": "value",
                    "toField": "value"
                }, {
                    "fromField": "volume",
                    "toField": "volume"
                }],
            "dataProvider": domain.indexingStats,
            "categoryField": "processingDate",
            "compared": true
        };
        this.chart.dataSets.unshift(dataset);
        this.chart.validateData();
        this.chart.animateAgain();
    };
    DomainsChartComponent = __decorate([
        core_1.Component({
            selector: 'domains-chart',
            template: require('./domainsChart.component.html'),
            styles: [require('./domainsChart.component.css')]
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef, core_1.Renderer, domain_service_1.DomainService])
    ], DomainsChartComponent);
    return DomainsChartComponent;
}());
exports.DomainsChartComponent = DomainsChartComponent;
//# sourceMappingURL=domainsChart.component.js.map