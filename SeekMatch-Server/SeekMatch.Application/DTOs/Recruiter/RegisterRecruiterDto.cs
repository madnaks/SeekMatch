using SeekMatch.Core.Enums;
using System.ComponentModel.DataAnnotations;

namespace SeekMatch.Application.DTOs.Recruiter
{
    public class RegisterRecruiterDto
    {
        [Required]
        [EmailAddress]
        public required string Email { get; set; }

        [Required]
        [MinLength(6)]
        public required string Password { get; set; }

        [Required]
        public required string FirstName { get; set; }

        [Required]
        public required string LastName { get; set; }
    }
}
