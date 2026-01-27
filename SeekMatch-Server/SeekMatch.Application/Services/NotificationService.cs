using SeekMatch.Application.Interfaces;
using SeekMatch.Core.Entities;
using SeekMatch.Infrastructure.Interfaces;

namespace SeekMatch.Application.Services
{
    public class NotificationService(INotificationRepository notificationRepository) : INotificationService
    {
        public async Task<IEnumerable<Notification>> GetUserNotificationsAsync(string userId) => 
            await notificationRepository.GetUserNotificationsAsync(userId);

        public async Task CreateNotificationAsync(string userId, string message)
        {
            var notification = new Notification
            {
                userId = userId,
                Message = message
            };

            await notificationRepository.AddNotificationAsync(notification);
        }

        public async Task MarkAsReadAsync(string notificationId) =>
            await notificationRepository.MarkAsReadAsync(notificationId);
    }

}
