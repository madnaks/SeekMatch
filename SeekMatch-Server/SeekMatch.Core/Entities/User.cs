using Microsoft.AspNetCore.Identity;
using SeekMatch.Core.Enums;

namespace SeekMatch.Core.Entities
{
    public class User: IdentityUser
    {
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public bool IsTemporaryPassword { get; set; } = false;
        public UserRole Role { get; set; }
        public Talent? Talent { get; set; }
        public Recruiter? Recruiter { get; set; }
        public Representative? Representative { get; set; }
    }

}
