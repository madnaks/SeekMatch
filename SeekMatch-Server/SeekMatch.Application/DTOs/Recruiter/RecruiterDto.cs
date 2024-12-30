namespace SeekMatch.Application.DTOs.Recruiter
{
    public class RecruiterDto
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public bool IsFreelancer { get; set; }
        public string? Email { get; set; }
        public byte[]? ProfilePicture { get; set; }
    }
}
