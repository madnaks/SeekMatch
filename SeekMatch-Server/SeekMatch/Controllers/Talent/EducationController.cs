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
        public async Task<IActionResult> Create([FromBody] EducationDto educationDto)
        {

            var talentId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (talentId == null)
            {
                return Unauthorized();
            }

            if (educationDto == null)
            {
                return BadRequest("Talent data is null");
            }

            var result = await _educationService.CreateAsync(educationDto, talentId);

            if (result)
            {
                return Ok(new { message = "Education created successfully" });
            }

            return StatusCode(500, new { message = "An error occurred while creating the education" });
        }
    }
}
