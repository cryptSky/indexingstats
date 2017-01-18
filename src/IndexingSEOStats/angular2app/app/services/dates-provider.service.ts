import { Injectable }    from '@angular/core';
import { Domain } from '../interfaces/domain.interface';

@Injectable()
export class DatesProviderService {

    constructor() {
    
    }

    public getDate(days: number) : Date {
        let d = new Date();
        d.setDate(d.getDate() + days);

        return d;
    }

    public getDateStat(domain: Domain, dayNumber: number) {
        let d = this.getDate(dayNumber);
        let result = this.getStatForDate(domain, d);
        return result;
    }

    private numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    public getStatForDate(domain: Domain, date: Date): string {
        
        let indexingData = domain.indexingStats.filter(st => 
                new Date(new Date(st.processingDate).getTime() + 60000*new Date(st.processingDate).getTimezoneOffset()).getDate() == date.getDate()).pop();
        if (indexingData == undefined || indexingData == null) {
            return 'N/A';
        } else {
            return this.numberWithCommas(indexingData.pagesNumber);
        }
    }
}