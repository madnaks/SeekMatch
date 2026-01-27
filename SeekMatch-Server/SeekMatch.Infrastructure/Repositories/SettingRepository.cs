using Microsoft.EntityFrameworkCore;
using SeekMatch.Core.Entities;
using SeekMatch.Infrastructure.Interfaces;

namespace SeekMatch.Infrastructure.Repositories
{
    public class SettingRepository(SeekMatchDbContext dbContext) : ISettingRepository
    {
        public async Task<Setting?> GetAsync(string userId)
        {
            try
            {
                if (userId == null)
                    throw new ArgumentNullException(nameof(userId));

                return await dbContext.Settings.FirstOrDefaultAsync(t => t.UserId == userId) ?? null;
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while fetching the setting", ex);
            }
        }

        public async Task CreateAsync(Setting setting)
        {
            try
            {
                dbContext.Settings.Add(setting);
                await dbContext.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while creating the setting", ex);
            }
        }

        public async Task<bool> UpdateAsync(Setting setting)
        {
            try
            {
                dbContext.Settings.Update(setting);
                var result = await dbContext.SaveChangesAsync();
                return result > 0;
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while updating the setting", ex);
            }
        }
    }
}
