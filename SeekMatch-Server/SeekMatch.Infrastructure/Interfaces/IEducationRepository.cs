using SeekMatch.Core.Entities;

namespace SeekMatch.Infrastructure.Interfaces
{
    public interface IEducationRepository
    {
        Task<IList<Education>?> GetAllAsync(string talentId);
        Task<bool> CreateAsync(Education education);
        Task<bool> DeleteAsync(string educationId);
    }
}
