using Microsoft.EntityFrameworkCore;
using SeekMatch.Core.Entities;
using SeekMatch.Infrastructure.Interfaces;

namespace SeekMatch.Infrastructure.Repositories
{
    public class JobApplicationRepository(SeekMatchDbContext dbContext) : IJobApplicationRepository
    {
        public async Task<JobApplication?> GetByIdAsync(string jobApplicationId)
        {
            try
            {
                return await dbContext.JobApplications.Where(j => j.Id == jobApplicationId)
                    .Include(j => j.ExpressApplication)
                    .Include(j => j.JobOffer)
                    .FirstAsync();
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
                return await dbContext.JobApplications
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
                return await dbContext.JobApplications.ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while fetching the job application", ex);
            }
        }

        public async Task<JobApplication?> FindByTalentAndJobOfferAsync(string talentId, string jobOfferId)
        {
            return await dbContext.JobApplications
                .FirstOrDefaultAsync(ja => ja.TalentId == talentId && ja.JobOfferId == jobOfferId);
        }

        public async Task<JobApplication?> FindByEmailAndExpressApplicationAsync(string email, string jobOfferId)
        {
            return await dbContext.JobApplications
                .FirstOrDefaultAsync(ja => ja.JobOfferId == jobOfferId && ja.ExpressApplication.Email == email);
        }

        public async Task<bool> ApplyAsync(JobApplication jobApplication)
        {
            try
            {
                dbContext.JobApplications.Add(jobApplication);
                return await dbContext.SaveChangesAsync() > 0;
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while creating the job application", ex);
            }
        }

        public async Task<bool> ExpressApplyAsync(JobApplication jobApplication, ExpressApplication expressApplication)
        {
            try
            {
                dbContext.JobApplications.Add(jobApplication);
                dbContext.ExpressApplications.Add(expressApplication);
                return await dbContext.SaveChangesAsync() > 0;
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while creating the job application", ex);
            }
        }

        public async Task<bool> ShortList(string jobApplicationId)
        {
            try
            {
                var jobApplication = await dbContext.JobApplications.FindAsync(jobApplicationId);
                if (jobApplication != null)
                {
                    jobApplication.Status = Core.Enums.JobApplicationStatus.Shortlisted;
                    
                    return await dbContext.SaveChangesAsync() > 0;
                }
                return false;
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while short listed the job application", ex);
            }
        }

        public async Task<bool> InterviewScheduled(string jobApplicationId, string interviewPlatform, DateTime interviewDate)
        {
            try
            {
                var jobApplication = await dbContext.JobApplications.FindAsync(jobApplicationId);
                if (jobApplication != null)
                {
                    jobApplication.Status = Core.Enums.JobApplicationStatus.InterviewScheduled;
                    jobApplication.InterviewPlatform = interviewPlatform;
                    jobApplication.InterviewDate = interviewDate;

                    return await dbContext.SaveChangesAsync() > 0;
                }
                return false;
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while short listed the job application", ex);
            }
        }

        public async Task<bool> Hire(string jobApplicationId)
        {
            try
            {
                var jobApplication = await dbContext.JobApplications.FindAsync(jobApplicationId);
                if (jobApplication != null)
                {
                    jobApplication.Status = Core.Enums.JobApplicationStatus.Hired;

                    return await dbContext.SaveChangesAsync() > 0;
                }
                return false;
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while hiring the talent", ex);
            }
        }

        public async Task<bool> RejectAsync(string jobApplicationId, string rejectionReason)
        {
            try
            {
                var jobApplication = await dbContext.JobApplications.FindAsync(jobApplicationId);
                if (jobApplication != null)
                {
                    jobApplication.Status = Core.Enums.JobApplicationStatus.Rejected;
                    jobApplication.RejectionReason = rejectionReason;
                    
                    return await dbContext.SaveChangesAsync() > 0;
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
                var jobApplication = await dbContext.JobApplications.FindAsync(jobApplicationId);
                if (jobApplication != null)
                {
                    dbContext.JobApplications.Remove(jobApplication);
                    return await dbContext.SaveChangesAsync() > 0;
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
