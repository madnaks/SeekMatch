using SeekMatch.Core.Enums;

namespace SeekMatch.Core.Entities
{
    public class JobApplication: BaseEntity
    {
        public DateTime AppliedAt { get; set; }
        public required string TalentId { get; set; }
        public required Talent Talent { get; set; }
        public required string JobOfferId { get; set; }
        public required JobOffer JobOffer { get; set; }
    }
}
