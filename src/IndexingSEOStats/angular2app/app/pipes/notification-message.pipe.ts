import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Domain } from '../interfaces/domain.interface';

@Pipe({name: 'notification'})
export class NotificationMessagePipe implements PipeTransform {

    transform(domain: Domain): string {
        let last = domain.indexingStats.length - 1;
        let message = 'Domain ' + domain.url + ' has been deindexed at ' + new DatePipe("en-US").transform(domain.indexingStats[last].processingDate, 'short');
        return message;
    }
}