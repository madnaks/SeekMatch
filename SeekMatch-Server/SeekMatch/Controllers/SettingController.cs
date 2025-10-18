using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SeekMatch.Application.Interfaces;
using SeekMatch.Application.Services;
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

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> UpdateSetting([FromBody] SettingDto settingDto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
            {
                return Unauthorized();
            }

            if (settingDto == null)
            {
                return BadRequest("Setting data is null");
            }

            var result = await settingService.UpdateUserSettingAsync(settingDto, userId);

            if (result)
            {
                return Ok(new { message = "User setting updated successfully" });
            }

            return StatusCode(500, new { message = "An error occurred while updating the user setting" });
        }
    }
}
