using IndexingSEOStats.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Net;

namespace IndexingSEOStats.ProxyProviders
{
    public class NullProxyProvider : IProxyProvider
    {
        public WebProxy GetProxy()
        {
            return null;
        }

        public Uri GetRequestUrl(string url)
        {
            return new Uri(url);
        }
    }
}
