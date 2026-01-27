using AutoMapper;
using SeekMatch.Application.Interfaces;
using SeekMatch.Core.Entities;
using SeekMatch.Infrastructure.Interfaces;

namespace SeekMatch.Application.Services
{
    public class SettingService(ISettingRepository settingRepository, IMapper mapper) : ISettingService
    {
        public async Task<Setting?> GetUserSettingAsync(string userId) => 
            await settingRepository.GetAsync(userId);

        public async Task<bool> UpdateUserSettingAsync(SettingDto settingDto, string userId)
        {
            var setting = mapper.Map<Setting>(settingDto);

            var existingSetting = await settingRepository.GetAsync(userId);
            if (existingSetting != null)
            {
                existingSetting.Language = setting.Language;

                return await settingRepository.UpdateAsync(existingSetting);
            }
            else
            {
                setting.UserId = userId;
                await settingRepository.CreateAsync(setting);
            }
            return false;
        }
    }
}
