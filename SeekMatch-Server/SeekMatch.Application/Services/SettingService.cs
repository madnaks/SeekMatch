using SeekMatch.Application.Interfaces;
using SeekMatch.Core.Entities;
using SeekMatch.Infrastructure.Interfaces;

namespace SeekMatch.Application.Services
{
    public class SettingService(ISettingRepository settingRepository) : ISettingService
    {
        public async Task<Setting?> GetUserSettingAsync(string userId)
        {
            return await settingRepository.GetAsync(userId);
        }
    }
}
