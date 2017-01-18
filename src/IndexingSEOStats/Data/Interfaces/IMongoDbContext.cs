using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IndexingSEOStats.Data.Interfaces
{
    public interface IMongoDbContext
    {
        IMongoDatabase Database { get; set; }
    }
}
