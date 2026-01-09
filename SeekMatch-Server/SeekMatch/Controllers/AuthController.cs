using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using SeekMatch.Application.DTOs;
using SeekMatch.Application.DTOs.Talent;
using SeekMatch.Application.Interfaces;
using SeekMatch.Core.Entities;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace SeekMatch.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController(UserManager<User> userManager, IConfiguration configuration, ISettingService settingService) : ControllerBase
    {
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            var user = await userManager.FindByEmailAsync(loginDto.Email);
            if (user == null)
                return Unauthorized(new { message = "Invalid login credentials." });

            var passwordValid = await userManager.CheckPasswordAsync(user, loginDto.Password);
            if (!passwordValid)
                return Unauthorized(new { message = "Invalid login credentials." });

            var jwtToken = GenerateJwtToken(user);
            var setting = await settingService.GetUserSettingAsync(user.Id);

            return Ok(new { 
                token = jwtToken,
                role = user.Role,
                language = setting?.Language,
                isTemporaryPassword = user.IsTemporaryPassword
            });
        }

        [HttpPost("change-password")]
        [Authorize]
        public async Task<IActionResult> ChangePassword([FromBody] ResetPasswordDto resetPasswordDto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var user = await userManager.FindByIdAsync(userId);
            if (user == null) 
                return Unauthorized();

            var passwordValid = await userManager.CheckPasswordAsync(user, resetPasswordDto.CurrentPassword);
            if (!passwordValid)
                return Unauthorized(new { message = "Invalid login credentials." });

            var result = await userManager.ChangePasswordAsync(
                user,
                resetPasswordDto.CurrentPassword,
                resetPasswordDto.NewPassword
            );

            if (!result.Succeeded)
                return BadRequest(result.Errors);


            user.IsTemporaryPassword = false;
            await userManager.UpdateAsync(user);

            return Ok(result);
        }

        private string GenerateJwtToken(User user)
        {
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id),
                new Claim(JwtRegisteredClaimNames.Email, user.Email ?? string.Empty)
            };

            var jwtKey = configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT key is missing from configuration.");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: configuration["Jwt:Issuer"],
                audience: configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(30),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
