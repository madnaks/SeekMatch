using Microsoft.EntityFrameworkCore;
using SeekMatch.Core.Entities;
using SeekMatch.Infrastructure.Interfaces;

namespace SeekMatch.Infrastructure.Repositories
{
    public class TalentRepository : ITalentRepository
    {
        public readonly SeekMatchDbContext _dbContext;
        public TalentRepository(SeekMatchDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task CreateAsync(Talent talent)
        {
            _dbContext.Talents.Add(talent);
            await _dbContext.SaveChangesAsync();
        }

        public async Task<Talent?> GetAsync(string userId)
        {
            try
            {
                var talent = await _dbContext.Talents
                    .Include(t => t.User)
                    .Include(t => t.Educations)
                    .Include(t => t.Experiences)
                    .FirstOrDefaultAsync(t => t.Id == userId);

                if (talent != null)
                {
                    talent.Educations = talent.Educations
                        .OrderByDescending(e => e.StartYear)
                        .ThenByDescending(e => e.StartMonth)
                        .ToList();

                    talent.Experiences = talent.Experiences
                        .OrderByDescending(e => e.StartYear)
                        .ThenByDescending(e => e.StartMonth)
                        .ToList();
                }

                return talent;
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while fetching the talent", ex);
            }
        }

        public async Task<bool> SaveChangesAsync(Talent talent)
        {
            try
            {
               _dbContext.Talents.Update(talent);

                var result = await _dbContext.SaveChangesAsync(true);

                return result > 0;
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while saving changes of the talent", ex);
            }
        }
    }
}
