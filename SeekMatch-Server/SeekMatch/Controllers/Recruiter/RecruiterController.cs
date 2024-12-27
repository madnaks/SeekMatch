using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SeekMatch.Application.DTOs.Recruiter;
using SeekMatch.Application.Interfaces;
using SeekMatch.Core.Entities;

namespace SeekMatch.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RecruiterController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly IRecruiterService _recruiterService;

        public RecruiterController(UserManager<User> userManager, IRecruiterService recruiterService)
        {
            _userManager = userManager;
            _recruiterService = recruiterService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRecruiterDto registerRecruiterDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = new User
            {
                UserName = registerRecruiterDto.Email,
                Email = registerRecruiterDto.Email,
            };

            var result = await _userManager.CreateAsync(user, registerRecruiterDto.Password);

            if (!result.Succeeded)
                return BadRequest(result.Errors);

            var recruiter = new Recruiter()
            {
                FirstName = registerRecruiterDto.FirstName,
                LastName = registerRecruiterDto.LastName,
                IsFreelancer = true,
                User = user
            };

            await _recruiterService.CreateAsync(recruiter);

            return Ok(result);
        }
    }
}
