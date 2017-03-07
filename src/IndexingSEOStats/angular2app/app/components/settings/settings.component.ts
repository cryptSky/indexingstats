import { SettingsService } from '../../services/settings.service';
import { AfterViewInit, OnInit, OnDestroy, Component, NgModule, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

declare var $: any;

@Component({
    selector: 'settings',
    template: require('./settings.component.html')
})

export class SettingsComponent implements OnInit, OnDestroy, AfterViewInit {
    
    private _proxyUrl: string = "";
    private _proxyUrlSubscription: Subscription;

    invalidIp: boolean = false;

    public proxyUrlForm = this.fb.group({
        ip: ["", Validators.required]
    });

    constructor(private _settingsService: SettingsService, 
                public fb: FormBuilder) {

    }

    ngAfterViewInit() {
        this.sidebarAndContentHeight();
    }

    ngOnInit() {
        
        this._proxyUrlSubscription = this._settingsService.proxyUrl$.subscribe(res => {
              
            this._proxyUrl = res;
        });        
    }

    ngOnDestroy() {
        // prevent memory leak when component is destroyed
        this._proxyUrlSubscription.unsubscribe();
    }

    setProxyUrl(event) {
       let ip = event.value.ip.trim();
       this._settingsService.setProxyUrl(ip);
       event.reset();
    }

    private validURL(str) {
        if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(str))
        {
            return true;
        } else {
            return false;
        }
    }

    // Makes .page-inner height same as .page-sidebar height
    private sidebarAndContentHeight() {
        var content = $('.page-inner'),
            sidebar = $('.page-sidebar'),
            body = $('body'),
            height,
            footerHeight = $('.page-footer').outerHeight(),
            pageContentHeight = $('.page-content').height();
        
        content.attr('style', 'min-height:' + sidebar.height() + 'px !important');
        
        if (body.hasClass('page-sidebar-fixed')) {
            height = sidebar.height() + footerHeight;
        } else {
            height = sidebar.height() + footerHeight;
            if (height  < $(window).height()) {
                height = $(window).height();
            }
        }
        
        if (height >= content.height()) {
            content.attr('style', 'min-height:' + height + 'px !important');
        }
    };
      
}