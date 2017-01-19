using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using IndexingSEOStats.Data.DataTransferObjects;
using Akka.Actor;
using IndexingSEOStats.Actors;
using Akka.DI.Core;
using IndexingSEOStats.Interfaces;
using static IndexingSEOStats.Actors.DomainProcessorActor;
using IndexingSEOStats.Data.Entities;
using IndexingSEOStats.Hubs;
using Microsoft.AspNetCore.SignalR.Infrastructure;
using static IndexingSEOStats.Actors.DomainParserActor;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace IndexingSEOStats.Controllers
{
    [Route("api/[controller]/[action]")]
    public class DomainsController : Controller
    {
        private IDomainService _domainService;
                
        public DomainsController(IDomainService domainService)            
        {
            _domainService = domainService;
        }
        // GET: api/values
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var result = await _domainService.GetDomainsAsync();
            return Json(result);
        }

        // POST api/values
        [HttpPost]
        public async Task<IActionResult> Create([FromBody]DomainDTO domainDTO)
        {
            var result = await SystemActors.DomainProcessorActor.Ask<DomainDTO>(domainDTO, TimeSpan.FromSeconds(60));
            return Json(result);
        }

        [HttpPost]
        [ActionName("pause")]
        public async Task<IActionResult> Pause([FromBody]DomainDTO domainDTO)
        {
            domainDTO.IsDisabled = !domainDTO.IsDisabled;
            var result = await _domainService.UpdateDomainAsync(domainDTO);
            return Ok(result);
        }

        [HttpPost]
        [ActionName("dates")]
        public async Task<IActionResult> GetDomainsWithStatsForPeriod([FromBody]DateRange range)
        {
            var result = await _domainService.GetDomainsWithStatsForPeriodAsync(range);
            return Json(result);
        }

        [HttpPost]
        [ActionName("domain/dates")]
        public async Task<IActionResult> GetDomainsWithStatsForPeriod([FromBody]DomainInput domainInput)
        {
            var result = await _domainService.GetStatsForPeriodAsync(domainInput.Domain, domainInput.Range);
            return Json(result);
        }

        [HttpGet]
        [ActionName("deindexed")]
        public async Task<IActionResult> GetDeindexedDomains()
        {
            var result = await _domainService.GetDeindexedDomainsAsync();
            return Json(result);
        }

        [HttpPost]
        [ActionName("process")]
        public async Task<IActionResult> Process([FromBody]DomainDTO domainDTO)
        {
            var result = await SystemActors.DomainProcessorActor.Ask<DomainDTO>(domainDTO.Url, TimeSpan.FromSeconds(60));
            return Json(result);
        }

        [HttpPost]
        public async Task<IActionResult> Delete([FromBody]DomainDTO domainDTO)
        {
            await _domainService.DeleteDomainAsync(domainDTO);
            return Ok();
        }
    }
}
