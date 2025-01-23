using SeekMatch.Core.Entities;

namespace SeekMatch.Infrastructure.Interfaces
{
    public interface IJobApplicationRepository
    {
        Task<IList<JobApplication>?> GetAllByTalentAsync();
        Task<IList<JobApplication>?> GetAllByRecruiterAsync();
        Task<bool> CreateAsync(JobApplication jobApplication);
        Task<bool> DeleteAsync(string jobApplicationId);
    }
}
