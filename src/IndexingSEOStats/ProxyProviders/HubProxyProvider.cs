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
        public string HubUrl { get; set; }
        public HubProxyProvider(string hubUrl)
        {
            HubUrl = hubUrl;
        }
        public WebProxy GetProxy()
        {
            var proxy = new WebProxy(HubUrl);
            return proxy;
        }

        public Uri GetRequestUrl(string url)
        {
            return new Uri(url);
        }
    }
}
