using SeekMatch.Core.Entities;

namespace SeekMatch.Infrastructure.Interfaces
{
    public interface IJobOfferRepository
    {
        Task<IList<JobOffer>?> GetAllAsync(string recruiterId);
        Task<JobOffer?> GetByIdAsync(string id);
        Task<bool> CreateAsync(JobOffer jobOffer);
        Task<bool> UpdateAsync(JobOffer jobOffer);
        Task<bool> DeleteAsync(string jobOfferId);
    }
}
