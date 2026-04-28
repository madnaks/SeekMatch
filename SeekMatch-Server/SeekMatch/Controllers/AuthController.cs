using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SeekMatch.Application.DTOs;
using SeekMatch.Application.Interfaces;
using SeekMatch.Core.Entities;
using SeekMatch.Infrastructure.Interfaces;
using System.Security.Claims;

namespace SeekMatch.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController(UserManager<User> userManager, ISettingService settingService, ITokenService tokenService) : ControllerBase
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

            var jwtToken = tokenService.GenerateJwtToken(user);
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
    }
}
