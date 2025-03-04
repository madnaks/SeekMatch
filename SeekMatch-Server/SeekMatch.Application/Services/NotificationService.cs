using SeekMatch.Application.Interfaces;
using SeekMatch.Core.Entities;
using SeekMatch.Infrastructure.Interfaces;

namespace SeekMatch.Application.Services
{
    public class NotificationService : INotificationService
    {
        private readonly INotificationRepository _notificationRepository;

        public NotificationService(INotificationRepository notificationRepository)
        {
            _notificationRepository = notificationRepository;
        }

        public async Task<IEnumerable<Notification>> GetUserNotificationsAsync(string userId)
        {
            return await _notificationRepository.GetUserNotificationsAsync(userId);
        }

        public async Task CreateNotificationAsync(string userId, string message)
        {
            var notification = new Notification
            {
                userId = userId,
                Message = message
            };

            await _notificationRepository.AddNotificationAsync(notification);
        }

        public async Task MarkAsReadAsync(Guid notificationId)
        {
            await _notificationRepository.MarkAsReadAsync(notificationId);
        }
    }

}
