import { Pipe, PipeTransform } from '@angular/core';
import { DateRange } from '../interfaces/domain.interface';

@Pipe({name: 'datesInRange'})
export class DatesInRangePipe implements PipeTransform {

    transform(dateRange: DateRange): Date[] {
        let result = [];
        let currentDate = dateRange.endDate;

        while(currentDate > dateRange.startDate) {
            result.push(new Date(currentDate));

            currentDate.setDate(currentDate.getDate() - 1);
        }        

      return result;
    }
}