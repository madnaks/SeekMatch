namespace SeekMatch.Application.DTOs.Recruiter
{
    public class RecruiterDto
    {
        public required string Email { get; set; }
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public bool IsFreelancer { get; set; }
        public byte[]? ProfilePicture { get; set; }
    }
}
