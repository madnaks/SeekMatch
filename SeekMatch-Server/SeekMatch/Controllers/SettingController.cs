using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SeekMatch.Application.Interfaces;
using SeekMatch.Core.Entities;
using System.Security.Claims;

namespace SeekMatch.Controllers
{
    [Route("api/setting")]
    [ApiController]
    [Authorize]
    public class SettingController(ISettingService settingService) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Notification>>> GetUserSetting()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var setting = await settingService.GetUserSettingAsync(userId);
            return Ok(setting);
        }
    }
}
