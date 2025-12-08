namespace SeekMatch.Core.Entities
{
    public class Company : BaseEntity
    {
        public required string Name { get; set; }
        public required string Phone { get; set; }
        public required string Address { get; set; }
        public string? Country { get; set; }
        public int? Region { get; set; }
        public int? City { get; set; }
        public string? Description { get; set; }
        public string? Website { get; set; }
        public List<Representative> Representatives { get; set; } = new List<Representative>();
        public List<Recruiter> Recruiters { get; set; } = new List<Recruiter>();
    }
}
