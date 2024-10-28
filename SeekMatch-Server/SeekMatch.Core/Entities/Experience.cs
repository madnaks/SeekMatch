using SeekMatch.Core.Enums;

namespace SeekMatch.Core.Entities
{
    public class Experience : BaseEntity
    {
        public required string CompanyName { get; set; }
        public string? JobTitle { get; set; }
        public int StartYear { get; set; }
        public int StartMonth { get; set; }
        public int? EndYear { get; set; }
        public int? EndMonth { get; set; }
        public bool CurrentlyWorking { get; set; }
        public string? Description { get; set; }
        public ExperienceType Type { get; set; }
        public required Talent Talent { get; set; }
        public required string TalentId { get; set; }
    }
}
