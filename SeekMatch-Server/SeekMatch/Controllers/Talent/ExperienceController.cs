using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SeekMatch.Application.DTOs.Talent;
using SeekMatch.Application.Interfaces;
using System.Security.Claims;

namespace SeekMatch.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExperienceController(IExperienceService experienceService) : ControllerBase
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

            var experiencesDto = await experienceService.GetAllAsync(talentId);

            if (experiencesDto == null)
            {
                return NotFound();
            }

            return Ok(experiencesDto);
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ExperienceDto experienceDto)
        {

            var talentId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (talentId == null)
            {
                return Unauthorized();
            }

            if (experienceDto == null)
            {
                return BadRequest("Experience data is null");
            }

            var result = await experienceService.CreateAsync(experienceDto, talentId);

            if (result)
            {
                return Ok(new { message = "Experience created successfully" });
            }

            return StatusCode(500, new { message = "An error occurred while creating the experience" });
        }


        [Authorize]
        [HttpPut]
        public async Task<IActionResult> Update([FromBody] ExperienceDto experienceDto)
        {

            var talentId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (talentId == null)
            {
                return Unauthorized();
            }

            if (experienceDto == null)
            {
                return BadRequest("Experience data is null");
            }

            var result = await experienceService.UpdateAsync(experienceDto);

            if (result)
            {
                return Ok(new { message = "Experience update successfully" });
            }

            return StatusCode(500, new { message = "An error occurred while updating the experience" });
        }
        
        [Authorize]
        [HttpDelete("{experienceId}")]
        public async Task<IActionResult> Delete([FromRoute] string experienceId)
        {

            var talentId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (talentId == null)
            {
                return Unauthorized();
            }

            if (experienceId == null)
            {
                return BadRequest("Experience id is null");
            }

            var result = await experienceService.DeleteAsync(experienceId);

            if (result)
            {
                return Ok(new { message = "Experience deleted successfully" });
            }

            return StatusCode(500, new { message = "An error occurred while deleting the experience" });
        }
    }
}
