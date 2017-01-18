import { Pipe, PipeTransform } from '@angular/core';
import { DateRange } from '../interfaces/domain.interface';

@Pipe({name: 'commas'})
export class CommasPipe implements PipeTransform {

    transform(num: number): string {
         let val = '';
         while (/(\d+)(\d{3})/.test(num.toString())){
            val = num.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
          }
          return val;
    }
}