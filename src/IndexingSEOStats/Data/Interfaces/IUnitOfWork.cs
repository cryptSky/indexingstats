using IndexingSEOStats.Data.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IndexingSEOStats.Data.Interfaces
{
    public interface IUnitOfWork : IDisposable
    {
        DomainRepository DomainRepository { get; }
    }
}
