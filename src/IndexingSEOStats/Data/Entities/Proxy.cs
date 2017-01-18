using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IndexingSEOStats.Data.Entities
{
    public class Proxy
    {
        public ProxyTtype Type { get; set; }
        public string Address { get; set; }
        public int Port { get; set; }
    }

    public enum ProxyTtype
    {
        HTTP,
        HTTPS,
        SOCKS
    }

}
