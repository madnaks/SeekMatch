using SeekMatch.Core.Enums;

namespace SeekMatch.Application.DTOs.Recruiter
{
    public class CreateJobOfferDto
    {
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? CompanyName { get; set; }
        public string? Location { get; set; }
        public decimal? Salary { get; set; }
        public JobType JobType { get; set; }
        public DateOnly? PostedAt { get; set; }
        public DateOnly? ExpiresAt { get; set; }
        public bool IsActive { get; set; }
    }
}
