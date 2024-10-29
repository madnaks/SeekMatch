using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SeekMatch.Application.DTOs;
using SeekMatch.Application.Interfaces;
using SeekMatch.Core.Entities;
using System.Security.Claims;

namespace SeekMatch.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EducationController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly IEducationService _educationService;

        public EducationController(UserManager<User> userManager, IEducationService educationService)
        {
            _userManager = userManager;
            _educationService = educationService;
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var talentId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (talentId == null)
            {
                return Unauthorized();
            }

            var eduationsDto = await _educationService.GetAllAsync(talentId);

            if (eduationsDto == null)
            {
                return NotFound();
            }

            return Ok(eduationsDto);
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateEducationDto createEducationDto)
        {

            var talentId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (talentId == null)
            {
                return Unauthorized();
            }

            if (createEducationDto == null)
            {
                return BadRequest("Education data is null");
            }

            var result = await _educationService.CreateAsync(createEducationDto, talentId);

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

            var result = await _educationService.UpdateAsync(educationDto);

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

            var result = await _educationService.DeleteAsync(educationId);

            if (result)
            {
                return Ok(new { message = "Education deleted successfully" });
            }

            return StatusCode(500, new { message = "An error occurred while deleting the education" });
        }
    }
}
