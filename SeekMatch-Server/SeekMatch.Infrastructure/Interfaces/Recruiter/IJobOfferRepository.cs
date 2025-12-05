using SeekMatch.Core.Entities;

namespace SeekMatch.Infrastructure.Interfaces
{
    public interface IJobOfferRepository
    {
        Task<IList<JobOffer>?> GetAllAsync(JobOfferFilter filters);
        Task<IList<JobOffer>?> GetAllByRecruiterAsync(string recruiterId);
        Task<JobOffer?> GetByIdAsync(string id);
        Task<bool> CreateAsync(JobOffer jobOffer);
        Task<bool> UpdateAsync(JobOffer jobOffer);
        Task<bool> DeleteAsync(string jobOfferId);
        Task<bool> IsBookmarkedAsync(string jobOfferId, string talentId);
        Task<bool> BookmarkAsync(Bookmark bookmark);
        Task<bool> UnBookmarkAsync(Bookmark bookmark);
    }
}
