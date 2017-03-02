using IndexingSEOStats.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using IndexingSEOStats.Data.Entities;
using System.Net;

namespace IndexingSEOStats.ProxyProviders
{
    public class FetcherProxyProvider : IProxyProvider
    {
        public string FetcherApiUrl { get; set; }

        public virtual string Url
        {
            get
            {
                throw new NotImplementedException();
            }

            set
            {
                throw new NotImplementedException();
            }
        }

        public FetcherProxyProvider(string fetcherApiUrl)
        {
            FetcherApiUrl = fetcherApiUrl;
        }
        public WebProxy GetProxy()
        {
            throw new NotImplementedException();
        }

        public Uri GetRequestUrl(string url)
        {
            return new Uri(url);
        }
    }
}
