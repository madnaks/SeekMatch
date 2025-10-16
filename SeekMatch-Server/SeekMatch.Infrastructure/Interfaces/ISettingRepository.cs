using SeekMatch.Core.Entities;

namespace SeekMatch.Infrastructure.Interfaces
{
    public interface ISettingRepository
    {
        Task<Setting?> GetAsync(string userId);
        Task CreateAsync(Setting setting);
    }
}
