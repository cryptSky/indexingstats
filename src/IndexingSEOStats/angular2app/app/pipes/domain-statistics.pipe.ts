import { Pipe, PipeTransform } from '@angular/core';
import { Domain } from '../interfaces/domain.interface';
import { DatesProviderService } from '../services/dates-provider.service';
import { CommasPipe } from './commas.pipe';

@Pipe({
name: 'domainStats'
})
export class DomainStatisticsPipe implements PipeTransform {

    constructor(private _datesProvider: DatesProviderService) {
    
    }

    transform(domain: Domain, date: Date): string {
      let result = this._datesProvider.getStatForDate(domain, date);           
      return result;
    }
}