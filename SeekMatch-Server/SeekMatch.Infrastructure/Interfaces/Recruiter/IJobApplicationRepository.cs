using SeekMatch.Core.Entities;

namespace SeekMatch.Infrastructure.Interfaces
{
    public interface IJobApplicationRepository
    {
        Task<IList<JobApplication>?> GetAllByTalentAsync(string talentId);
        Task<IList<JobApplication>?> GetAllByRecruiterAsync();
        Task<JobApplication?> FindByTalentAndJobOfferAsync(string talentId, string jobOfferId);
        Task<bool> ApplyAsync(JobApplication jobApplication);
        Task<bool> DeleteAsync(string jobApplicationId);
    }
}
