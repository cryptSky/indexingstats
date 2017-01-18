using IndexingSEOStats.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace IndexingSEOStats.ProxyProviders
{
    public class UrlSubProxyProvider : IProxyProvider
    {
        public string UrlSub { get; set; }

        public UrlSubProxyProvider(string urlSub)
        {
            UrlSub = urlSub;
        }
        public WebProxy GetProxy()
        {
            return null;
        }

        public Uri GetRequestUrl(string url)
        {
            var urlStr = string.Format(UrlSub, url);
            return new Uri(urlStr);
        }
    }
}
