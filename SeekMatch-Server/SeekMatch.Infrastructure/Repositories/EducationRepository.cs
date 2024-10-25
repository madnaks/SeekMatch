using Microsoft.EntityFrameworkCore;
using SeekMatch.Core.Entities;
using SeekMatch.Infrastructure.Interfaces;

namespace SeekMatch.Infrastructure.Repositories
{
    public class EducationRepository : IEducationRepository
    {
        public readonly SeekMatchDbContext _dbContext;
        public EducationRepository(SeekMatchDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<IList<Education>?> GetAllAsync(string talentId)
        {
            try
            {
                return await _dbContext.Educations.Where(e => e.TalentId == talentId).OrderByDescending(e => e.StartYear).ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while fetching the education", ex);
            }
        }

        public async Task<Education?> GetByIdAsync(string id)
        {
            try
            {
                return await _dbContext.Educations.FindAsync(id);
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while fetching the education", ex);
            }
        }

        public async Task<bool> CreateAsync(Education education)
        {
            try
            {
                _dbContext.Educations.Add(education);
                var result = await _dbContext.SaveChangesAsync();

                return result > 0;
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while creating the education", ex);
            }
        }

        public async Task<bool> UpdateAsync(Education education)
        {
            try
            {
                _dbContext.Educations.Attach(education);

                _dbContext.Entry(education).State = EntityState.Modified;

                var result = await _dbContext.SaveChangesAsync();

                return result > 0;
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while creating the education", ex);
            }
        }

        public async Task<bool> DeleteAsync(string educationId)
        {
            try
            {
                var education = await _dbContext.Educations.FindAsync(educationId);
                if (education != null)
                {
                    _dbContext.Educations.Remove(education);
                    var result = await _dbContext.SaveChangesAsync();
                    return result > 0;
                }
                return false;
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while deleting the education", ex);
            }
        }
    }
}
