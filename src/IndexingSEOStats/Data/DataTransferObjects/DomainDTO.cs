using IndexingSEOStats.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IndexingSEOStats.Data.DataTransferObjects
{
    public class DomainDTO
    {
        public string Url { get; set; }
        public string Notes { get; set; }
        public string Tags { get; set; }
        public List<IndexingData> IndexingStats { get; set; }
        public bool IsDeindexed { get; set; }
        public bool IsDisabled { get; set; }

        public DomainDTO()
        {
            IndexingStats = new List<IndexingData>();
        }

        public override string ToString()
        {
            return Url;
        }
    }

    public class DomainInput
    {
        public DomainDTO Domain { get; set; }
        public DateRange Range { get; set; }
    }
}
