using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IndexingSEOStats.Interfaces
{
    public interface ITimeGeneratorService
    {
        DateTime Next(int periodsNumber, bool today);
        void Reset();
        
    }
}
