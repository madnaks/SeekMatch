using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Rewrite;
using SeekMatch.Application.DTOs.Recruiter;
using SeekMatch.Application.Interfaces;
using System.Security.Claims;

namespace SeekMatch.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class JobApplicationController(IJobApplicationService jobApplicationService) : ControllerBase
    {
        [HttpGet("get-all-by-talent")]
        public async Task<IActionResult> GetAllByTalent()
        {
            var talentId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (talentId == null)
            {
                return Unauthorized();
            }

            var jobApplicationsDto = await jobApplicationService.GetAllByTalentAsync(talentId);

            if (jobApplicationsDto == null)
            {
                return NotFound();
            }

            return Ok(jobApplicationsDto);
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

            var jobApplicationsDto = await jobApplicationService.GetAllByRecruiterAsync();

            if (jobApplicationsDto == null)
            {
                return NotFound();
            }

            return Ok(jobApplicationsDto);
        }

        [Authorize]
        [HttpPost("apply/{jobOfferId}")]
        public async Task<IActionResult> Apply([FromRoute] string jobOfferId)
        {
            try
            {
                if (jobOfferId == null)
                {
                    return BadRequest("Job application data is null");
                }

                var talentId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (talentId == null)
                {
                    return Unauthorized();
                }

                var result = await jobApplicationService.ApplyAsync(talentId, jobOfferId);

                if (result)
                {
                    return Ok(new { message = "Job application created successfully" });
                }

                return StatusCode(500, new { message = "An error occurred while creating the job application" });
            } 
            catch (Exception ex) {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpPost("express-apply/{jobOfferId}")]
        public async Task<IActionResult> ExpressApply([FromRoute] string jobOfferId, [FromForm] ExpressApplicationDto expressApplicationDto, [FromForm] IFormFile cv)
        {
            try
            {
                if (jobOfferId == null)
                {
                    return BadRequest("Job application data is null");
                }

                if (cv == null || cv.Length == 0)
                {
                    return BadRequest("CV file is required.");
                }

                using var stream = cv.OpenReadStream();

                var result = await jobApplicationService
                    .ExpressApplyAsync(expressApplicationDto, jobOfferId, stream, cv.FileName);

                if (result)
                {
                    return Ok(new { message = "Job application created successfully" });
                }

                return StatusCode(500, new { message = "An error occurred while creating the job application" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [Authorize]
        [HttpPut("{jobApplicationId}")]
        public async Task<IActionResult> Reject(string jobApplicationId, [FromBody] string rejectionReason)
        {

            var recruiterId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (recruiterId == null)
            {
                return Unauthorized();
            }

            if (jobApplicationId == null)
            {
                return BadRequest("Job application id is null");
            }

            var result = await jobApplicationService.RejectAsync(jobApplicationId, rejectionReason);

            if (result)
            {
                return Ok(new { message = "Job application rejected successfully" });
            }

            return StatusCode(500, new { message = "An error occurred while rejecting the job application" });
        }

        [Authorize]
        [HttpGet("job-applications/{jobApplicationId}/cv")]
        public async Task<IActionResult> DownloadCv(string jobApplicationId)
        {
            var fileResult = await jobApplicationService.DownloadCv(jobApplicationId);

            return File(fileResult.FileStream, fileResult.ContentType, fileResult.FileName);
        }

        [Authorize]
        [HttpDelete("{jobApplicationId}")]
        public async Task<IActionResult> Delete([FromRoute] string jobApplicationId)
        {

            var recruiterId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (recruiterId == null)
            {
                return Unauthorized();
            }

            if (jobApplicationId == null)
            {
                return BadRequest("Job application id is null");
            }

            var result = await jobApplicationService.DeleteAsync(jobApplicationId);

            if (result)
            {
                return Ok(new { message = "Job application deleted successfully" });
            }

            return StatusCode(500, new { message = "An error occurred while deleting the job application" });
        }
    }
}
