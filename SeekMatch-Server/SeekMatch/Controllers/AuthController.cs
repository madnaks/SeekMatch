using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using SeekMatch.Application.DTOs;
using SeekMatch.Application.Interfaces;
using SeekMatch.Core.Entities;
using SeekMatch.Core.Enums;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace SeekMatch.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly ITalentService _talentService;
        private readonly IRecruiterService _recruiterService;
        private readonly IConfiguration _configuration;
        public AuthController(
            UserManager<User> userManager, 
            ITalentService talentService, 
            IRecruiterService recruiterService, 
            IConfiguration configuration)
        {
            _userManager = userManager;
            _talentService = talentService;
            _recruiterService = recruiterService;
            _configuration = configuration;
        }

        //[HttpPost("register")]
        //public async Task<IActionResult> Register([FromBody] RegisterTalentDto registerDto, [FromQuery] UserRole userRole)
        //{
        //    if (!ModelState.IsValid)
        //        return BadRequest(ModelState);

        //    var user = new User
        //    {
        //        UserName = registerDto.Email,
        //        Email = registerDto.Email,
        //    };

        //    var result = await _userManager.CreateAsync(user, registerDto.Password);

        //    if (!result.Succeeded)
        //        return BadRequest(result.Errors);

        //    //await _userManager.AddToRoleAsync(user, model.Role.ToString());

        //    if (userRole == UserRole.Talent)
        //    {
        //        var talent = new Talent()
        //        {
        //            FirstName = registerDto.FirstName,
        //            LastName = registerDto.LastName,
        //            User = user
        //        };

        //        await _talentService.CreateAsync(talent);
        //    }
        //    else if (userRole == UserRole.Recruiter)
        //    {
        //        var recruiter = new Recruiter()
        //        {
        //            FirstName = registerDto.FirstName,
        //            LastName = registerDto.LastName,
        //            // if its a creation of account it has to be a Freelance Recruiter
        //            IsFreelancer = true,
        //            User = user
        //        };

        //        await _recruiterService.CreateAsync(recruiter);
        //    }

        //    return Ok(result);
        //}

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            var user = await _userManager.FindByEmailAsync(loginDto.Email);

            if (user == null)
                return Unauthorized(new { message = "Invalid login credentials." });

            var passwordValid = await _userManager.CheckPasswordAsync(user, loginDto.Password);

            if (!passwordValid)
                return Unauthorized(new { message = "Invalid login credentials." });

            var token = GenerateJwtToken(user);

            return Ok(new { token });
        }

        private string GenerateJwtToken(User user)
        {
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id),
                new Claim(JwtRegisteredClaimNames.Email, user.Email ?? string.Empty)
            };

            var jwtKey = _configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT key is missing from configuration.");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(30),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
