namespace SeekMatch.Core.Entities
{
    public class BookmarkDto
    {
        public string? Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public JobOffer? JobOffer { get; set; }
        public required string JobOfferId { get; set; }
        public required string TalentId { get; set; }
    }
}
