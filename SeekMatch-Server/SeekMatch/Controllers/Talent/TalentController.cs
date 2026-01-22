using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SeekMatch.Application.DTOs.Talent;
using SeekMatch.Application.Interfaces;
using System.Security.Claims;

namespace SeekMatch.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TalentController(ITalentService talentService) : ControllerBase
    {
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterTalentDto registerTalentDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await talentService.RegisterAsync(registerTalentDto);

            if (!result.Succeeded)
                return BadRequest(new
                {
                    errors = result.Errors.Select(e => e.Description)
                });

            return Ok(result);
        }

        [Authorize]
        [HttpGet("get-by-id/{talentId}")]
        public async Task<IActionResult> GetById(string talentId)
        {
            if (string.IsNullOrWhiteSpace(talentId))
            {
                return BadRequest("Talent Id cannot be empty.");
            }

            var talentDto = await talentService.GetAsync(talentId);

            if (talentDto == null)
            {
                return NotFound();
            }

            return Ok(talentDto);
        }
        
        [Authorize]
        [HttpGet("get-profile")]
        public async Task<IActionResult> GetProfile()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
            {
                return Unauthorized();
            }

            var talentDto = await talentService.GetAsync(userId);

            if (talentDto == null)
            {
                return NotFound();
            }

            return Ok(talentDto);
        }

        [Authorize]
        [HttpPut("save-profile")]
        public async Task<IActionResult> SaveProfile([FromBody] TalentDto talentDto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
            {
                return Unauthorized();
            }

            if (talentDto == null)
            {
                return BadRequest("Talent data is null");
            }

            var result = await talentService.SaveProfileAsync(talentDto, userId);

            if (result)
            {
                return Ok(new { message = "Talent profile saved successfully" });
            }

            return StatusCode(500, new { message = "An error occurred while saving the profile" });
        }

        [Authorize]
        [HttpPost("upload-profile-picture")]
        public async Task<IActionResult> UploadProfilePicture(IFormFile profilePicture)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
            {
                return Unauthorized();
            }

            if (profilePicture == null || profilePicture.Length == 0)
            {
                return BadRequest("No file uploaded.");
            }

            using (var memoryStream = new MemoryStream())
            {
                await profilePicture.CopyToAsync(memoryStream);
                var profilePictureData = memoryStream.ToArray();

                var isSuccess = await talentService.UpdateProfilePictureAsync(profilePictureData, userId);
                if (!isSuccess)
                {
                    return NotFound("Talent not found.");
                }
            }

            return Ok(new { message = "Profile picture uploaded successfully." });

        }

        [Authorize]
        [HttpDelete("delete-profile-picture")]
        public async Task<IActionResult> DeleteProfilePicture()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
            {
                return Unauthorized();
            }

            var result = await talentService.DeleteProfilePictureAsync(userId);

            if (!result)
            {
                return NotFound("Profile picture not found.");
            }

            return NoContent();
        }

        [Authorize]
        [HttpGet("get-all-bookmarks")]
        public async Task<IActionResult> GetAllBookmarks()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
            {
                return Unauthorized();
            }

            var bookmarks = await talentService.GetAllBookmarksAsync(userId);

            if (bookmarks == null)
            {
                return NotFound();
            }

            return Ok(bookmarks);
        }

    }
}
