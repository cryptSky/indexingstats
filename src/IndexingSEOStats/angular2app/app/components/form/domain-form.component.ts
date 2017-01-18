import { DomainService } from '../../services/domain.service';
import { OnInit, OnDestroy, Component, NgModule,ViewEncapsulation } from '@angular/core';
import { Domain } from '../../interfaces/domain.interface';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'domain-form',
    template: require('./domain-form.component.html')
})

export class DomainFormComponent implements OnInit {

    public myForm: FormGroup; // our model driven form
    public submitted: boolean; // keep track on whether form is submitted
    public events: any[] = []; // use later to display form changes
    
    constructor(private _domainService: DomainService, private _fb: FormBuilder) {
        
    }

    ngOnInit() {
        this.createForm();       
    }

    private createForm() {
        // the short way
        this.myForm = this._fb.group({
                url: ['', [<any>Validators.required]],
                notes: [''],
                tags: [''] 
           });
      
    }

    reset() {
        this.createForm();
    }

    save(formModel: any, isValid: boolean) {
        this.submitted = true; // set form submit to true

        // check if model is valid
        // if valid, call API to save customer
        let tags = formModel.tags.split('\n');
        let urls = formModel.url.split('\n');
        let notes = formModel.notes.split('\n');

        if (isValid) {
            for (var index = 0; index < urls.length; index++) {
                var domain = new Domain('','','',[], false, false);
                domain.url = urls[index].trim();
                domain.tags = tags[index] ? tags[index].trim() : '';                
                domain.notes = notes[index] ? notes[index].trim() : '';

                this._domainService.createDomain(domain);
            }

            this.reset();
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