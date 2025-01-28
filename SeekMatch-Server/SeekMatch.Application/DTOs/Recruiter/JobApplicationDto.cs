using SeekMatch.Application.DTOs.Representative;
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
    }
}
