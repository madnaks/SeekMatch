namespace SeekMatch.Core.Entities
{
    public class Recruiter : BaseEntity
    {
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public bool IsFreelancer { get; set; }
        public byte[]? ProfilePicture { get; set; }
        public required User User { get; set; }
        public Company? Company { get; set; }
        public string? CompanyId { get; set; }
    }
}
