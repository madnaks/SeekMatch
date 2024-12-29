using System.ComponentModel.DataAnnotations;

namespace SeekMatch.Application.DTOs.Recruiter
{
    public class RegisterRepresentativeDto
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
        
        public string? Position { get; set; }
        
        [Required]
        public required string CompanyName { get; set; }        
        
        [Required]
        public required string CompanyAddress { get; set; }        
        
        [Required]
        public required string CompanyPhoneNumber { get; set; }
    }
}
