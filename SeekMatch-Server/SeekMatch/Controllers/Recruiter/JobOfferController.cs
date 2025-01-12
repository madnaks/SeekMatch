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
    public class JobOfferController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly IJobOfferService _jobOfferService;

        public JobOfferController(UserManager<User> userManager, IJobOfferService jobOfferService)
        {
            _userManager = userManager;
            _jobOfferService = jobOfferService;
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var recruiterId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (recruiterId == null)
            {
                return Unauthorized();
            }

            var jobOffersDto = await _jobOfferService.GetAllAsync(recruiterId);

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

            var result = await _jobOfferService.CreateAsync(jobOfferDto, recruiterId);

            if (result)
            {
                return Ok(new { message = "Job offer created successfully" });
            }

            return StatusCode(500, new { message = "An error occurred while creating the job offer" });
        }


        [Authorize]
        [HttpPut]
        public async Task<IActionResult> Update([FromBody] JobOfferDto jobOfferDto)
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

            var result = await _jobOfferService.UpdateAsync(jobOfferDto);

            if (result)
            {
                return Ok(new { message = "Job offer update successfully" });
            }

            return StatusCode(500, new { message = "An error occurred while updating the job offer" });
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

            var result = await _jobOfferService.DeleteAsync(jobOfferId);

            if (result)
            {
                return Ok(new { message = "Job offer deleted successfully" });
            }

            return StatusCode(500, new { message = "An error occurred while deleting the job offer" });
        }
    }
}
