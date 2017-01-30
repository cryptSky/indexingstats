using Akka.Actor;
using IndexingSEOStats.Actors;
using IndexingSEOStats.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Serilog;
using IndexingSEOStats.Data.DataTransferObjects;
using Akka.Routing;
using Akka.DI.Core;

namespace IndexingSEOStats.Actors
{
    public class RequestSchedulerActor : ReceiveActor
    {
        private IActorRef _domainProcessorActor;
        private ITimeGeneratorService _timeGenerator;
        private IDomainService _domainService;
        private ILogger _logger;

        public RequestSchedulerActor(IDomainService domainService, ITimeGeneratorService timeGenerator)
        {
            _domainService = domainService;
            _timeGenerator = timeGenerator;
            _logger = Log.ForContext<RequestSchedulerActor>();

            var propProc = Context.DI().Props<DomainProcessorActor>().WithRouter(new RoundRobinPool(5));
            _domainProcessorActor = Context.ActorOf(propProc, "DomainProcessorActor");

            Receive<string>(m => m.Equals("schedule"), m => HandleScheduling(m));
            Receive<string>(m => m.Equals("scheduleToday"), m => HandleTodaysScheduling(m));
            Receive<DomainDTO>(m => RescheduleDomain(m));
        }

        private void RescheduleDomain(DomainDTO domainDto)
        {
            _logger.Information($"Failed processing of the domain {domainDto.Url}! Recheduling processing time for that domain...");

            Schedule(new[] { domainDto });

            _logger.Information("Rescheduling finished!");
        }

        private void HandleScheduling(string message)
        {
            _logger.Information("Received scheduling request...");
            var domains = _domainService.GetActiveDomains();
            Schedule(domains);

            _logger.Information("Scheduling is finished!");
        }

        private void HandleTodaysScheduling(string message)
        {
            _logger.Information("Received scheduling request for not yet tracked domains today...");
            var domains = _domainService.GetActiveDomains();
            domains = domains.Where(d => !d.IndexingStats.Any(st => 
                st.ProcessingDate.Date.Equals(DateTime.Today.Date))).ToList();

            Schedule(domains);

            _logger.Information("Scheduling is finished!");
        }

        private void Schedule(IList<DomainDTO> domains)
        {
            foreach (var domain in domains)
            {
                var time = _timeGenerator.Next(domains.Count);
                var fromNow = time - DateTime.Now;
                ActorSystemRefs.ActorSystem.Scheduler.ScheduleTellOnce
                    (fromNow, _domainProcessorActor, domain.Url, Self);

                _logger.Information(string.Format("Scheduled next request for the domain {0} at {1}", domain, time));
            }

            _timeGenerator.Reset();
        }
        

    }
}
