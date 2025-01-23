using SeekMatch.Application.DTOs.Recruiter;

namespace SeekMatch.Application.Interfaces
{
    public interface IJobApplicationService
    {
        Task<IList<JobApplicationDto>?> GetAllByTalentAsync();
        Task<IList<JobApplicationDto>?> GetAllByRecruiterAsync();
        Task<bool> CreateAsync(string talentId, string jobOfferId);
        Task<bool> DeleteAsync(string jobApplicationId);
    }
}
