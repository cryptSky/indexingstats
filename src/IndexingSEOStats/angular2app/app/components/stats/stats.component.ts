import { DomainService } from '../../services/domain.service';
import { OnInit, OnDestroy, Component, NgModule, ViewEncapsulation } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Domain } from '../../interfaces/domain.interface';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { DomainsTableComponent } from '../datatables/domainsTable.component';
import { DomainsChartComponent } from '../charts/domainsChart.component';
import { DomainFormComponent } from '../form/domain-form.component';
import { NotifiationsComponent } from '../notifications/notification.component';

@Component({
    selector: 'stats',
    template: require('./stats.component.html')
})

export class StatsComponent implements OnInit, OnDestroy {
    
    constructor() {
        
    }

    ngOnInit() {
        
    }

    ngOnDestroy() {
        
    }
      
}