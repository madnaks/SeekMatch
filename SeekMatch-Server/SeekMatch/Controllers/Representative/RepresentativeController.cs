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
    public class RepresentativeController(IRepresentativeService representativeService, IRecruiterService recruiterService, ICompanyService companyService) : ControllerBase
    {
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRepresentativeDto registerRepresentativeDto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var result = await representativeService.RegisterAsync(registerRepresentativeDto);

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

            var representativeDto = await representativeService.GetAsync(userId);

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

            var result = await representativeService.SaveAboutYouAsync(aboutYouDto, userId);

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

                var isSuccess = await representativeService.UpdateProfilePictureAsync(profilePictureData, userId);
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

            var result = await representativeService.DeleteProfilePictureAsync(userId);

            if (!result)
            {
                return NotFound("Profile picture not found.");
            }

            return NoContent();
        }
        #endregion

        #region Company
        [Authorize]
        [HttpGet("get-company")]
        public async Task<IActionResult> GetCompany()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
            {
                return Unauthorized();
            }

            var representativeDto = await representativeService.GetAsync(userId);

            if (representativeDto == null)
            {
                return NotFound();
            }

            return Ok(representativeDto.CompanyDto);
        }

        [Authorize]
        [HttpPut("update-company")]
        public async Task<IActionResult> UpdateCompany([FromBody] CompanyDto companyDto)
        {
            if (companyDto == null)
            {
                return BadRequest("Company data is null");
            }

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
            {
                return Unauthorized();
            }

            var representativeDto = await representativeService.GetAsync(userId);

            if (representativeDto == null)
            {
                return NotFound();
            }

            var result = await companyService.UpdateAsync(companyDto, representativeDto.CompanyId);

            if (result)
            {
                return Ok(new { message = "Representative profile saved successfully" });
            }

            return StatusCode(500, new { message = "An error occurred while saving the profile" });
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

            var recruitersDto = await representativeService.GetAllRecruitersAsync(userId);

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

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
            {
                return Unauthorized();
            }

            var representativeDto = await representativeService.GetAsync(userId);

            if (representativeDto == null) { 
                return NotFound(); 
            }

            var result = await recruiterService.CreateAsync(recruiterDto, representativeDto.CompanyId);

            if (!result.Succeeded)
                return BadRequest(result.Errors);

            return Ok(result);
        }

        [Authorize]
        [HttpPost("update-recruiter")]
        public async Task<IActionResult> UpdateRecruiter([FromBody] RecruiterDto recruiterDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
            {
                return Unauthorized();
            }

            var representativeDto = await representativeService.GetAsync(userId);

            if (representativeDto == null)
            {
                return NotFound();
            }

            var result = await recruiterService.UpdateAsync(recruiterDto, representativeDto.CompanyId);

            if (result)
            {
                return Ok(new { message = "Recruiter update successfully" });
            }

            return StatusCode(500, new { message = "An error occurred while updating the recruiter" });
        }

        //[Authorize]
        //[HttpPost("delete-recruiter")]
        //public async Task<IActionResult> DeleteRecruiter([FromBody] RecruiterDto recruiterDto)
        //{

        //}
        #endregion
    }
}
