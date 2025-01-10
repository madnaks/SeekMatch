using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SeekMatch.Application.DTOs.Recruiter;
using SeekMatch.Application.Interfaces;
using SeekMatch.Core.Entities;
using System.Security.Claims;

namespace SeekMatch.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RecruiterController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly IRecruiterService _recruiterService;

        public RecruiterController(UserManager<User> userManager, IRecruiterService recruiterService)
        {
            _userManager = userManager;
            _recruiterService = recruiterService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRecruiterDto registerRecruiterDto)
        {
            try
            {
                if (!ModelState.IsValid)
                return BadRequest(ModelState);

                var result = await _recruiterService.RegisterAsync(registerRecruiterDto);

                if (!result.Succeeded)
                    return BadRequest(result.Errors);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = "An error occurred while registering the recruiter." + ex.Message });
            }
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

            var recruiterDto = await _recruiterService.GetAsync(userId);

            if (recruiterDto == null)
            {
                return NotFound();
            }

            return Ok(recruiterDto);
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
                return BadRequest("Recruiter data is null");
            }

            var result = await _recruiterService.SaveAboutYouAsync(aboutYouDto, userId);

            if (result)
            {
                return Ok(new { message = "Recruiter profile saved successfully" });
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

                var isSuccess = await _recruiterService.UpdateProfilePictureAsync(profilePictureData, userId);
                if (!isSuccess)
                {
                    return NotFound("Recruiter not found.");
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

            var result = await _recruiterService.DeleteProfilePictureAsync(userId);

            if (!result)
            {
                return NotFound("Profile picture not found.");
            }

            return NoContent();
        }
    }
}
