using IndexingSEOStats.Data.DataTransferObjects;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.SignalR.Hubs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static IndexingSEOStats.Actors.DomainParserActor;

namespace IndexingSEOStats.Hubs
{
    [HubName("domainstatsender")]
    public class DomainStatSenderHub : Hub
    {
        public override Task OnConnected()
        {
            // Set connection id for just connected client only
            return Clients.Client(Context.ConnectionId).SetConnectionId(Context.ConnectionId);
        }

        public void SendDomainStat(DomainStat domainStat)
        {
            IHubContext context = Startup.ConnectionManager.GetHubContext<DomainStatSenderHub>();
            context.Clients.All.SendDomainStat(domainStat);
        }
        public void SendDomain(DomainDTO domain)
        {
            IHubContext context = Startup.ConnectionManager.GetHubContext<DomainStatSenderHub>();
            context.Clients.All.SendDomain(domain);
        }
    }
}
