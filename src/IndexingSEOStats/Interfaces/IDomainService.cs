using IndexingSEOStats.Data.DataTransferObjects;
using IndexingSEOStats.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IndexingSEOStats.Interfaces
{
    public interface IDomainService
    {
        Task<DomainDTO> AddDomainAsync(DomainDTO domain);
        Task<IList<DomainDTO>> GetDomainsAsync();
        Task<IList<DomainDTO>> GetActiveDomainsAsync();
        IList<DomainDTO> GetActiveDomains();
        Task<DomainDTO> GetDomainByUrlAsync(string url);
        DomainDTO GetDomainByUrl(string url);
        Task<long> GetActiveDomainsCountAsync();
        Task<IList<DomainDTO>> GetDeindexedDomainsAsync();
        Task<IList<DomainDTO>> GetDomainsWithStatsForPeriodAsync(DateRange range);
        Task<IList<IndexingData>> GetStatsForPeriodAsync(DomainDTO domain, DateRange range);
        Task<DomainDTO> PauseProcessingAsync(DomainDTO domainDTO);
        Task DeleteDomainAsync(DomainDTO domainDTO);
        DomainDTO UpdateDomain(DomainDTO domainDTO);
        
    }
}
