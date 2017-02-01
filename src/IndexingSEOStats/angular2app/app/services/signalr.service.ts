import { Injectable } from '@angular/core';
import { Configuration } from '../app.constants';
import { Domain, DomainStat } from '../interfaces/domain.interface';
import { Subject } from 'rxjs/Subject';

declare var $:JQueryStatic;

@Injectable()
export class SignalRService {

    private proxy;
    private proxyName: string = 'domainstatsender';
    private connection;

    private _domainStatReceived$: Subject<DomainStat>;
    private _domainReceived$: Subject<Domain>;
    private _connectionEstablished$: Subject<Boolean>;
    private _connectionExists: Boolean;
    private _receivedDomainStat: DomainStat;
    private _receivedDomain: Domain;

    constructor(private _conf: Configuration) {

        this._connectionEstablished$ = new Subject<Boolean>();
        this._domainStatReceived$ = new Subject<DomainStat>();
        this._domainReceived$ = new Subject<Domain>();
        this._connectionExists = false;

        this.connection = $.hubConnection('signalr/');
        this.proxy = this.connection.createHubProxy(this.proxyName);

        this.registerOnServerEvents();

        this.startConnection();

        let self = this;
        this.connection.disconnected(function() {
            
            setTimeout(function() {
                self.startConnection();
            }, 5000); // Restart connection after 5 seconds.
        });
    }

    get domainStatReceived$() {
        return this._domainStatReceived$.asObservable();
    }

    get domainReceived$() {
        return this._domainReceived$.asObservable();
    }

    get connectionEstablished$() {
        return this._connectionEstablished$.asObservable();
    }

    public sendDomainStat(domainStat: DomainStat) {
        this.proxy.invoke('SendDomainStat', domainStat);
    }

    public sendDomain(domain: Domain) {
        this.proxy.invoke('SendDomain', domain);
    }

    private startConnection(): void {
        this.connection.start().done((data) => {
            console.log('Now connected ' + data.transport.name + ', connection ID= ' + data.id);
            this._connectionExists = true;
            this._connectionEstablished$.next(this._connectionExists);

        }).fail((error) => {
            console.log('Could not connect ' + error);
            this._connectionEstablished$.next(false);
        });
    }

    private registerOnServerEvents(): void {

        this.proxy.on('SendDomainStat', (data: DomainStat) => {
            console.log('received in SignalRService: ' + JSON.stringify(data));
            this._domainStatReceived$.next(data);
        });

        this.proxy.on('SendDomain', (data: Domain) => {
            console.log('received in SignalRService: ' + JSON.stringify(data));
            this._domainReceived$.next(data);
        });

    }
}
