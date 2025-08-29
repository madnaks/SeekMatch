using Microsoft.EntityFrameworkCore;
using SeekMatch.Core.Entities;
using SeekMatch.Infrastructure.Interfaces;

namespace SeekMatch.Infrastructure.Repositories
{
    public class ExperienceRepository(SeekMatchDbContext dbContext) : IExperienceRepository
    {
        public async Task<IList<Experience>?> GetAllAsync(string talentId)
        {
            try
            {
                return await dbContext.Experiences
                    .Where(e => e.TalentId == talentId)
                    .OrderByDescending(e => e.StartYear)
                    .ThenByDescending(e => e.StartMonth)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while fetching the experience", ex);
            }
        }

        public async Task<Experience?> GetByIdAsync(string id)
        {
            try
            {
                return await dbContext.Experiences.FindAsync(id);
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while fetching the experience", ex);
            }
        }

        public async Task<bool> CreateAsync(Experience experience)
        {
            try
            {
                dbContext.Experiences.Add(experience);
                var result = await dbContext.SaveChangesAsync();

                return result > 0;
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while creating the experience", ex);
            }
        }

        public async Task<bool> UpdateAsync(Experience experience)
        {
            try
            {
                dbContext.Experiences.Attach(experience);

                dbContext.Entry(experience).State = EntityState.Modified;

                var result = await dbContext.SaveChangesAsync();

                return result > 0;
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while creating the experience", ex);
            }
        }

        public async Task<bool> DeleteAsync(string experienceId)
        {
            try
            {
                var experience = await dbContext.Experiences.FindAsync(experienceId);
                if (experience != null)
                {
                    dbContext.Experiences.Remove(experience);
                    var result = await dbContext.SaveChangesAsync();
                    return result > 0;
                }
                return false;
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while deleting the experience", ex);
            }
        }
    }
}
