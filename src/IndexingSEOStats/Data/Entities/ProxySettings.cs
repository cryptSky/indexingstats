using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IndexingSEOStats.Data.Entities
{
    public class Setting
    {
        public string Type { get; set; }

        public string Url { get; set; }
    }

    public class ProxySettings
    {
        public Dictionary<string, Setting> Settings { get; set; }

        public string Type { get; set; }
    }


}
