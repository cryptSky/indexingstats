using IndexingSEOStats.Data.Entities;
using System;
using System.Net;

namespace IndexingSEOStats.Interfaces
{
    public interface IProxyProvider
    {
        WebProxy GetProxy();
        Uri GetRequestUrl(string url);
    }
}