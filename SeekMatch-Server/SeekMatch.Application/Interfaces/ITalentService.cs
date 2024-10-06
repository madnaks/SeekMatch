using SeekMatch.Core.Entities;

namespace SeekMatch.Application.Interfaces
{
    public interface ITalentService
    {
        Task CreateAsync(Talent talent);
    }
}
