using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SeekMatch.Application.DTOs.Talent;
using SeekMatch.Application.Interfaces;
using System.Security.Claims;

namespace SeekMatch.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ResumeController(IResumeService resumeService) : ControllerBase
    {
        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var talentId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (talentId == null)
            {
                return Unauthorized();
            }

            var resumesDto = await resumeService.GetAllAsync(talentId);

            if (resumesDto == null)
            {
                return NotFound();
            }

            return Ok(resumesDto);
        }

        [Authorize]
        [HttpGet("download/{resumeId}")]
        public async Task<IActionResult> DownloadResume(string resumeId)
        {
            var fileResult = await resumeService.DownloadResume(resumeId);

            return File(fileResult.FileStream, fileResult.ContentType, fileResult.FileName);
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Create([FromForm] ResumeDto resumeDto, [FromForm] IFormFile resume)
        {

            var talentId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (talentId == null)
            {
                return Unauthorized();
            }

            if (resumeDto == null)
            {
                return BadRequest("Resume data is null");
            }

            if (resume == null || resume.Length == 0)
            {
                return BadRequest("Resume file is required.");
            }

            using var stream = resume.OpenReadStream();

            var result = await resumeService.CreateAsync(resumeDto, talentId, stream, resume.FileName);

            if (result)
            {
                return Ok(new { message = "Resume created successfully" });
            }

            return StatusCode(500, new { message = "An error occurred while creating the resume" });
        }


        [Authorize]
        [HttpPut]
        public async Task<IActionResult> Update([FromBody] ResumeDto resumeDto)
        {

            var talentId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (talentId == null)
            {
                return Unauthorized();
            }

            if (resumeDto == null)
            {
                return BadRequest("Resume data is null");
            }

            var result = await resumeService.UpdateAsync(resumeDto);

            if (result)
            {
                return Ok(new { message = "Resume update successfully" });
            }

            return StatusCode(500, new { message = "An error occurred while updating the resume" });
        }
        
        [Authorize]
        [HttpDelete("{resumeId}")]
        public async Task<IActionResult> Delete([FromRoute] string resumeId)
        {

            var talentId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (talentId == null)
            {
                return Unauthorized();
            }

            if (resumeId == null)
            {
                return BadRequest("Resume id is null");
            }

            var result = await resumeService.DeleteAsync(resumeId);

            if (result)
            {
                return Ok(new { message = "Resume deleted successfully" });
            }

            return StatusCode(500, new { message = "An error occurred while deleting the resume" });
        }
    }
}
