using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SeekMatch.Application.Interfaces;
using SeekMatch.Core.Entities;
using System.Security.Claims;
using SeekMatch.Application.DTOs;

namespace SeekMatch.Controllers
{
    [Route("api/notifications")]
    [ApiController]
    [Authorize]
    public class NotificationController(INotificationService notificationService) : ControllerBase
    {
        /// <summary>
        /// Get all notifications for the authenticated user.
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Notification>>> GetUserNotifications()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var notifications = await notificationService.GetUserNotificationsAsync(userId);
            return Ok(notifications);
        }

        /// <summary>
        /// Create a notification (For system events, not direct use).
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> CreateNotification([FromBody] NotificationDto notificationDto)
        {
            await notificationService.CreateNotificationAsync(notificationDto.UserId, notificationDto.Message);
            return Ok(new { message = "Notification created successfully" });
        }

        /// <summary>
        /// Mark a notification as read.
        /// </summary>
        [HttpPut("{notificationId}")]
        public async Task<IActionResult> MarkAsRead(string notificationId)
        {
            await notificationService.MarkAsReadAsync(notificationId);
            return NoContent();
        }
    }
}
