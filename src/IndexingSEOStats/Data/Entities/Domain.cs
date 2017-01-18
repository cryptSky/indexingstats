using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IndexingSEOStats.Data.Entities
{
    public class Domain : Entity
    {
        public string Url { get; set; }
        public string Notes { get; set; }
        public string Tags { get; set; }        
        public List<IndexingData> IndexingStats { get; set; }
        public bool IsDeindexed { get; set; }
        public bool IsDisabled { get; set; }

    }
}
