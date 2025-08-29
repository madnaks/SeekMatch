using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SeekMatch.Application.DTOs.Talent;
using SeekMatch.Application.Interfaces;
using System.Security.Claims;

namespace SeekMatch.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EducationController(IEducationService educationService) : ControllerBase
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

            var eduationsDto = await educationService.GetAllAsync(talentId);

            if (eduationsDto == null)
            {
                return NotFound();
            }

            return Ok(eduationsDto);
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] EducationDto educationDto)
        {

            var talentId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (talentId == null)
            {
                return Unauthorized();
            }

            if (educationDto == null)
            {
                return BadRequest("Education data is null");
            }

            var result = await educationService.CreateAsync(educationDto, talentId);

            if (result)
            {
                return Ok(new { message = "Education created successfully" });
            }

            return StatusCode(500, new { message = "An error occurred while creating the education" });
        }


        [Authorize]
        [HttpPut]
        public async Task<IActionResult> Update([FromBody] EducationDto educationDto)
        {

            var talentId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (talentId == null)
            {
                return Unauthorized();
            }

            if (educationDto == null)
            {
                return BadRequest("Education data is null");
            }

            var result = await educationService.UpdateAsync(educationDto);

            if (result)
            {
                return Ok(new { message = "Education update successfully" });
            }

            return StatusCode(500, new { message = "An error occurred while updating the education" });
        }
        
        [Authorize]
        [HttpDelete("{educationId}")]
        public async Task<IActionResult> Delete([FromRoute] string educationId)
        {

            var talentId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (talentId == null)
            {
                return Unauthorized();
            }

            if (educationId == null)
            {
                return BadRequest("Education id is null");
            }

            var result = await educationService.DeleteAsync(educationId);

            if (result)
            {
                return Ok(new { message = "Education deleted successfully" });
            }

            return StatusCode(500, new { message = "An error occurred while deleting the education" });
        }
    }
}
