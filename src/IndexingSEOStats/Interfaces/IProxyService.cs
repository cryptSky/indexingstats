using IndexingSEOStats.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IndexingSEOStats.Interfaces
{
    public interface IProxyService
    {
        Proxy GetProxy(IProxyProvider provider);
    }
}
