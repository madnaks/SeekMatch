namespace SeekMatch.Core.Entities
{
    public class Company : BaseEntity
    {
        public required string Name { get; set; }
        public required string PhoneNumber { get; set; }
        public required string Address { get; set; }
        public List<Representative> Representatives { get; set; } = new List<Representative>();
        public List<Recruiter> Recruiters { get; set; } = new List<Recruiter>();
    }
}
