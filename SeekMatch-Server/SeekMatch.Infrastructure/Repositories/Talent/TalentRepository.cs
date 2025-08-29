using Microsoft.EntityFrameworkCore;
using SeekMatch.Core.Entities;
using SeekMatch.Infrastructure.Interfaces;

namespace SeekMatch.Infrastructure.Repositories
{
    public class TalentRepository(SeekMatchDbContext dbContext) : ITalentRepository
    {
     
        public async Task CreateAsync(Talent talent)
        {
            dbContext.Talents.Add(talent);
            await dbContext.SaveChangesAsync();
        }

        public async Task<Talent?> GetAsync(string userId)
        {
            try
            {
                var talent = await dbContext.Talents
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
               dbContext.Talents.Update(talent);

                var result = await dbContext.SaveChangesAsync(true);

                return result > 0;
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while saving changes of the talent", ex);
            }
        }
    }
}
