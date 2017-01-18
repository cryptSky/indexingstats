using IndexingSEOStats.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using IndexingSEOStats.Data.Entities;
using System.Net;

namespace IndexingSEOStats.ProxyProviders
{
    public class ListProxyProvider : IProxyProvider
    {
        public string ListUrl { get; set; }

        public ListProxyProvider(string address, ListProxyProviderType type)
        {
            if (type == ListProxyProviderType.ListPageParser)
            {
                ListUrl = address;
            } 
            else
            {
                ListUrl = address;
            }
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

    public enum ListProxyProviderType
    {
        ListPageParser,
        ListApiFetcher
    }
}
