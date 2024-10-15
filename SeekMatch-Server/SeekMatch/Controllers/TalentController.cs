using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SeekMatch.Application.DTOs;
using SeekMatch.Application.Interfaces;
using SeekMatch.Core.Entities;
using System.Security.Claims;

namespace SeekMatch.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TalentController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly ITalentService _talentService;

        public TalentController(UserManager<User> userManager, ITalentService talentService1)
        {
            _userManager = userManager;
            _talentService = talentService1;
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

            var talent = await _talentService.GetAsync(userId);

            if (talent == null)
            {
                return NotFound();
            }

            return Ok(talent);
        }

        [Authorize]
        [HttpPut("about-you")]
        public async Task<IActionResult> SaveProfile([FromBody] AboutYouDto aboutYouDto)
        {

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
            {
                return Unauthorized();
            }

            if (aboutYouDto == null)
            {
                return BadRequest("Talent data is null");
            }

            var result = await _talentService.SaveAboutYouAsync(aboutYouDto, userId);

            if (result)
            {
                return Ok(new { message = "Talent profile saved successfully" });
            }

            return StatusCode(500, new { message = "An error occurred while saving the profile" });
        }
    }
}
