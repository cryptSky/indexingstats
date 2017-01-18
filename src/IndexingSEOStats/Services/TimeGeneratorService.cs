using IndexingSEOStats.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

// a[t] = min+t*(max-min) / (x+1)

namespace IndexingSEOStats.Services
{
    public class TimeGeneratorService : ITimeGeneratorService
    {
        private int _timePeriodSec;
        private int _startTime;
        private readonly int _defaultStartTime;
        private static int _currentIndex = 1;
             
        public TimeGeneratorService(int timePeriodSec = 86400, int startTime = 300)
        {
            _timePeriodSec = timePeriodSec;
            _startTime = startTime;
            _defaultStartTime = startTime;
        }

        public DateTime Next(int periodsNumber, bool today = false)
        {
            var _current = _currentIndex * (_timePeriodSec - _startTime) / (periodsNumber + 1) + _startTime;
            var time = TimeSpan.FromSeconds(_current);
            _currentIndex++;

            var dateTime = DateTime.Now;
            if (!today)
            {
                dateTime = DateTime.Today.Add(TimeSpan.FromDays(1)).Date;
            }
                       
            dateTime += time;
            return dateTime;
        }

        public void Reset()
        {
            _currentIndex = 1;
            _startTime = _defaultStartTime;            
        }
       
    }
}
