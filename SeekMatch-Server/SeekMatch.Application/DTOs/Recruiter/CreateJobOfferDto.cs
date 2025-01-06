using SeekMatch.Core.Enums;

namespace SeekMatch.Application.DTOs.Recruiter
{
    public class CreateJobOfferDto
    {
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? CompanyName { get; set; }
        public string? Location { get; set; }
        public string? Salary { get; set; }
        public JobType Type { get; set; }
        public DateOnly? PostedAt { get; set; }
        public DateOnly? ExpiresAt { get; set; }
        public bool IsActive { get; set; }
    }
}
