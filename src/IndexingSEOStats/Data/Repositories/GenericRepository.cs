using MongoDB.Bson;
using MongoDB.Driver;
using IndexingSEOStats.Data.Entities;
using IndexingSEOStats.Data.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace IndexingSEOStats.Data.Repositories
{
    public class GenericRepository<TEntity> : IGenericRepository<TEntity> where TEntity : Entity, new()
    {
        private IMongoDbContext _context;
        public IMongoCollection<TEntity> Collection { get; set; }

        public GenericRepository(IMongoDbContext context)
        {
            _context = context;

            var collectionName = typeof(TEntity).Name;
            
            Collection = _context.Database.GetCollection<TEntity>(collectionName);
        }

        public async Task<TEntity> GetByKeyAsync(object keyValue)
        {
            var id = (ObjectId)keyValue;
            var filter = Builders<TEntity>.Filter.Eq(q => q.Id, id);
            var result = await Collection.Find(filter).SingleAsync();

            return result;
        }

        public IQueryable<TEntity> GetQuery()
        {
            return Collection.AsQueryable();
        }

        public async Task<TEntity> AddAsync(TEntity entity)
        {
            await Collection.InsertOneAsync(entity, new InsertOneOptions { BypassDocumentValidation = true });
            return entity;
        }

        public async Task RemoveAsync(TEntity entity)
        {
            var filter = Builders<TEntity>.Filter.Eq(q => q.Id, entity.Id);
            var result = await Collection.DeleteOneAsync(filter);
        }

        public async Task<IList<TEntity>> GetAllAsync()
        {
            return await Collection.Find(_ => true).ToListAsync();
        }

        public async Task<ReplaceOneResult> SaveAsync(TEntity doc)
        {
            return await Collection.ReplaceOneAsync(w => w.Id.Equals(doc.Id), doc, new UpdateOptions { IsUpsert = true });
        }

        public async Task<long> GetCountAsync()
        {
            return await Collection.CountAsync(new BsonDocument());
        }

        public IList<TEntity> SearchFor(Expression<Func<TEntity, bool>> predicate)
        {
            return GetQuery()
                    .Where(predicate)
                        .ToList();
        }
    }
}
