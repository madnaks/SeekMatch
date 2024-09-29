using Microsoft.AspNetCore.Identity;
using SeekMatch.Core.Enums;

namespace SeekMatch.Core.Entities
{
    public class User: IdentityUser
    {
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public UserRole Role { get; set; }
        public JobSeeker? JobSeeker { get; set; }
        public Recruiter? Recruiter { get; set; }
    }

}
