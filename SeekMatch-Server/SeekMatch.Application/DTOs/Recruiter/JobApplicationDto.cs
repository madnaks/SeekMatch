using SeekMatch.Core.Enums;

namespace SeekMatch.Application.DTOs.Recruiter
{
    public class JobApplicationDto
    {
        public string? Id { get; set; }
        public DateTime? AppliedAt { get; set; }
        public string? TalentId { get; set; }
        public string? TalentFullName { get; set; }
        public string? JobOfferId { get; set; }
        public string? JobOfferTitle { get; set; }
        public JobApplicationStatus Status { get; set; }
        public string? RejectionReason { get; set; }
        public bool IsExpress { get; set; } = false;
        public ExpressApplicationDto? ExpressApplication { get; set; }
    }
}
