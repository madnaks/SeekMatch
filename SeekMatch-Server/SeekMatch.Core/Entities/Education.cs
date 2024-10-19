namespace SeekMatch.Core.Entities
{
    public class Education : BaseEntity
    {
        public required string Institution { get; set; }
        public string? Diploma { get; set; }
        public string? Domain { get; set; }
        public int StartYear { get; set; }
        public int StartMonth { get; set; }
        public int? FinishYear { get; set; }
        public int? FinishMonth { get; set; }
        public bool CurrentlyStudying { get; set; }
        public required Talent Talent { get; set; }
        public required string TalentId { get; set; }
    }

}
