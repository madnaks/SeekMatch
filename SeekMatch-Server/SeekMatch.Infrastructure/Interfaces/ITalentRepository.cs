using SeekMatch.Core.Entities;

namespace SeekMatch.Core.Interfaces
{
    public interface ITalentRepository
    {
        Task CreateAsync(Talent talent);
        Task<Talent?> GetAsync(string userId);
    }
}
