using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SeekMatch.Application.DTOs.Recruiter;
using SeekMatch.Application.DTOs.Representative;
using SeekMatch.Application.Interfaces;
using System.Security.Claims;
using AboutYouDto = SeekMatch.Application.DTOs.Representative.AboutYouDto;

namespace SeekMatch.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RepresentativeController : ControllerBase
    {
        private readonly IRepresentativeService _representativeService;
        private readonly IRecruiterService _recruiterService;

        public RepresentativeController(
            ICompanyService companyService, 
            IRepresentativeService representativeService,
            IRecruiterService recruiterService)
        {
            _representativeService = representativeService;
            _recruiterService = recruiterService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRepresentativeDto registerRepresentativeDto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var result = await _representativeService.RegisterAsync(registerRepresentativeDto);

                if (!result.Succeeded)
                    return BadRequest(result.Errors);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = "An error occurred while registering the representative." + ex.Message });
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

            var representativeDto = await _representativeService.GetAsync(userId);

            if (representativeDto == null)
            {
                return NotFound();
            }

            return Ok(representativeDto);
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
                return BadRequest("Representative data is null");
            }

            var result = await _representativeService.SaveAboutYouAsync(aboutYouDto, userId);

            if (result)
            {
                return Ok(new { message = "Representative profile saved successfully" });
            }

            return StatusCode(500, new { message = "An error occurred while saving the profile" });
        }

        #region Profile picture management
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

                var isSuccess = await _representativeService.UpdateProfilePictureAsync(profilePictureData, userId);
                if (!isSuccess)
                {
                    return NotFound("Representative not found.");
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

            var result = await _representativeService.DeleteProfilePictureAsync(userId);

            if (!result)
            {
                return NotFound("Profile picture not found.");
            }

            return NoContent();
        }
        #endregion

        #region Company Recruiter Management
        [Authorize]
        [HttpGet("get-all-recruiters")]
        public async Task<IActionResult> GetAllRecruiter()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
            {
                return Unauthorized();
            }

            var recruitersDto = await _representativeService.GetAllRecruitersAsync(userId);

            if (recruitersDto == null)
            {
                return NotFound();
            }

            return Ok(recruitersDto);
        }
        
        [Authorize]
        [HttpPost("create-recruiter")]
        public async Task<IActionResult> CreateRecruiter([FromBody] RecruiterDto recruiterDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _recruiterService.CreateAsync(recruiterDto);

            if (!result.Succeeded)
                return BadRequest(result.Errors);

            return Ok(result);
        }

        //[Authorize]
        //[HttpPost("update-recruiter")]
        //public async Task<IActionResult> UpdateRecruiter([FromBody] RecruiterDto recruiterDto)
        //{

        //}

        //[Authorize]
        //[HttpPost("delete-recruiter")]
        //public async Task<IActionResult> DeleteRecruiter([FromBody] RecruiterDto recruiterDto)
        //{

        //}
        #endregion
    }
}
