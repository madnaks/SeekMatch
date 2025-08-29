using Microsoft.EntityFrameworkCore;
using SeekMatch.Core.Entities;
using SeekMatch.Infrastructure.Interfaces;

namespace SeekMatch.Infrastructure.Repositories
{
    public class EducationRepository(SeekMatchDbContext dbContext) : IEducationRepository
    {
        public async Task<IList<Education>?> GetAllAsync(string talentId)
        {
            try
            {
                return await dbContext.Educations
                    .Where(e => e.TalentId == talentId)
                    .OrderByDescending(e => e.StartYear)
                    .ThenByDescending(e => e.StartMonth)
                    .ToListAsync();
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
                return await dbContext.Educations.FindAsync(id);
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
                dbContext.Educations.Add(education);
                var result = await dbContext.SaveChangesAsync();

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
                dbContext.Educations.Attach(education);

                dbContext.Entry(education).State = EntityState.Modified;

                var result = await dbContext.SaveChangesAsync();

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
                var education = await dbContext.Educations.FindAsync(educationId);
                if (education != null)
                {
                    dbContext.Educations.Remove(education);
                    var result = await dbContext.SaveChangesAsync();
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
