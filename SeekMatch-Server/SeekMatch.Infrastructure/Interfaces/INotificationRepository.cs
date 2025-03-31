using SeekMatch.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SeekMatch.Infrastructure.Interfaces
{
    public interface INotificationRepository
    {
        Task<IEnumerable<Notification>> GetUserNotificationsAsync(string userId);
        Task AddNotificationAsync(Notification notification);
        Task MarkAsReadAsync(string notificationId);
    }

}
