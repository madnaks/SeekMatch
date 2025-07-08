using SeekMatch.Application.DTOs.Recruiter;

namespace SeekMatch.Application.Interfaces
{
    public interface IJobOfferService
    {
        Task<IList<JobOfferDto>?> GetAllAsync(JobOfferFilterDto filters);
        Task<IList<JobOfferDto>?> GetAllByRecruiterAsync(string recruiterId);
        Task<bool> CreateAsync(JobOfferDto jobOfferDto, string recruiterId);
        Task<bool> UpdateAsync(JobOfferDto jobOfferDto);
        Task<bool> DeleteAsync(string jobOfferId);
    }
}
