using IndexingSEOStats.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using IndexingSEOStats.Data.DataTransferObjects;
using IndexingSEOStats.Actors;
using IndexingSEOStats.Data.Interfaces;
using AutoMapper;
using IndexingSEOStats.Data.Entities;

namespace IndexingSEOStats.Services
{
    public class DomainService : IDomainService
    {
        private IMapper _mapper;
        private IUnitOfWork _uow;
        public DomainService(IUnitOfWork uow, IMapper mapper)
        {
            _uow = uow;
            _mapper = mapper;
        }

        public async Task<DomainDTO> AddDomainAsync(DomainDTO domainDTO)
        {
            var domain = _mapper.Map<DomainDTO, Domain>(domainDTO);
            var result = await _uow.DomainRepository.AddAsync(domain);
            return _mapper.Map<Domain, DomainDTO>(result);
        }

        public async Task<IList<DomainDTO>> GetDomainsAsync()
        {
            var result = await _uow.DomainRepository.GetAllAsync();
            return result.Select(domain => _mapper.Map<Domain, DomainDTO>(domain)).ToList();
        }

        public async Task<DomainDTO> GetDomainByUrlAsync(string url)
        {
            var result = await _uow.DomainRepository.GetDomainByUrlAsync(url);
            return  _mapper.Map<Domain, DomainDTO>(result);
        }

        public DomainDTO GetDomainByUrl(string url)
        {
            var result = _uow.DomainRepository.GetDomainByUrl(url);
            return _mapper.Map<Domain, DomainDTO>(result);
        }

        public async Task<long> GetActiveDomainsCountAsync()
        {
            return await _uow.DomainRepository.GetActiveDomainsCountAsync();
        }

        public async Task<IList<DomainDTO>> GetActiveDomainsAsync()
        {
            var result = await _uow.DomainRepository.GetActiveDomainsAsync();
            return result.Select(domain => _mapper.Map<Domain, DomainDTO>(domain)).ToList();
        }

        public IList<DomainDTO> GetActiveDomains()
        {
            var result = _uow.DomainRepository.GetActiveDomains();
            return result.Select(domain => _mapper.Map<Domain, DomainDTO>(domain)).ToList();
        }

        public async Task<bool> DomainWithUrlExistsAsync(string url)
        {
            var result = await _uow.DomainRepository.DomainWithUrlExistsAsync(url);
            return result;
        }

        public async Task AddIndexingDataAsync(string domainUrl, IndexingData data)
        {
            await _uow.DomainRepository.AddIndexingDataAsync(domainUrl, data);
        }

        public void AddIndexingData(string domainUrl, IndexingData data)
        {
            _uow.DomainRepository.AddIndexingData(domainUrl, data);
        }

        public void UpdateCurrentStats(string domainUrl, IndexingData data)
        {
            _uow.DomainRepository.UpdateCurrentStats(domainUrl, data);
        }

        public async Task<IList<DomainDTO>> GetDomainsWithStatsForPeriodAsync(DateRange range)
        {
            var result = await _uow.DomainRepository.GetDomainsWithStatsForPeriodAsync(range);
            return result.Select(domain => _mapper.Map<Domain, DomainDTO>(domain)).ToList();
        }

        public async Task<IList<IndexingData>> GetStatsForPeriodAsync(DomainDTO domain, DateRange range)
        {
            var result = await _uow.DomainRepository.GetStatsForPeriodAsync(domain.Url, range);
            return result;
        }

        public async Task DeleteDomainAsync(DomainDTO domainDTO)
        {
            var domain = _mapper.Map<DomainDTO, Domain>(domainDTO);
            await _uow.DomainRepository.RemoveAsync(domain);
        }

        public async Task<IList<DomainDTO>> GetDeindexedDomainsAsync()
        {
            var result = await _uow.DomainRepository.GetDeindexedDomainsAsync();
            return result.Select(domain => _mapper.Map<Domain, DomainDTO>(domain)).ToList();
        }

        public async Task<DomainDTO> SwitchDeindexedFlagAsync(DomainDTO domainDTO)
        {
            domainDTO.IsDeindexed = !domainDTO.IsDeindexed;
            var domain = _mapper.Map<DomainDTO, Domain>(domainDTO);

            await _uow.DomainRepository.SaveAsync(domain);
            return domainDTO;
        }

        public DomainDTO UpdateDomain(DomainDTO domainDTO)
        {
            var domain = _mapper.Map<DomainDTO, Domain>(domainDTO);
            var result = _uow.DomainRepository.UpdateDomain(domain);

            return _mapper.Map<Domain, DomainDTO>(result);
        }

        public async Task<DomainDTO> UpdateDomainAsync(DomainDTO domainDTO)
        {
            var domain = _mapper.Map<DomainDTO, Domain>(domainDTO);
            var result = await _uow.DomainRepository.UpdateDomainAsync(domain);

            return _mapper.Map<Domain, DomainDTO>(result);
        }
    }
}
