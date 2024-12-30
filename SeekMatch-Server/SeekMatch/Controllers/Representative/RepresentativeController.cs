using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SeekMatch.Application.DTOs.Representative;
using SeekMatch.Application.Interfaces;
using SeekMatch.Core.Entities;

namespace SeekMatch.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RepresentativeController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly ICompanyService _companyService;
        private readonly IRepresentativeService _representativeService;

        public RepresentativeController(
            UserManager<User> userManager, 
            ICompanyService companyService, 
            IRepresentativeService representativeService)
        {
            _userManager = userManager;
            _companyService = companyService;
            _representativeService = representativeService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRepresentativeDto registerRepresentativeDto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var user = new User
                {
                    UserName = registerRepresentativeDto.Email,
                    Email = registerRepresentativeDto.Email,
                };

                var result = await _userManager.CreateAsync(user, registerRepresentativeDto.Password);

                if (!result.Succeeded)
                    return BadRequest(result.Errors);

                var company = new Company()
                {
                    Name = registerRepresentativeDto.CompanyName,
                    Address = registerRepresentativeDto.CompanyAddress,
                    PhoneNumber = registerRepresentativeDto.CompanyPhoneNumber
                };

                await _companyService.CreateAsync(company);

                var representative = new Representative()
                {
                    FirstName = registerRepresentativeDto.FirstName,
                    LastName = registerRepresentativeDto.LastName,
                    Position = registerRepresentativeDto.Position,
                    Company = company,
                    CompanyId = company.Id,
                    User = user
                };

                await _representativeService.CreateAsync(representative);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = "An error occurred while registering the representative." + ex.Message });
            }
        }
    }
}
