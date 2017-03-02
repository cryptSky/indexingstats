using IndexingSEOStats.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using IndexingSEOStats.Data.Entities;
using System.Net;

namespace IndexingSEOStats.ProxyProviders
{
    public class HubProxyProvider : IProxyProvider
    {
        public virtual string Url { get; set; }
        public HubProxyProvider(string hubUrl)
        {
            Url = hubUrl;
        }
        public WebProxy GetProxy()
        {
            var proxy = new WebProxy(Url);
            return proxy;
        }

        public Uri GetRequestUrl(string url)
        {
            return new Uri(url);
        }
    }
}
