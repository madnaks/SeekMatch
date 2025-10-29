using Microsoft.EntityFrameworkCore;
using SeekMatch.Core.Entities;
using SeekMatch.Infrastructure.Interfaces;

namespace SeekMatch.Infrastructure.Repositories
{
    public class ResumeRepository(SeekMatchDbContext dbContext) : IResumeRepository
    {
        public async Task<IList<Resume>?> GetAllAsync(string talentId)
        {
            try
            {
                return await dbContext.Resumes
                    .Where(e => e.TalentId == talentId)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while fetching the resume", ex);
            }
        }

        public async Task<Resume?> GetByIdAsync(string id)
        {
            try
            {
                return await dbContext.Resumes.FindAsync(id);
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while fetching the resume", ex);
            }
        }

        public async Task<bool> CreateAsync(Resume resume)
        {
            try
            {
                UpdatePrimaryResume(resume);
                dbContext.Resumes.Add(resume);

                var result = await dbContext.SaveChangesAsync();

                return result > 0;
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while creating the resume", ex);
            }
        }

        public async Task<bool> UpdateAsync(Resume resume)
        {
            try
            {
                UpdatePrimaryResume(resume);
                dbContext.Resumes.Attach(resume);

                dbContext.Entry(resume).State = EntityState.Modified;

                var result = await dbContext.SaveChangesAsync();

                return result > 0;
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while creating the resume", ex);
            }
        }

        public async Task<bool> DeleteAsync(string resumeId)
        {
            try
            {
                var resume = await dbContext.Resumes.FindAsync(resumeId);
                if (resume != null)
                {
                    dbContext.Resumes.Remove(resume);
                    var result = await dbContext.SaveChangesAsync();
                    return result > 0;
                }
                return false;
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while deleting the resume", ex);
            }
        }

        private void UpdatePrimaryResume(Resume currentResume)
        {
            if (currentResume.IsPrimary)
            {
                foreach (var resume in dbContext.Resumes)
                {
                    if (resume.Id != currentResume.Id && resume.IsPrimary)
                    {
                        resume.IsPrimary = false;
                        dbContext.Entry(resume).State = EntityState.Modified;
                    }
                }
            }
        }
    }
}
