using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SeekMatch.Application.DTOs.Recruiter;
using SeekMatch.Application.Interfaces;
using System.Security.Claims;

namespace SeekMatch.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RecruiterController(IRecruiterService recruiterService) : ControllerBase
    {
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRecruiterDto registerRecruiterDto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var result = await recruiterService.RegisterAsync(registerRecruiterDto);
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
                return Unauthorized();

            var recruiterDto = await recruiterService.GetAsync(userId);
            if (recruiterDto == null)
                return NotFound();

            return Ok(recruiterDto);
        }

        [Authorize]
        [HttpGet("get-by-id/{recruiterId}")]
        public async Task<IActionResult> GetById(string recruiterId)
        {
            if (string.IsNullOrWhiteSpace(recruiterId))
                return BadRequest("Recruiter Id cannot be empty.");

            var recruiterDto = await recruiterService.GetAsync(recruiterId);
            if (recruiterDto == null)
                return NotFound();

            return Ok(recruiterDto);
        }

        [Authorize]
        [HttpPut("about-you")]
        public async Task<IActionResult> SaveProfile([FromBody] AboutYouDto aboutYouDto)
        {
            if (aboutYouDto == null)
                return BadRequest("Recruiter data is null");

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
                return Unauthorized();


            var result = await recruiterService.SaveAboutYouAsync(aboutYouDto, userId);
            if (result)
                return Ok(new { message = "Recruiter profile saved successfully" });

            return StatusCode(500, new { message = "An error occurred while saving the profile" });
        }

        [Authorize]
        [HttpPost("upload-profile-picture")]
        public async Task<IActionResult> UploadProfilePicture(IFormFile profilePicture)
        {
            if (profilePicture == null || profilePicture.Length == 0)
                return BadRequest("No file uploaded.");

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
                return Unauthorized();

            using (var memoryStream = new MemoryStream())
            {
                await profilePicture.CopyToAsync(memoryStream);
                var profilePictureData = memoryStream.ToArray();

                var isSuccess = await recruiterService.UpdateProfilePictureAsync(profilePictureData, userId);
                if (!isSuccess)
                    return NotFound("Recruiter not found.");
            }

            return Ok(new { message = "Profile picture uploaded successfully." });
        }

        [Authorize]
        [HttpDelete("delete-profile-picture")]
        public async Task<IActionResult> DeleteProfilePicture()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
                return Unauthorized();

            var result = await recruiterService.DeleteProfilePictureAsync(userId);
            if (!result)
                return NotFound("Profile picture not found.");

            return NoContent();
        }
    }
}
