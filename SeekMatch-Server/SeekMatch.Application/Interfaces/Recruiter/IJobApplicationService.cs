using SeekMatch.Application.DTOs.Recruiter;

namespace SeekMatch.Application.Interfaces
{
    public interface IJobApplicationService
    {
        Task<IList<JobApplicationDto>?> GetAllByTalentAsync(string talentId);
        Task<IList<JobApplicationDto>?> GetAllByRecruiterAsync();
        Task<bool> ApplyAsync(string talentId, string jobOfferId);
        Task<bool> DeleteAsync(string jobApplicationId);
    }
}
