using Akka.Actor;
using HtmlAgilityPack;
using IndexingSEOStats.Data.DataTransferObjects;
using IndexingSEOStats.Data.Entities;
using IndexingSEOStats.Interfaces;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Xml;

namespace IndexingSEOStats.Actors
{
    public class DomainParserActor : ReceiveActor
    {
        #region Messanges
        public class DomainStat
        {
            public string DomainURL { get; set; }
            public IndexingData IndexingData { get; set; }
        }

        public class ParsingError
        {
            public string DomainURL { get; set; }
            public string ErrorMessage { get; set; }
        }

        #endregion

        private const string GoogleSearchUrl = "https://www.google.com/search?q=site:{0}&start=0";
        private IProxyProvider _proxyProvider;

        public DomainParserActor(IProxyProvider proxyProvider)
        {
            _proxyProvider = proxyProvider;

            Receive<string>(domainUrl => HandleDomainUrl(domainUrl));
            //ReceiveAsync<DomainDTO>(async domain => await HandleDomainAsync(domain));
            
        }
        protected override void PreRestart(Exception reason, object message)
        {
            // put message back in mailbox for re-processing after restart
            if (message != null)
            {
                Self.Tell(message);
            }
            
        }

        private void HandleDomainUrl(string domainUrl)
        {
            IndexingData indexingData = null; 
            using (var webClient = new WebClient())
            {
                webClient.Proxy = _proxyProvider.GetProxy();
                var url = _proxyProvider.GetRequestUrl(string.Format(GoogleSearchUrl, domainUrl));

                webClient.Headers.Add("Accept-Language", "en-US");

                var pageData = webClient.DownloadString(url);

                var page = new HtmlDocument();
                page.LoadHtml(pageData);

                HtmlNode resultStatsNode = page.GetElementbyId("resultStats");
                 if (resultStatsNode == null || resultStatsNode.InnerHtml == string.Empty)
                {
                    indexingData = new IndexingData
                    {
                        PagesNumber = 0,
                        ProcessingDate = DateTime.Now.Date
                    };

                    var domainStat = new DomainStat { DomainURL = domainUrl, IndexingData = indexingData };

                    Sender.Tell(domainStat, Self);
                    return;
                }

                var resultStats = HtmlEntity.DeEntitize(resultStatsNode.InnerHtml);

                Regex regex = new Regex(@" [0-9,. ]+");
                Match match = regex.Match(resultStats);

                if (match.Success)
                {
                    var numberString = match.Value.Replace(",", "").Replace(".", "").Replace(" ", "");
                    var indexedPagesNumber = long.Parse(numberString);
                    
                    indexingData = new IndexingData
                    {
                        PagesNumber = indexedPagesNumber,
                        ProcessingDate = DateTime.Now.Date
                    };

                    var domainStat = new DomainStat { DomainURL = domainUrl, IndexingData = indexingData };

                    Sender.Tell(domainStat, Self);
                }
                else
                {
                    var errorMessage = "Match was not successful! Result stats: " + resultStats;
                    var parsingError = new ParsingError { DomainURL = domainUrl, ErrorMessage = errorMessage };
                    Sender.Tell(parsingError, Self);
                }              
           
            }
        }
    }
}
