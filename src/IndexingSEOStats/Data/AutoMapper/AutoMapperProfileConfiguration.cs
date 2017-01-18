using AutoMapper;
using IndexingSEOStats.Data.DataTransferObjects;
using IndexingSEOStats.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IndexingSEOStats.Data.AutoMapper
{
    public class AutoMapperProfileConfiguration : Profile
    {
        public AutoMapperProfileConfiguration()
        {
            CreateMap<Domain, DomainDTO>();
            CreateMap<DomainDTO, Domain>();            
        }
    }
}
