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

        public class ParserInput
        {
            public string Url { get; set; }
            public bool UseProxy { get; set; }
        }

        #endregion

        private const string GoogleSearchUrl = "https://www.google.com/search?q=site:{0}&start=0";
        private IProxyProvider _proxyProvider;

        public DomainParserActor(IProxyProvider proxyProvider)
        {
            _proxyProvider = proxyProvider;

            Receive<ParserInput>(domainUrl => HandleDomainUrl(domainUrl));
            //ReceiveAsync<DomainDTO>(async domain => await HandleDomainAsync(domain));
            
        }
        protected override void PreRestart(Exception reason, object message)
        {
            // put message back in mailbox for re-processing after restart
            if (message != null)
            {
                if (reason.Message.Contains("(403) Forbidden") || reason.Message.Contains("(503)"))
                {
                    var errorMessage = "Proxy server is not responding!";
                    var parsingError = new ParsingError { DomainURL = ((ParserInput)message).Url, ErrorMessage = errorMessage };
                    Sender.Tell(parsingError, Self);
                }
                else
                {
                    Self.Tell(message);
                }
                
            }
            
        }

        private void HandleDomainUrl(ParserInput message)
        {
            IndexingData indexingData = null; 
            using (var webClient = new WebClient())
            {
                if (message.UseProxy)
                {
                    webClient.Proxy = _proxyProvider.GetProxy();
                }
                
                var url = _proxyProvider.GetRequestUrl(string.Format(GoogleSearchUrl, message.Url));

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

                    var domainStat = new DomainStat { DomainURL = message.Url, IndexingData = indexingData };

                    Sender.Tell(domainStat, Self);
                    return;
                }

                var resultStats = HtmlEntity.DeEntitize(resultStatsNode.InnerHtml);

                var firstNumberIndex = resultStats.IndexOfAny("123456789".ToCharArray());
                var lastNumberIndex = resultStats.LastIndexOfAny("0123456789".ToCharArray());
                
                if (firstNumberIndex >= 0 && lastNumberIndex >= 0 && lastNumberIndex >= firstNumberIndex)
                {
                    var match = resultStats.Substring(firstNumberIndex, lastNumberIndex - firstNumberIndex + 1);

                    var numberString = match.Replace(",", string.Empty).Replace(".", string.Empty);
                    numberString = Regex.Replace(numberString, @"\s+", "");

                    var indexedPagesNumber = long.Parse(numberString);
                    
                    indexingData = new IndexingData
                    {
                        PagesNumber = indexedPagesNumber,
                        ProcessingDate = DateTime.Now.Date
                    };

                    var domainStat = new DomainStat { DomainURL = message.Url, IndexingData = indexingData };

                    Sender.Tell(domainStat, Self);
                }
                else
                {
                    var errorMessage = "Match was not successful! Result stats: " + resultStats;
                    var parsingError = new ParsingError { DomainURL = message.Url, ErrorMessage = errorMessage };
                    Sender.Tell(parsingError, Self);
                }              
           
            }
        }
    }
}
