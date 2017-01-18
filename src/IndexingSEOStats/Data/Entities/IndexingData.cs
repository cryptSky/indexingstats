using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IndexingSEOStats.Data.Entities
{
    public class IndexingData
    {
        //[BsonDateTimeOptions(DateOnly = true)]
        public DateTime ProcessingDate { get; set; }
        public long PagesNumber { get; set; }
    }

}
