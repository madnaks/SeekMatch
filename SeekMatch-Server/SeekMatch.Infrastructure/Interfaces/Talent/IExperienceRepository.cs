using SeekMatch.Core.Entities;

namespace SeekMatch.Infrastructure.Interfaces
{
    public interface IExperienceRepository
    {
        Task<IList<Experience>?> GetAllAsync(string talentId);
        Task<Experience?> GetByIdAsync(string id);
        Task<bool> CreateAsync(Experience experience);
        Task<bool> UpdateAsync(Experience experience);
        Task<bool> DeleteAsync(string experienceId);
    }
}
