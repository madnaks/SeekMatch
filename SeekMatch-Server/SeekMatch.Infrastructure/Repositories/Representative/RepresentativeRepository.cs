using Microsoft.EntityFrameworkCore;
using SeekMatch.Core.Entities;
using SeekMatch.Infrastructure.Interfaces;

namespace SeekMatch.Infrastructure.Repositories
{
    public class RepresentativeRepository(SeekMatchDbContext dbContext) : IRepresentativeRepository
    {
        public async Task RegisterAsync(Representative representative)
        {
            dbContext.Representatives.Add(representative);
            await dbContext.SaveChangesAsync();
        }
        public async Task<Representative?> GetAsync(string userId)
        {
            try
            {
                return await dbContext.Representatives
                    .Include(r => r.Company)
                    .ThenInclude(c => c.Recruiters)
                    .ThenInclude(recruiter => recruiter.User)
                    .Include(t => t.User)
                    .FirstOrDefaultAsync(t => t.Id == userId);
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while fetching the recruiter", ex);
            }
        }

        public async Task<bool> SaveChangesAsync(Representative representative)
        {
            try
            {
                dbContext.Representatives.Update(representative);

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
