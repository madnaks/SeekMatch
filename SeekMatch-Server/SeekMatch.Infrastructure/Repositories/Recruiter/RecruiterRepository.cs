using Microsoft.EntityFrameworkCore;
using SeekMatch.Core.Entities;
using SeekMatch.Infrastructure.Interfaces;

namespace SeekMatch.Infrastructure.Repositories
{
    public class RecruiterRepository(SeekMatchDbContext dbContext) : IRecruiterRepository
    {
        public async Task CreateAsync(Recruiter recruiter)
        {
            dbContext.Recruiters.Add(recruiter);
            await dbContext.SaveChangesAsync();
        }
        public async Task<Recruiter?> GetAsync(string userId)
        {
            try
            {
                return await dbContext.Recruiters.Include(t => t.User).FirstOrDefaultAsync(t => t.Id == userId);
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while fetching the recruiter", ex);
            }
        }

        public async Task<bool> SaveChangesAsync(Recruiter recruiter)
        {
            try
            {
                dbContext.Recruiters.Update(recruiter);

                var result = await dbContext.SaveChangesAsync(true);

                return result > 0;
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while saving changes of the recruiter", ex);
            }
        }
    }
}
