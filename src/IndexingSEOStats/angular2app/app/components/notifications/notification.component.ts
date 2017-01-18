import {Component, NgModule, OnInit, OnDestroy} from '@angular/core'
import { Subscription } from 'rxjs/Subscription';
import { NotificationService } from '../../services/notification.service';
import { Domain } from '../../interfaces/domain.interface';
import { NotificationMessagePipe } from '../../pipes/notification-message.pipe';
import { DomainService } from '../../services/domain.service';

@Component({
  selector: 'notifications',
  template: require('./notification.component.html')
})
export class NotifiationsComponent implements OnInit {

  private _deindexedDomains: Domain[] = [];
  private _domainsSubscription: Subscription;

  constructor(private _domainService: DomainService) {
    
  }
  
  ngOnInit() {
    this._domainsSubscription = this._domainService.deindexedDomains$.subscribe(res => {
            this._deindexedDomains.splice(0, this._deindexedDomains.length);
            this._deindexedDomains.push(...res);
            
        });
  }

  toggleDelete(domain) {
    //this._notificationService.deleteNotification(domain);
    this._deindexedDomains = this._deindexedDomains.filter(d => d.url != domain.url);
  }

  toggleDeleteAll() {
    this._deindexedDomains = [];
  }  

}