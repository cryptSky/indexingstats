
export class IndexingData {
    
     constructor(public processingDate: Date,
                 public pagesNumber: number) {
        }      
}

export class DomainStat {
    
     constructor(public domainURL: string,
                 public indexingData: IndexingData) {
        }      
}

export class Domain {

    constructor(
        public url: string,
        public notes: string,
        public tags: string,
        public indexingStats: IndexingData[] = [],
        public isDeindexed: boolean,
        //public updated: boolean,
        public isDisabled: boolean) {
        
        //indexingStats = [];
    }

}

export class DateRange {
    constructor(public startDate: Date, 
                public endDate: Date = new Date()) {
    }
}