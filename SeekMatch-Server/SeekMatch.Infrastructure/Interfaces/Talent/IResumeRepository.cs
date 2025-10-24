using SeekMatch.Core.Entities;

namespace SeekMatch.Infrastructure.Interfaces
{
    public interface IResumeRepository
    {
        Task<IList<Resume>?> GetAllAsync(string talentId);
        Task<Resume?> GetByIdAsync(string id);
        Task<bool> CreateAsync(Resume resume);
        Task<bool> UpdateAsync(Resume resume);
        Task<bool> DeleteAsync(string resumeId);
    }
}
