using IndexingSEOStats.Data.Interfaces;
using IndexingSEOStats.Data.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IndexingSEOStats.Data.Infrastructure
{
    public class UnitOfWork : IUnitOfWork
    {
        private DomainRepository _domainRepository;
        private DBContext _context;

        public DomainRepository DomainRepository
        {
            get
            {
                return _domainRepository ?? (_domainRepository = new DomainRepository(_context));
            }
        }

        public UnitOfWork(DBContext context)
        {
            _context = context;
        }

        public void Dispose()
        {
            throw new NotImplementedException();
        }
    }
}
