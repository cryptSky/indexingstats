"use strict";
var IndexingData = (function () {
    function IndexingData(processingDate, pagesNumber) {
        this.processingDate = processingDate;
        this.pagesNumber = pagesNumber;
    }
    return IndexingData;
}());
exports.IndexingData = IndexingData;
var DomainStat = (function () {
    function DomainStat(domainURL, indexingData) {
        this.domainURL = domainURL;
        this.indexingData = indexingData;
    }
    return DomainStat;
}());
exports.DomainStat = DomainStat;
var Domain = (function () {
    function Domain(url, notes, tags, indexingStats, isDeindexed, 
        //public updated: boolean,
        isDisabled) {
        if (indexingStats === void 0) { indexingStats = []; }
        this.url = url;
        this.notes = notes;
        this.tags = tags;
        this.indexingStats = indexingStats;
        this.isDeindexed = isDeindexed;
        this.isDisabled = isDisabled;
        //indexingStats = [];
    }
    return Domain;
}());
exports.Domain = Domain;
var DateRange = (function () {
    function DateRange(startDate, endDate) {
        if (endDate === void 0) { endDate = new Date(); }
        this.startDate = startDate;
        this.endDate = endDate;
    }
    return DateRange;
}());
exports.DateRange = DateRange;
//# sourceMappingURL=domain.interface.js.map