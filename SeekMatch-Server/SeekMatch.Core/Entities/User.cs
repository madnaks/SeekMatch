namespace SeekMatch.Core.Entities
{
    public class User: BaseEntity
    {
        public required string Email { get; set; }
        public required string Password { get; set; }
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
