using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SeekMatch.Application.DTOs;
using SeekMatch.Application.Interfaces;
using SeekMatch.Application.Services;
using SeekMatch.Core.Entities;
using SeekMatch.Core.Enums;

namespace SeekMatch.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly IJobSeekerService _jobSeekerService;
        public AuthController(UserManager<User> userManager, IJobSeekerService jobSeekerService)
        {
            _userManager = userManager;
            _jobSeekerService = jobSeekerService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto model, [FromQuery] UserRole userRole)
        {
            if (!ModelState.IsValid) 
                return BadRequest(ModelState);

            var user = new User { 
                UserName = model.Email, 
                Email = model.Email,
            };

            var result = await _userManager.CreateAsync(user, model.Password);

            if(!result.Succeeded)
                return BadRequest(result.Errors);

            //await _userManager.AddToRoleAsync(user, model.Role.ToString());

            if (userRole == UserRole.JobSeeker)
            {
                var jobSeeker = new JobSeeker()
                {
                    FirstName = model.FirstName,
                    LastName = model.LastName,
                    User = user
                };

                await _jobSeekerService.CreateAsync(jobSeeker);
            }

            return Ok(result);
        }
    }
}
