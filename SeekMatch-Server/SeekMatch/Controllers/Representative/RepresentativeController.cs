using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SeekMatch.Application.DTOs.Representative;
using SeekMatch.Application.Interfaces;
using SeekMatch.Application.Services;
using SeekMatch.Core.Entities;
using SeekMatch.Core.Enums;
using System.Security.Claims;

namespace SeekMatch.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RepresentativeController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly ICompanyService _companyService;
        private readonly IRepresentativeService _representativeService;

        public RepresentativeController(
            UserManager<User> userManager, 
            ICompanyService companyService, 
            IRepresentativeService representativeService)
        {
            _userManager = userManager;
            _companyService = companyService;
            _representativeService = representativeService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRepresentativeDto registerRepresentativeDto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var user = new User
                {
                    UserName = registerRepresentativeDto.Email,
                    Email = registerRepresentativeDto.Email,
                    Role = UserRole.Representative
                };

                var result = await _userManager.CreateAsync(user, registerRepresentativeDto.Password);

                if (!result.Succeeded)
                    return BadRequest(result.Errors);

                var company = new Company()
                {
                    Name = registerRepresentativeDto.CompanyName,
                    Address = registerRepresentativeDto.CompanyAddress,
                    PhoneNumber = registerRepresentativeDto.CompanyPhoneNumber
                };

                await _companyService.CreateAsync(company);

                var representative = new Representative()
                {
                    FirstName = registerRepresentativeDto.FirstName,
                    LastName = registerRepresentativeDto.LastName,
                    Position = registerRepresentativeDto.Position,
                    Company = company,
                    CompanyId = company.Id,
                    User = user
                };

                await _representativeService.CreateAsync(representative);

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
    }
}
