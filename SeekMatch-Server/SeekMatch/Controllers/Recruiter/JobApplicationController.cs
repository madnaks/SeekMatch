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
    public class JobApplicationController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly IJobApplicationService _jobApplicationService;

        public JobApplicationController(UserManager<User> userManager, IJobApplicationService jobApplicationService)
        {
            _userManager = userManager;
            _jobApplicationService = jobApplicationService;
        }

        [HttpGet("get-all-by-talent")]
        public async Task<IActionResult> GetAllByTalent()
        {
            var jobOffersDto = await _jobApplicationService.GetAllByTalentAsync();

            if (jobOffersDto == null)
            {
                return NotFound();
            }

            return Ok(jobOffersDto);
        }
        
        [Authorize]
        [HttpGet("get-all-by-recruiter")]
        public async Task<IActionResult> GetAllByRecruiter()
        {
            var recruiterId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (recruiterId == null)
            {
                return Unauthorized();
            }

            var jobOffersDto = await _jobApplicationService.GetAllByRecruiterAsync();

            if (jobOffersDto == null)
            {
                return NotFound();
            }

            return Ok(jobOffersDto);
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] JobOfferDto jobOfferDto)
        {

            var recruiterId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (recruiterId == null)
            {
                return Unauthorized();
            }

            if (jobOfferDto == null)
            {
                return BadRequest("Job offer data is null");
            }

            var result = await _jobApplicationService.CreateAsync("", "");

            if (result)
            {
                return Ok(new { message = "Job offer created successfully" });
            }

            return StatusCode(500, new { message = "An error occurred while creating the job offer" });
        }
        
        [Authorize]
        [HttpDelete("{jobOfferId}")]
        public async Task<IActionResult> Delete([FromRoute] string jobOfferId)
        {

            var recruiterId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (recruiterId == null)
            {
                return Unauthorized();
            }

            if (jobOfferId == null)
            {
                return BadRequest("Job offer id is null");
            }

            var result = await _jobApplicationService.DeleteAsync(jobOfferId);

            if (result)
            {
                return Ok(new { message = "Job offer deleted successfully" });
            }

            return StatusCode(500, new { message = "An error occurred while deleting the job offer" });
        }
    }
}
