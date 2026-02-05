using SeekMatch.Core.Enums;

namespace SeekMatch.Application.DTOs.Recruiter
{
    public class JobOfferDto
    {
        public string? Id { get; set; }
        public required string Title { get; set; }
        public required string Description { get; set; }
        public string? PositionDetails { get; set; }
        public string? Qualifications { get; set; }
        public string? AdditionalRequirements { get; set; }
        public string? CompanyInfo { get; set; }
        public string? CompanyName { get; set; }
        public required string Location { get; set; }
        public string? Salary { get; set; }
        public JobType Type { get; set; }
        public WorkplaceType WorkplaceType { get; set; }
        public DateOnly? PostedAt { get; set; }
        public DateOnly? ExpiresAt { get; set; }
        public bool IsActive { get; set; }
        public List<JobApplicationDto> JobApplications { get; set; } = new List<JobApplicationDto>();
        public JobApplicationStatsDto? Stats { get; set; }
    }
}
