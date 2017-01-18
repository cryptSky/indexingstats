import { Injectable }    from '@angular/core';
import {Http, Headers, Response} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Rx';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import { Domain, DomainStat, DateRange, IndexingData } from '../interfaces/domain.interface';
import { SignalRService } from './signalr.service';
import { DomainService } from './domain.service';

@Injectable()
export class NotificationService {
    
    constructor() {
        
    }

    /*displayNotification(domain: Domain) {
        if (!this.found(domain)) {
            this.dataStore.deindexedDomains.push(domain);
            this._deindexedDomains$.next(this.dataStore.deindexedDomains);
        }        
    }

    deleteNotification(domain: Domain) {
        this.dataStore.deindexedDomains = this.dataStore.deindexedDomains.filter(d => d.url != domain.url);
        this._deindexedDomains$.next(this.dataStore.deindexedDomains);
    }

    deleteAllNotifications() {
        this.dataStore.deindexedDomains = [];
        this._deindexedDomains$.next(this.dataStore.deindexedDomains);
    }

    private found(domain: Domain) : boolean {
        let result = false;
        for (var dom of this.dataStore.deindexedDomains) {
            if (dom.url == domain.url) {
                result = true;
                break;
            }
        }
        return result;
    }*/
}