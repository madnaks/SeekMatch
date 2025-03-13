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

        public async Task<JobApplication?> GetByIdAsync(string jobApplicationId)
        {
            try
            {
                return await _dbContext.JobApplications.FindAsync(jobApplicationId);
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while fetching the job application", ex);
            }
        }
        
        public async Task<IList<JobApplication>?> GetAllByTalentAsync(string talentId)
        {
            try
            {
                return await _dbContext.JobApplications
                    .Where(j => j.TalentId == talentId)
                    .Include(j => j.JobOffer)
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
                return await _dbContext.SaveChangesAsync() > 0;
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while creating the job application", ex);
            }
        }

        public async Task<bool> RejectAsync(string jobApplicationId, string rejectionReason)
        {
            try
            {
                var jobApplication = await _dbContext.JobApplications.FindAsync(jobApplicationId);
                if (jobApplication != null)
                {
                    jobApplication.Status = Core.Enums.JobApplicationStatus.Rejected;
                    jobApplication.RejectionReason = rejectionReason;
                    
                    return await _dbContext.SaveChangesAsync() > 0;
                }
                return false;
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while rejecting the job application", ex);
            }
        }
        
        public async Task<bool> DeleteAsync(string jobApplicationId)
        {
            try
            {
                var jobApplication = await _dbContext.JobApplications.FindAsync(jobApplicationId);
                if (jobApplication != null)
                {
                    _dbContext.JobApplications.Remove(jobApplication);
                    return await _dbContext.SaveChangesAsync() > 0;
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
