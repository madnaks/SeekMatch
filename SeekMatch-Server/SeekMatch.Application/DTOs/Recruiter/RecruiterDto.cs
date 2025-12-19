namespace SeekMatch.Application.DTOs.Recruiter
{
    public class RecruiterDto
    {
        public required string Id { get; set; }
        public required string Email { get; set; }
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public bool IsFreelancer { get; set; } = false;
        public bool IsActive { get; set; } = true;
        public bool CanDeleteJobOffers { get; set; } = true;
        public byte[]? ProfilePicture { get; set; }
    }
}
