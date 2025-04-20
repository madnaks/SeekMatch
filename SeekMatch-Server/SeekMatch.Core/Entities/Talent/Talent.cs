namespace SeekMatch.Core.Entities
{
    public class Talent: BaseEntity
    {
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public string? ProfileTitle { get; set; }
        public string? Summary { get; set; }
        public DateOnly DateOfBirth { get; set; }
        public string? Phone { get; set; }
        public string? Country { get; set; }
        public int? Region { get; set; }
        public int? City { get; set; }
        public string? Website { get; set; }
        public string? LinkedIn { get; set; }
        public byte[]? ProfilePicture { get; set; }
        public required User User { get; set; }
        public List<Education> Educations { get; set; } = new List<Education>();
        public List<Experience> Experiences { get; set; } = new List<Experience>();
        public List<JobApplication> JobApplications { get; set; } = new List<JobApplication>();
    }
}
