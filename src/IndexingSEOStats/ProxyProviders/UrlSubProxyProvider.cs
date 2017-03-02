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
        public virtual string Url { get; set; }

        public UrlSubProxyProvider(string urlSub)
        {
            Url = urlSub;
        }
        public WebProxy GetProxy()
        {
            return null;
        }

        public Uri GetRequestUrl(string url)
        {
            var urlStr = string.Format(Url, url);
            return new Uri(urlStr);
        }
    }
}
