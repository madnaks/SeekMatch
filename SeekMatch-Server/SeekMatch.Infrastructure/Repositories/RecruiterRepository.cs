using SeekMatch.Core.Entities;
using SeekMatch.Infrastructure.Interfaces;

namespace SeekMatch.Infrastructure.Repositories
{
    public class RecruiterRepository : IRecruiterRepository
    {
        public readonly SeekMatchDbContext _dbContext;
        public RecruiterRepository(SeekMatchDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task CreateAsync(Recruiter recruiter)
        {
            _dbContext.Recruiters.Add(recruiter);
            await _dbContext.SaveChangesAsync();
        }
    }
}
