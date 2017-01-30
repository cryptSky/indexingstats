using Akka.Actor;
using IndexingSEOStats.Data.DataTransferObjects;
using IndexingSEOStats.Data.Interfaces;
using IndexingSEOStats.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Akka.DI;
using Akka.DI.Core;
using static IndexingSEOStats.Actors.DomainParserActor;
using IndexingSEOStats.Data.Entities;
using IndexingSEOStats.Hubs;
using Serilog;
using Akka.Routing;

namespace IndexingSEOStats.Actors
{
    public class DomainProcessorActor : ReceiveActor
    {
        private IDomainService _domainService;
        private DomainStatSenderHub _hub;
        private ILogger _logger;
        private IActorRef _domainParserActor;

        public DomainProcessorActor(DomainStatSenderHub hub, IDomainService domainService)
        {
            _hub = hub;
            _domainService = domainService;
            _logger = Log.ForContext<DomainProcessorActor>();

            var propParser = Context.DI().Props<DomainParserActor>().WithRouter(new RoundRobinPool(5));
            _domainParserActor = Context.ActorOf(propParser, "DomainParserActor");

            ReceiveAsync<DomainDTO>(async domain => await HandleParseDomainAsync(domain));
            Receive<string>(domainUrl => HandleParseDomain(domainUrl));
            Receive<DomainStat>(stat => HandleDomainStat(stat));
            Receive<ParsingError>(error => HandleParsingError(error));
        }

        private void HandleParsingError(ParsingError error)
        {
            var errorMessage = string.Format("Failed to get indexing data for the domain {0} with error message: {1}", error.DomainURL, error.ErrorMessage);
            _logger.Error(errorMessage);

            var domain = _domainService.GetDomainByUrl(error.DomainURL);

            Sender.Tell(domain, Self);

        }

        private void HandleDomainStat(DomainStat domainStat)
        {
            try
            {
                _logger.Information($"Currently {domainStat.IndexingData.PagesNumber} pages indexed for the domain {domainStat.DomainURL}");

                var domain = _domainService.GetDomainByUrl(domainStat.DomainURL);
                var result = ProcessDomainWithStat(domain, domainStat);

                _hub.SendDomain(result);
                _logger.Information($"Finished processing of the domain {domainStat.DomainURL}");
            }
            catch(Exception ex)
            {
                _logger.Error($"Error happened while processing the domain: {ex.Message}");
                throw;
            }
        }

        private DomainDTO ProcessDomainWithStat(DomainDTO domain, DomainStat domainStat)
        {
            var hasCurrentDateStats = domain.IndexingStats.Where(st => st.ProcessingDate.Date.Equals(domainStat.IndexingData.ProcessingDate.Date)).Count() != 0;
            if (hasCurrentDateStats)
            {
                domain.IndexingStats.RemoveAt(domain.IndexingStats.Count - 1);
                domain.IndexingStats.Add(domainStat.IndexingData);
            }
            else
            {
                domain.IndexingStats.Add(domainStat.IndexingData);
            }
            if (domainStat.IndexingData.PagesNumber == 0 || (domainStat.IndexingData.PagesNumber != 0 && domain.IsDeindexed == true))
            {
                domain.IsDeindexed = !domain.IsDeindexed;
            }
            var result = _domainService.UpdateDomain(domain);

            return result;
        }

        private void HandleParseDomain(string domainUrl)
        {
            _logger.Information($"Starting processing of the domain {domainUrl}");

            var parserInput = new ParserInput { Url = domainUrl, UseProxy = true };
            _domainParserActor.Tell(parserInput, Self);
        }

        private async Task HandleParseDomainAsync(DomainDTO domain)
        {
            var parserInput = new ParserInput { Url = domain.Url, UseProxy = false };
            await _domainParserActor.Ask<DomainStat>(parserInput).ContinueWith(domainStat =>
            {
                var result = ProcessDomainWithStat(domain, domainStat.Result);
                Sender.Tell(result, Self);
            });
        }

        protected override SupervisorStrategy SupervisorStrategy()
        {
            return new OneForOneStrategy(// or AllForOneStrategy
                maxNrOfRetries: 5,
                withinTimeRange: TimeSpan.FromMinutes(120),
                decider: Decider.From(x =>
                {
                    // Maybe ArithmeticException is not application critical
                    // so we just ignore the error and keep going.
                    if (x is ArithmeticException)
                    {
                        _logger.Information("Resumed processing");
                        return Directive.Resume;
                    }
                    // Error that we have no idea what to do with
                    else if (x is ApplicationException) return Directive.Escalate;

                    // Error that we can't recover from, stop the failing child
                    else if (x is NotSupportedException) return Directive.Stop;

                    // otherwise restart the failing child
                    else
                    {
                        _logger.Information(string.Format("Received error: {0}. Restarting processing of child...", x.Message));
                        return Directive.Restart;
                    };
                }));
        }


    }
}
