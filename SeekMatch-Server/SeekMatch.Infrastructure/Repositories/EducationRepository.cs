using Microsoft.EntityFrameworkCore;
using SeekMatch.Core.Entities;
using SeekMatch.Infrastructure.Interfaces;

namespace SeekMatch.Infrastructure.Repositories
{
    public class ExperienceRepository : IExperienceRepository
    {
        public readonly SeekMatchDbContext _dbContext;
        public ExperienceRepository(SeekMatchDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<IList<Experience>?> GetAllAsync(string talentId)
        {
            try
            {
                return await _dbContext.Experiences.Where(e => e.TalentId == talentId).OrderByDescending(e => e.StartYear).ToListAsync();
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
                return await _dbContext.Experiences.FindAsync(id);
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
                _dbContext.Experiences.Add(experience);
                var result = await _dbContext.SaveChangesAsync();

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
                _dbContext.Experiences.Attach(experience);

                _dbContext.Entry(experience).State = EntityState.Modified;

                var result = await _dbContext.SaveChangesAsync();

                return result > 0;
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while creating the experience", ex);
            }
        }

        public async Task<bool> DeleteAsync(string educationId)
        {
            try
            {
                var experience = await _dbContext.Experiences.FindAsync(educationId);
                if (experience != null)
                {
                    _dbContext.Experiences.Remove(experience);
                    var result = await _dbContext.SaveChangesAsync();
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
