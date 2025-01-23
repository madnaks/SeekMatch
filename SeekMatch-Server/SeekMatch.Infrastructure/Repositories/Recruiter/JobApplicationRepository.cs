using Microsoft.EntityFrameworkCore;
using SeekMatch.Core.Entities;
using SeekMatch.Infrastructure.Interfaces;

namespace SeekMatch.Infrastructure.Repositories
{
    public class JobApplicationRepository : IJobApplicationRepository
    {
        public readonly SeekMatchDbContext _dbContext;
        public JobApplicationRepository(SeekMatchDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<IList<JobApplication>?> GetAllByTalentAsync(string talentId)
        {
            try
            {
                return await _dbContext.JobApplications
                    .Where(j => j.TalentId == talentId)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while fetching the job application", ex);
            }
        }
        
        public async Task<IList<JobApplication>?> GetAllByRecruiterAsync()
        {
            try
            {
                return await _dbContext.JobApplications.ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while fetching the job application", ex);
            }
        }

        public async Task<JobApplication?> FindByTalentAndJobOfferAsync(string talentId, string jobOfferId)
        {
            return await _dbContext.JobApplications
                .FirstOrDefaultAsync(ja => ja.TalentId == talentId && ja.JobOfferId == jobOfferId);
        }

        public async Task<bool> ApplyAsync(JobApplication jobApplication)
        {
            try
            {
                _dbContext.JobApplications.Add(jobApplication);
                var result = await _dbContext.SaveChangesAsync();

                return result > 0;
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while creating the job application", ex);
            }
        }

        public async Task<bool> DeleteAsync(string jobApplicationId)
        {
            try
            {
                var jobOffer = await _dbContext.JobApplications.FindAsync(jobApplicationId);
                if (jobOffer != null)
                {
                    _dbContext.JobApplications.Remove(jobOffer);
                    var result = await _dbContext.SaveChangesAsync();
                    return result > 0;
                }
                return false;
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while deleting the job application", ex);
            }
        }
    }
}
