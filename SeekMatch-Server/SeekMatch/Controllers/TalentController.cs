using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SeekMatch.Core.Entities;
using System.Security.Claims;

namespace SeekMatch.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TalentController : ControllerBase
    {
        private readonly UserManager<User> _userManager;

        public TalentController(UserManager<User> userManager)
        {
            _userManager = userManager;
        }

        [Authorize]
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
            {
                return Unauthorized();
            }

            var talent = await _userManager.FindByIdAsync(userId);

            if (talent == null)
            {
                return NotFound();
            }

            return Ok(talent);
        }
    }
}
