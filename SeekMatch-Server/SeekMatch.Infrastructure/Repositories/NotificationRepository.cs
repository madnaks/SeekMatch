using Microsoft.EntityFrameworkCore;
using SeekMatch.Core.Entities;
using SeekMatch.Infrastructure.Interfaces;

namespace SeekMatch.Infrastructure.Repositories
{
    public class NotificationRepository(SeekMatchDbContext dbContext) : INotificationRepository
    {
        public async Task<IEnumerable<Notification>> GetUserNotificationsAsync(string userId) => 
            await dbContext.Notifications
                .Where(n => n.userId == userId)
                .OrderByDescending(n => n.CreatedAt)
                .ToListAsync();

        public async Task AddNotificationAsync(Notification notification)
        {
            await dbContext.Notifications.AddAsync(notification);
            await dbContext.SaveChangesAsync();
        }

        public async Task MarkAsReadAsync(string notificationId)
        {
            var notification = await dbContext.Notifications.FindAsync(notificationId);
            if (notification != null)
            {
                notification.IsRead = true;
                notification.UpdatedAt = DateTime.UtcNow;
                await dbContext.SaveChangesAsync();
            }
        }
    }

}
