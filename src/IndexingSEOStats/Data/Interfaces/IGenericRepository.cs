using MongoDB.Driver;
using IndexingSEOStats.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IndexingSEOStats.Data.Interfaces
{
    public interface IGenericRepository<TEntity> where TEntity : Entity
    {
        IMongoCollection<TEntity> Collection { get; set; }

        Task<TEntity> GetByKeyAsync(object keyValue);
        IQueryable<TEntity> GetQuery();
        Task<TEntity> AddAsync(TEntity entity);
        Task RemoveAsync(TEntity entity);
        Task<IList<TEntity>> GetAllAsync();
        Task<ReplaceOneResult> SaveAsync(TEntity doc);
    }
}
