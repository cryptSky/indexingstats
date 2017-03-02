import {Component, AfterViewInit, OnInit, OnDestroy, Input, ElementRef, Renderer} from '@angular/core';
import { DomainService } from '../../services/domain.service';
import { Subscription } from 'rxjs/Subscription';
import { Domain, DateRange, IndexingData } from '../../interfaces/domain.interface';

declare var $:JQueryStatic;

@Component({
    selector: 'domains-chart',
    template: require('./domainsChart.component.html'),
    styles: [require('./domainsChart.component.css')]
})

export class DomainsChartComponent implements AfterViewInit, OnInit, OnDestroy {

    constructor(private _elem: ElementRef, private _renderer: Renderer,
                private _domainsService: DomainService) {
       
    } 
   
    private _domainToDraw: Domain;

    private _domains: Domain[] = [];
    private _domainsSubscription:Subscription;

    private _selectedDomain: string = "";
    private _selectedDomainSubscription: Subscription;

    private _chartData: Array<IndexingData[]> = [];

    public chart: any;    
       
    ngAfterViewInit() {

    
        var self = this;

         this._domainsSubscription = this._domainsService.domains$.subscribe(data => {
            this._domains = data;

            if (AmCharts.isReady) {
              self.createStockChart(data);
            } else {
              AmCharts.ready(() => self.createStockChart(data));
            }
        });

        this._selectedDomainSubscription = this._domainsService.selectedDomain$.subscribe(url => {
            if (url != "") {
                this._selectedDomain = url.replace(/^https?\:\/\//i, "").replace(/\/$/, "");
                var elementPos = this.chart.dataSets.map(function(x) {return x.title; }).indexOf(this._selectedDomain);

                let dataSelectorElem = this._elem.nativeElement.querySelector('.amcharts-data-set-select');
                this._renderer.setElementProperty(dataSelectorElem, "selectedIndex", elementPos);

                let event = new CustomEvent('change', { bubbles: true});
                this._renderer.invokeElementMethod(dataSelectorElem, 'dispatchEvent', [event]);

            }
            
        });
        
    }
    
    ngOnInit() {
       this._domainsSubscription = this._domainsService.domainToDraw$.subscribe(res => {
            if (res != null) {
                this.addDomainDataSet(res);
            }
        });
    }

    ngOnDestroy() {
        // prevent memory leak when component is destroyed
        this._domainsSubscription.unsubscribe();
        this._selectedDomainSubscription.unsubscribe();
    }

    public createStockChart(data: Domain[]) {

        let dataSets = []

        for (var domain of data) {
            let dataSet = this.getDomainDataset(domain);
            dataSets.push(dataSet);
        }

        this.chart = AmCharts.makeChart( "chartdiv", {
            "type": "stock",
            "theme": "light",
            "dataSets": dataSets,

            "panels": [ {
                "showCategoryAxis": false,
                "title": "Value",
                "percentHeight": 70,
                "stockGraphs": [ {
                    "id": "g1",
                    "valueField": "value",
                    "comparable": true,
                    "compareField": "value",
                    "balloonText": "<b>[[value]]</b>",
                    "compareGraphBalloonText": "<b>[[value]]</b>",
                    
                    "bullet": "round",
                    "bulletSize": 4,
                    "lineThickness": 1
                } ],
                
            }],

            "chartScrollbarSettings": {
                "graph": "g1"
            },

            "chartCursorSettings": {
                "valueBalloonsEnabled": true,
                "fullWidth": true,
                "cursorAlpha": 0.1,
                "valueLineBalloonEnabled": true,
                "valueLineEnabled": true,
                "valueLineAlpha": 0.5
            },

            "periodSelector": {
                "position": "left",
                "width": 250,
                "periods": [ {
                
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
                } ],
               //    "listeners": [ {
               //      "event": "changed",
               //      "method": this.onDatePicked(event)
               // } ]
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
        } );

               
   }

    // generate some random data, quite different range
    public generateChartData() {
        var initData = new IndexingData(new Date(), 0);
        this._chartData.push([initData]);
    }

    public getDomainDataset(domain: Domain) {
        let dataset = {
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
    }

    public addDomainDataSet(domain: Domain) {
        let dataset = {
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

    }
}