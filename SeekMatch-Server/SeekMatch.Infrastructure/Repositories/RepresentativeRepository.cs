using SeekMatch.Core.Entities;
using SeekMatch.Infrastructure.Interfaces;

namespace SeekMatch.Infrastructure.Repositories
{
    public class RepresentativeRepository : IRepresentativeRepository
    {
        public readonly SeekMatchDbContext _dbContext;
        public RepresentativeRepository(SeekMatchDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task CreateAsync(Representative representative)
        {
            _dbContext.Representatives.Add(representative);
            await _dbContext.SaveChangesAsync();
        }
    }
}
