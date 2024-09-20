using Microsoft.AspNetCore.Identity;

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
    public enum UserRole
    {
        JobSeeker = 1,
        Recruiter = 2
    }
}
