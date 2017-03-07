import { Injectable }    from '@angular/core';
import {Http, Headers, Response} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Rx';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Domain, DomainStat, DateRange, IndexingData } from '../interfaces/domain.interface';
import { DatesProviderService } from './dates-provider.service';
import { SignalRService } from './signalr.service';

@Injectable()
export class DomainService {
    private _domains$;
    private _deindexedDomains$;
    private _domainToDraw$; 
    private _selectedForChart$;  

    private dataStore: {  // This is where we will store our data in memory
        domains: Domain[],
        deindexedDomains: Domain[],  
        selectedForChart: string,
        domainToDraw: Domain
    };
    
    private headers = new Headers({ 'Content-Type': 'application/json' });
    private domainsUrl = 'api/domains/get';  // URL to web api for all the domains
    private createDomainUrl = 'api/domains/create';  // URL to web api for all the domains
    private domainsUrlDateRange = 'api/domains/dates';  // URL to web api for all the domains
    private domainUrlDateRange = 'api/domains/domain/dates';
    private domainProcessUrl = 'api/domains/process';
    private domainDeleteUrl = 'api/domains/delete';
    private domainDisableUrl = 'api/domains/pause';
    private domainsDeindexedUrl = 'api/domains/deindexed';

    private subscribeToEvents(): void {
       this._signalRService.domainStatReceived$.subscribe((domainStat: DomainStat) => {
            
            var domain = this.updateDomainStats(domainStat.domainURL, domainStat.indexingData);
            this.updateDomainValue(domain);
            this._domains$.next(this.dataStore.domains);

            if (domainStat.indexingData.pagesNumber == 0) {
                this.dataStore.deindexedDomains.push(domain);
                this._deindexedDomains$.next(this.dataStore.deindexedDomains);
            }
                   
        });
        
        this._signalRService.domainReceived$.subscribe((domain: Domain) => {
            
            this.updateDomainValue(domain);
            this._domains$.next(this.dataStore.domains);

            if (domain.isDeindexed) {
                this.dataStore.deindexedDomains.push(domain);
                this._deindexedDomains$.next(this.dataStore.deindexedDomains);
            } else {
                
            }
                 
        });
    }

    constructor(private http: Http, private _signalRService: SignalRService,
                private _datesProviderService: DatesProviderService ) {
        this.subscribeToEvents();

        this.dataStore = { 
            domains: [], 
            deindexedDomains: [],
            selectedForChart: "", 
            domainToDraw: null 
        };
        
        this._domains$ = new BehaviorSubject<Domain[]>(this.dataStore.domains);
        this._deindexedDomains$ = new BehaviorSubject<Domain[]>(this.dataStore.deindexedDomains);
        this._domainToDraw$ = new BehaviorSubject<Domain>(this.dataStore.domainToDraw);
        this._selectedForChart$ = new BehaviorSubject<string>(this.dataStore.selectedForChart);

        this.getDomains();
        this.getDeindexedDomains();
    }
    
    get domains$() {
        return this._domains$.asObservable();
    }

    get deindexedDomains$() {
        return this._deindexedDomains$.asObservable();
    }

    get domainToDraw$() {
        return this._domainToDraw$.asObservable();
    }

    /*get dateRange$() {
        return this._dateRange$.asObservable();
    }*/   

    get selectedDomain$() {
        return this._selectedForChart$.asObservable();
    }

    /*public dateRange() {
        return this.dataStore.dateRange;
    }*/

    public selectToDraw(domain: Domain) {
        this.dataStore.selectedForChart = domain.url;
        this._selectedForChart$.next(this.dataStore.selectedForChart);
    }

    getDomains() {
        this.http.get(this.domainsUrl)
            .map((response) => {
                let res = JSON.parse(response['_body']);
                let result = new Array<Domain>();
                res.forEach((item) => {
                    let domain = item as Domain;
                    result.push(domain);
                });
                return result;
            })
            .subscribe((res: Array<Domain>) => {
                this.dataStore.domains = res;
                this._domains$.next(this.dataStore.domains);
            },
            error => { this.handleError(error) });
    }

    getDeindexedDomains() {
        return this.http.get(this.domainsDeindexedUrl)
            .map((response) => {
                let res = JSON.parse(response['_body']);
                let result = new Array<Domain>();
                res.forEach((item) => {
                    let domain = item as Domain;
                    result.push(domain);
                });
                return result;
            })
            .subscribe((res: Array<Domain>) => {
                this.dataStore.deindexedDomains = res;
                this._deindexedDomains$.next(this.dataStore.deindexedDomains);
            },
            error => { this.handleError(error) });
    }

    public createDomain(domainDto: Domain) {

        this.http
            .post(this.createDomainUrl, JSON.stringify(domainDto), { headers: this.headers })
            .map(response => {
                let result = JSON.parse(response['_body']);
                let domain = result as Domain;
                return domain;
            })
            .subscribe((domain) => {
                this.dataStore.domains.push(domain);
                this._domains$.next(this.dataStore.domains);

                if (domain.isDeindexed) {
                    this.dataStore.deindexedDomains.push(domain);
                    this._deindexedDomains$.next(this.dataStore.deindexedDomains);
                }
            },
            error => { this.handleError(error) });
    }

    public processDomain(domainDto: Domain) {

        this.http
            .post(this.domainProcessUrl, JSON.stringify(domainDto), { headers: this.headers })
            .map(response => {
                let result = JSON.parse(response['_body']);
                let domain = result as Domain;
                return domain;
            })
            .subscribe((domain: Domain) => {
                this.updateDomainValue(domain);
                this._domains$.next(this.dataStore.domains);

                if (domain.isDeindexed && !domainDto.isDeindexed) {
                    this.dataStore.deindexedDomains.push(domain);
                    this._deindexedDomains$.next(this.dataStore.deindexedDomains);
                }
            },
            error => { this.handleError(error) });
    }

    public pauseDomain(domainDto: Domain) {

        this.http
            .post(this.domainDisableUrl, JSON.stringify(domainDto), { headers: this.headers })
            .map(response => {
                let result = JSON.parse(response['_body']);
                let domain = result as Domain;
                return domain;
            })
            .subscribe((domain) => {
                this.updateDomainValue(domain);
                this._domains$.next(this.dataStore.domains);
            },
            error => { this.handleError(error) });
    }

    public deleteDomain(domain: Domain) {
        this.http
            .post(this.domainDeleteUrl, JSON.stringify(domain), { headers: this.headers })
            .map((res) => res)
            .subscribe((res) => {
                this.dataStore.domains = this.dataStore.domains.filter(d => d.url !== domain.url);
                this._domains$.next(this.dataStore.domains);
                
                this.dataStore.deindexedDomains = this.dataStore.deindexedDomains.filter(d => d.url != domain.url);
                this._deindexedDomains$.next(this.dataStore.deindexedDomains);
            },
            error => { this.handleError(error) });
    }

    public domainExists(domain: Domain): boolean {
        
        let sameDomain = this.dataStore.domains.filter(d => 
            d.url.replace(/^https?\:\/\//i, "").replace(/\/$/, "") === domain.url.replace(/^https?\:\/\//i, "").replace(/\/$/, ""));
        if (sameDomain.length != 0) {
            return true;
        } else {
            return false;
        }    
    }

    /*public setDateRange(dateRange : DateRange) {
        this.dataStore.dateRange = dateRange;
        this._dateRange$.next(this.dataStore.dateRange);
    }

    public getDomainsForDateRange() {
        this.http
            .post(this.domainsUrlDateRange, JSON.stringify(this.dataStore.dateRange), { headers: this.headers })
            .map((response) => {
                let res = JSON.parse(response['_body']);
                let result = new Array<Domain>();
                res.forEach((item) => {
                    let domain = item as Domain;
                    result.push(domain);
                });
                return result;
            })
            .subscribe((res: Array<Domain>) => {
                this.dataStore.domains = res;
                this._domains$.next(this.dataStore.domains);
            },
            error => { this.handleError(error) });
    }

    public getGetStatsForPeriod(domain: Domain, range: DateRange) : Observable<Array<IndexingData>> {
        let toSend = JSON.stringify({
                domain: domain,
                range: range
        });
        return this.http
            .post(this.domainUrlDateRange, JSON.stringify(this.dataStore.dateRange), { headers: this.headers })
            .map((response) => {
                let res = JSON.parse(response['_body']);
                let result = new Array<Domain>();
                res.forEach((item) => {
                    let domain = item as Domain;
                    result.push(domain);
                });
                return result;
            })
            .catch(this.handleError);
    }*/

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

    private updateDomainStats( domainUrl: string, indexingData: IndexingData ): Domain {
        for (var i = 0; i < this.dataStore.domains.length; i++) {
          if (this.dataStore.domains[i].url == domainUrl) {
            
            let domain = new Domain( 
                this.dataStore.domains[i].url,
                this.dataStore.domains[i].notes,
                this.dataStore.domains[i].tags,
                this.dataStore.domains[i].indexingStats,
                this.dataStore.domains[i].isDeindexed,
                this.dataStore.domains[i].isDisabled);

            if (this._datesProviderService.getStatForDate(domain, new Date()) != 'N/A') {
                domain.indexingStats.pop();
                domain.indexingStats.push(indexingData);
            } else {
                domain.indexingStats.push(indexingData)                
            }
            
            this.dataStore.domains[i] = domain;
            return domain;
          }
        }
    }

    private updateDomainValue( value: Domain ) {
        for (var i = 0; i < this.dataStore.domains.length; i++) {
          if (this.dataStore.domains[i].url == value.url) {
             this.dataStore.domains[i] = value;
             break; //Stop this loop, we found it!
          }
        }
    }
}