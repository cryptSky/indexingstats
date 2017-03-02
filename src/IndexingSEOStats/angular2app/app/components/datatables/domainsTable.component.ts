//our root app component
import {Component, NgModule, OnInit, ViewChild, ViewEncapsulation, OnDestroy, ViewContainerRef } from '@angular/core'
import { DomainService } from '../../services/domain.service';

import { NotificationService } from '../../services/notification.service';

import { DatesProviderService } from '../../services/dates-provider.service';
import { Domain, DateRange } from '../../interfaces/domain.interface';
import { DomainStatisticsPipe } from '../../pipes/domain-statistics.pipe';
import { DatesInRangePipe } from '../../pipes/dates-in-range.pipe';
import { CommasPipe } from '../../pipes/commas.pipe';
import { Subscription } from 'rxjs/Subscription';

import { Modal } from 'angular2-modal/plugins/bootstrap';

@Component({
  selector: 'domains-table',
  template: require('./domainsTable.component.html'),
  providers:[DatesProviderService],
  encapsulation: ViewEncapsulation.None
})


export class DomainsTableComponent implements OnInit, OnDestroy {
  
  private _domains: Domain[] = [];
  private _temp: Domain[] = [];
  private _dateRange: DateRange;

  private _deleteDialog: any;

  private _domainsSubscription: Subscription;

  private _selections: Domain[] = [];
  editing = {};
 
  private timeout: any;

  private val: string = '';

  @ViewChild('domainsTable') table;

  constructor (private _domainService: DomainService,
               private _notificaionService: NotificationService, 
               private _datesProvider: DatesProviderService, public modal: Modal) {

        let day = new Date();
        day.setDate(day.getDate() - 7);        
        let weekAgo = day;

        this._dateRange = new DateRange(weekAgo);
           
  }
    

  ngOnInit() {
        
        this._domainsSubscription = this._domainService.domains$.subscribe(res => {
            let rows = [...res];    
            this._domains = rows;
            this._temp = [...res];
        });        
    }

    ngOnDestroy() {
        // prevent memory leak when component is destroyed
        this._domainsSubscription.unsubscribe();
    }

  updateFilter(val) {
    // remove existing
    this._domains.splice(0, this._domains.length);

    // filter our data
    let temp = this._temp.filter(function(d) {
      return d.url.toLowerCase().indexOf(val) !== -1 || d.tags.toLowerCase().indexOf(val) !== -1 || 
                d.notes.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this._domains.push(...temp);
  }

  onSelectionChange(selected) {
    console.log('Selection!', selected);
  }

  toggleExpandRow(row) {
    this.table.rowDetail.toggleExpandRow(row);
  }

  paged(event) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      console.log('paged!', event);
    }, 100);
  }

  updateValue(event, cell, cellValue, row) {
    this.editing[row.$$index] = false
    console.log('ev', event)
    this._domains[row.$$index][cell] = event.target.value;
  }

  cellClass(row: Domain, pdate: Date): string {
    let style = '';
    
    let prevDate = new Date(pdate);
    prevDate.setDate(prevDate.getDate() - 1);
    
    let prevDomainStats = this._datesProvider.getStatForDate(row, prevDate);
    let currentDomainStats = this._datesProvider.getStatForDate(row, pdate);

    if (currentDomainStats != 'N/A' && prevDomainStats != 'N/A') {
        let prevStat = parseInt(prevDomainStats.replace(/,/g, ''), 10);
        let currentStat = parseInt(currentDomainStats.replace(/,/g, ''), 10);    

        if (currentStat > prevStat) {
            style = 'greater-stat';
        } else if (currentStat < prevStat) {
            style = 'less-stat';
        }
    }

    return style;
    
  }

  showOnGraph(row) {
    this._domainService.selectToDraw(row);    
  }

  onSort(event) {
    let ii = 0;
  }

  runNow(row) {
    this._domainService.processDomain(row);
  }

  togglePauseResume(row) {
    this._domainService.pauseDomain(row);
  }

  toggleDelete(row) {
    let dialogBodyText = 'Are you sure you wish to delete the domain ' + row.url + ' ?';

    let deleteDialog = this.modal.confirm()
            .size('lg')
            .isBlocking(true)
            .showClose(true)
            .keyboard(27)
            .title('Delete Domain')
            .body(dialogBodyText)
            .open()
            .catch(err => console.log(err)) // catch error not related to the result (modal open...)
            .then(dialog => dialog.result) // dialog has more properties,lets just return the promise for a result. 
            .then(result => 
                this._domainService.deleteDomain(row)) // if were here ok was clicked.
            .catch(err => console.log("Domain deletion canceled by used")) // if were here it was cancelled (click or non block click)     
  }
}


