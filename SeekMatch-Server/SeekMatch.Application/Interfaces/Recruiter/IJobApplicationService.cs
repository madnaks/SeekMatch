using SeekMatch.Application.DTOs.Recruiter;

namespace SeekMatch.Application.Interfaces
{
    public interface IJobApplicationService
    {
        Task<IList<JobApplicationDto>?> GetAllByTalentAsync(string talentId);
        Task<IList<JobApplicationDto>?> GetAllByRecruiterAsync();
        Task<bool> ApplyAsync(string talentId, string jobOfferId);
        Task<bool> ExpressApplyAsync(ExpressApplicationDto expressApplicationDto,string jobOfferId, Stream cvStream, string fileName);
        Task<bool> RejectAsync(string jobApplicationId, string rejectionReason);
        Task<bool> DeleteAsync(string jobApplicationId);
    }
}
