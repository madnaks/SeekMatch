namespace SeekMatch.Core.Entities
{
    public class Bookmark : BaseEntity
    {
        public JobOffer? JobOffer { get; set; }
        public required string JobOfferId { get; set; }
        public Talent? Talent { get; set; }
        public required string TalentId { get; set; }
    }
}
