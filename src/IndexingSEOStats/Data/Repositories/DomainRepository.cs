using MongoDB.Driver;
using IndexingSEOStats.Data.Entities;
using IndexingSEOStats.Data.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IndexingSEOStats.Data.Repositories
{
    public class DomainRepository : GenericRepository<Domain>
    {
        public DomainRepository(DBContext context) : base(context)
        {
        }

        public async Task<Domain> GetDomainByUrlAsync(string url)
        {
            var filter = Builders<Domain>.Filter.Eq(q => q.Url, url);
            var result = await Collection.Find(filter).SingleAsync();

            return result;
        }

        public Domain GetDomainByUrl(string url)
        {
            var filter = Builders<Domain>.Filter.Eq(q => q.Url, url);
            var result = Collection.Find(filter).Single();

            return result;
        }

        public async Task<long> GetActiveDomainsCountAsync()
        {
            var filter = Builders<Domain>.Filter.Where(q => !q.IsDisabled);
            var result = await Collection.Find(filter).CountAsync();

            return result;
        }

        public async Task<long> GetDeindexedDomainsCountAsync()
        {
            var filter = Builders<Domain>.Filter.Where(q => q.IsDeindexed);
            var result = await Collection.Find(filter).CountAsync();

            return result;
        }

        public async Task<IList<Domain>> GetActiveDomainsAsync()
        {
            var filter = Builders<Domain>.Filter.Where(q => !q.IsDisabled);
            var result = await Collection.Find(filter).ToListAsync();

            return result;
        }

        public IList<Domain> GetActiveDomains()
        {
            var filter = Builders<Domain>.Filter.Where(q => !q.IsDisabled);
            var result = Collection.Find(filter).ToList();

            return result;
        }

        public async Task<bool> DomainWithUrlExistsAsync(string domainUrl)
        {
            var filter = Builders<Domain>.Filter.Eq("Url", domainUrl);
            var result = await Collection.CountAsync(filter);

            if (result == 0)
            {
                return false; 
            }
            else
            {
                return true;
            }
        }

        public async Task<IList<Domain>> GetDomainsWithStatsForPeriodAsync(DateRange range)
        {
            var filter = Builders<Domain>.Filter.ElemMatch(
                d => d.IndexingStats,
                stats => stats.ProcessingDate >= range.StartDate &&
                             stats.ProcessingDate <= range.EndDate);

            var result = await Collection.Find(filter).ToListAsync();

            return result;
        }

        public async Task<IList<IndexingData>> GetStatsForPeriodAsync(string domainUrl, DateRange range)
        {
            var filter = Builders<Domain>.Filter.And(
                Builders<Domain>.Filter.Where(d => d.Url.Equals(domainUrl)),
                Builders<Domain>.Filter.ElemMatch(
                    d => d.IndexingStats,
                    stats => stats.ProcessingDate >= range.StartDate &&
                             stats.ProcessingDate <= range.EndDate));

            var projection = Builders<Domain>.Projection.Include(d => d.IndexingStats);
            var result = await Collection.Find(filter).Project<IndexingData>(projection).ToListAsync();

            return result;
        }

        public async new Task RemoveAsync(Domain domain)
        {
            var filter = Builders<Domain>.Filter.Eq(q => q.Url, domain.Url);
            var result = await Collection.DeleteOneAsync(filter);
        }

        public async Task AddIndexingDataAsync(string domainUrl, IndexingData data)
        {
                var filter = Builders<Domain>.Filter.Where(x => x.Url == domainUrl);
                var update = Builders<Domain>.Update.Push("IndexingStats", data);

                await Collection.FindOneAndUpdateAsync(filter, update);
        }

        public void AddIndexingData(string domainUrl, IndexingData data)
        {
            var filter = Builders<Domain>.Filter.Where(x => x.Url == domainUrl);
            var update = Builders<Domain>.Update.Push("IndexingStats", data);

            Collection.FindOneAndUpdate(filter, update);
        }

        public async Task<IList<Domain>> GetDeindexedDomainsAsync()
        {
            var filter = Builders<Domain>.Filter.Where(q => q.IsDeindexed);
            var result = await Collection.Find(filter).ToListAsync();

            return result;
        }

        public void UpdateCurrentStats(string domainUrl, IndexingData data)
        {
            var filter = Builders<Domain>.Filter;
            var domainUrlAndStatsDateFilter = filter.And(
                filter.Eq(x => x.Url, domainUrl),
                filter.ElemMatch(x => x.IndexingStats, 
                    c => c.ProcessingDate.Equals(data.ProcessingDate.Date)));
            
            var domain = Collection.Find(domainUrlAndStatsDateFilter).SingleOrDefault();

            // update with positional operator
            var update = Builders<Domain>.Update;
            var indexingStatsSetter = update.Set("IndexingStats.$.PagesNumber", data.PagesNumber);

            Collection.UpdateOne(domainUrlAndStatsDateFilter, indexingStatsSetter);
            
        }

        public async Task<ReplaceOneResult> SaveDomainAsync(Domain doc)
        {
            return await Collection.ReplaceOneAsync(w => w.Url.Equals(doc.Url), doc, new UpdateOptions { IsUpsert = true });
        }

        public async Task<Domain> UpdateDomainAsync(Domain domain)
        {
            var filter = Builders<Domain>.Filter.Where(q => q.Url.Equals(domain.Url));
            var result = await Collection.FindOneAndReplaceAsync(filter, domain, new FindOneAndReplaceOptions<Domain, Domain>
            {
                ReturnDocument = ReturnDocument.After
            }
            );

            return result;
        }

        public Domain UpdateDomain(Domain domain)
        {
            var filter = Builders<Domain>.Filter.Where(q => q.Url.Equals(domain.Url));
            var result = Collection.FindOneAndReplace(filter, domain, new FindOneAndReplaceOptions<Domain, Domain>
                {
                    ReturnDocument = ReturnDocument.After
                }
            );

            return result;
        }
    }
}
