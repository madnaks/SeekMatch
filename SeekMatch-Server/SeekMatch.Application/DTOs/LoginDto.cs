using System.ComponentModel.DataAnnotations;

namespace SeekMatch.Application.DTOs
{
    public class ResetPasswordDto
    {
        [Required]
        [MinLength(6)]
        public required string CurrentPassword { get; set; }

        [Required]
        [MinLength(6)]
        public required string NewPassword { get; set; }
    }
}
