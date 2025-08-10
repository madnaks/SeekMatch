using SeekMatch.Core.Entities;

namespace SeekMatch.Infrastructure.Interfaces
{
    public interface IJobApplicationRepository
    {
        Task<JobApplication?> GetByIdAsync(string jobApplicationId);
        Task<IList<JobApplication>?> GetAllByTalentAsync(string talentId);
        Task<IList<JobApplication>?> GetAllByRecruiterAsync();
        Task<JobApplication?> FindByTalentAndJobOfferAsync(string talentId, string jobOfferId);
        Task<JobApplication?> FindByEmailAndExpressApplicationAsync(string email, string jobOfferId);
        Task<bool> ApplyAsync(JobApplication jobApplication);
        Task<bool> RejectAsync(string jobApplicationId, string rejectionReason);
        Task<bool> DeleteAsync(string jobApplicationId);
    }
}
