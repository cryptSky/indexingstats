using Akka.Actor;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IndexingSEOStats.Actors
{
    public static class SystemActors
    {
        public static IActorRef CoordinatorActor = ActorRefs.Nobody;

        public static IActorRef DomainProcessorActor = ActorRefs.Nobody;
    }

    public static class ActorSystemRefs
    {
        public static ActorSystem ActorSystem { get; set; }
    }
}
