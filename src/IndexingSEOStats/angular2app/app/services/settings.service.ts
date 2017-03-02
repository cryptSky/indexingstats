import { Injectable }    from '@angular/core';
import {Http, Headers, Response} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Rx';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class SettingsService {

    private _proxyUrl$;

    private headers = new Headers({ 'Content-Type': 'application/json' });
    private getProxyUrlUrl = 'api/settings/getProxyUrl';
    private setProxyUrlUrl = 'api/settings/setProxyUrl';

    private dataStore: {  // This is where we will store our data in memory
        proxyUrl: string
    }

    constructor(private http: Http) {
        this.dataStore = { 
            proxyUrl: ""
        };

        this._proxyUrl$ = new BehaviorSubject<string>(this.dataStore.proxyUrl);

        this.getProxyUrl();
    }

    get proxyUrl$() {
        return this._proxyUrl$.asObservable();
    }

    getProxyUrl() {
        this.http.get(this.getProxyUrlUrl)
            .map((response) => {
                let res = JSON.parse(response['_body']);
                
                return res.proxy;
            })
            .subscribe((res: string) => {
                this.dataStore.proxyUrl = res;
                this._proxyUrl$.next(this.dataStore.proxyUrl);
            },
            error => { this.handleError(error) });
    }

    setProxyUrl(url: string) {
        this.http
            .post(this.setProxyUrlUrl, JSON.stringify(url), { headers: this.headers })
            .map(response => {
                let result = JSON.parse(response['_body']);
                let proxyUrl = result.proxy;
                return proxyUrl;
            })
            .subscribe((proxyUrl) => {
                this.dataStore.proxyUrl = proxyUrl;
                this._proxyUrl$.next(this.dataStore.proxyUrl);

            },
            error => { this.handleError(error) });
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

}