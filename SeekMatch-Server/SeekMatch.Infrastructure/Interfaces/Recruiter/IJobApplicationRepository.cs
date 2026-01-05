using SeekMatch.Core.Entities;

namespace SeekMatch.Infrastructure.Interfaces
{
    public interface IJobApplicationRepository
    {
        Task<JobApplication?> GetByIdAsync(string jobApplicationId);
        Task<JobApplication?> GetByIdWithTalentDetailsAsync(string jobApplicationId);
        Task<IList<JobApplication>?> GetAllByTalentAsync(string talentId);
        Task<IList<JobApplication>?> GetAllByRecruiterAsync();
        Task<JobApplication?> FindByTalentAndJobOfferAsync(string talentId, string jobOfferId);
        Task<JobApplication?> FindByEmailAndExpressApplicationAsync(string email, string jobOfferId);
        Task<bool> ApplyAsync(JobApplication jobApplication);
        Task<bool> ExpressApplyAsync(JobApplication jobApplicatio, ExpressApplication expressApplication);
        Task<bool> ShortList(string jobApplicationId);
        Task<bool> InterviewScheduled(string jobApplicationId, string interviewPlatform, DateTime interviewDate);
        Task<bool> Hire(string jobApplicationId);
        Task<bool> RejectAsync(string jobApplicationId, string rejectionReason);
        Task<bool> DeleteAsync(string jobApplicationId);
    }
}
