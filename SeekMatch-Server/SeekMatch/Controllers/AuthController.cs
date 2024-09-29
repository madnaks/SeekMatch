using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SeekMatch.Application.DTOs;
using SeekMatch.Core.Entities;

namespace SeekMatch.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        public AuthController(UserManager<User> userManager)
        {
            _userManager = userManager;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto model)
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

            return Ok(result);
        }
    }
}
