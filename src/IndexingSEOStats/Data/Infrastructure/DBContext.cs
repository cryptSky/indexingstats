using Microsoft.Extensions.Configuration;
using MongoDB.Bson.Serialization;
using MongoDB.Driver;
using IndexingSEOStats.Data.Entities;
using IndexingSEOStats.Data.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IndexingSEOStats.Data.Infrastructure
{
    public class DBContext :  IMongoDbContext
    {
        private IConfigurationRoot _configuration;
        public DBContext(IConfigurationRoot configuration) : base()
        {
            _configuration = configuration;

            //BsonClassMap.RegisterClassMap<IndexingData>();
            //BsonClassMap.RegisterClassMap<Domain>();

            string connectionString = configuration.GetConnectionString("ConnectionString");
            string databaseName = configuration.GetConnectionString("DBName");

            var client = new MongoClient(connectionString);
            Database = client.GetDatabase(databaseName);
            
        }

        public IMongoDatabase Database { get; set; }

    }
 
}
