using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SeekMatch.Application.Interfaces;
using SeekMatch.Core.Entities;
using System.Security.Claims;

namespace SeekMatch.Controllers
{
    [Route("api/notifications")]
    [ApiController]
    [Authorize]
    public class NotificationController : ControllerBase
    {
        private readonly INotificationService _notificationService;

        public NotificationController(INotificationService notificationService)
        {
            _notificationService = notificationService;
        }

        /// <summary>
        /// Get all notifications for the authenticated user.
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Notification>>> GetUserNotifications()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var notifications = await _notificationService.GetUserNotificationsAsync(userId);
            return Ok(notifications);
        }

        /// <summary>
        /// Create a notification (For system events, not direct use).
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> CreateNotification([FromBody] NotificationCreateDto notificationDto)
        {
            await _notificationService.CreateNotificationAsync(notificationDto.UserId, notificationDto.Message);
            return Ok(new { message = "Notification created successfully" });
        }

        /// <summary>
        /// Mark a notification as read.
        /// </summary>
        [HttpPut("{id}/read")]
        public async Task<IActionResult> MarkAsRead(Guid id)
        {
            await _notificationService.MarkAsReadAsync(id);
            return NoContent();
        }
    }

    public class NotificationCreateDto
    {
        public string UserId { get; set; }
        public string Message { get; set; }
    }
}
