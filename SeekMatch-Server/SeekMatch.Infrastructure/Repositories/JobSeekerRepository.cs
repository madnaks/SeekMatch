using SeekMatch.Core.Entities;
using SeekMatch.Core.Interfaces;
using SeekMatch.Infrastructure;

namespace SeekMatch.Core.Repositories
{
    public class JobSeekerRepository : IJobSeekerRepository
    {
        public readonly SeekMatchDbContext _dbContext;
        public JobSeekerRepository(SeekMatchDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task CreateAsync(JobSeeker jobSeeker)
        {
            _dbContext.JobSeekers.Add(jobSeeker);
            await _dbContext.SaveChangesAsync();
        }
    }
}
