namespace SeekMatch.Core.Entities
{
    public class Resume : BaseEntity
    {
        public required string Title { get; set; }
        public required string FilePath { get; set; }
        public bool IsPrimary { get; set; }
        public required Talent Talent { get; set; }
        public required string TalentId { get; set; }

    }
}
