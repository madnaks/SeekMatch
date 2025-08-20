namespace SeekMatch.Application.DTOs.Recruiter
{
    public class ExpressApplicationDto
    {
        public required string LastName { get; set; }
        public required string FirstName { get; set; }
        public required string Email { get; set; }
        public string? Phone { get; set; }
        public string? CvPath { get; set; }
    }
}
