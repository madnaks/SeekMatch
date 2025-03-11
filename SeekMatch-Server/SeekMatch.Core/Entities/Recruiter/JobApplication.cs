using SeekMatch.Core.Enums;

namespace SeekMatch.Core.Entities
{
    public class JobApplication: BaseEntity
    {
        public DateTime AppliedAt { get; set; }
        public required string TalentId { get; set; }
        public Talent? Talent { get; set; }
        public required string JobOfferId { get; set; }
        public JobOffer? JobOffer { get; set; }
        public JobApplicationStatus Status { get; set; } = JobApplicationStatus.Pending;
        public string? RejectionReason { get; set; }
    }
}
