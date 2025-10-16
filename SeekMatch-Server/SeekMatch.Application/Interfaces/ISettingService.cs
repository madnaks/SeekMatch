using SeekMatch.Core.Entities;

namespace SeekMatch.Application.Interfaces
{
    public interface ISettingService
    {
        Task<Setting?> GetUserSettingAsync(string userId);
    }
}
