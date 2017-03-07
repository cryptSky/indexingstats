import { DomainService } from '../../services/domain.service';
import { OnInit, OnDestroy, Component, NgModule,ViewEncapsulation, Renderer } from '@angular/core';
import { Domain } from '../../interfaces/domain.interface';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'domain-form',
    template: require('./domain-form.component.html')
})

export class DomainFormComponent implements OnInit {

    public submitted: boolean; // keep track on whether form is submitted
    public domain = {
        url: '',
        notes: '',
        tags: ''
    };   
    
    constructor(private _domainService: DomainService) {
        
    }

    ngOnInit() {
         
    }

    save(form: any, formModel: any, isValid: boolean) {
        this.submitted = true; // set form submit to true

        let tags = [];
        let notes = [];
        
        // check if model is valid
        // if valid, call API to save customer
        if (this.domain.tags != null) {
            tags = this.domain.tags.split(/[\n]/).filter(v=> v.trim() != '');
        }
        if (this.domain.notes) {
            notes = this.domain.notes.split(/[\n]/).filter(v=> v.trim() != '');
        }

        let urls = this.domain.url.split(/[ ,;\n]/).filter(v=> v.trim() != '');
        

        if (isValid) {
            for (var index = 0; index < urls.length; index++) {
                var domain = new Domain('','','',[], false, false);
                domain.url = urls[index].trim();
                domain.tags = tags[index] ? tags[index].trim() : '';                
                domain.notes = notes[index] ? notes[index].trim() : '';
                
                if (!this._domainService.domainExists(domain)) {
                    this._domainService.createDomain(domain);
                }                
            }

            form.reset();
        }

    }

    public options = {
        readonly: undefined,
        placeholder: '+ Tag'
    };

    public onAdd(item) {
        console.log(item + ' added');
    }

    public onRemove(item) {
        console.log(item + ' removed');
    }

    public onSelect(item) {
        console.log(item + ' selected');
    }

    public transform(item: string): string {
        return `@${item}`;
    }
}