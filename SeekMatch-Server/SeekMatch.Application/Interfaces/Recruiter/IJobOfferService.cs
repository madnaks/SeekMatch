using SeekMatch.Application.DTOs.Recruiter;

namespace SeekMatch.Application.Interfaces
{
    public interface IJobOfferService
    {
        Task<IList<JobOfferDto>?> GetAllAsync(JobOfferFilterDto filters);
        Task<JobOfferDto?> GetByIdAsync(string jobOfferId);
        Task<IList<JobOfferDto>?> GetAllByRecruiterAsync(string recruiterId);
        Task<IList<JobOfferDto>?> GetAllByCompanyAsync(string userId);
        Task<bool> CreateAsync(JobOfferDto jobOfferDto, string recruiterId);
        Task<bool> UpdateAsync(JobOfferDto jobOfferDto);
        Task<bool> DeleteAsync(string jobOfferId);
        Task<bool> IsBookmarkedAsync(string jobOfferId, string talentId);
        Task<bool> BookmarkAsync(string jobOfferId, string talentId);
        Task<bool> UnBookmarkAsync(string jobOfferId, string talentId);
    }
}
