using SeekMatch.Core.Entities;

namespace SeekMatch.Application.Interfaces
{
    public interface INotificationService
    {
        Task<IEnumerable<Notification>> GetUserNotificationsAsync(string userId);
        Task CreateNotificationAsync(string userId, string message);
        Task MarkAsReadAsync(string notificationId);
    }

}
