namespace SeekMatch.Core.Entities
{
    public class Talent: BaseEntity
    {
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public string? ProfileTitle { get; set; }
        public DateOnly DateOfBirth { get; set; }
        public string? Address { get; set; }
        public string? Phone { get; set; }
        public string? City { get; set; }
        public string? State { get; set; }
        public string? Zip { get; set; }
        public byte[]? ProfilePicture { get; set; }
        public required User User { get; set; }
        public List<Education> Educations { get; set; } = new List<Education>();
        public List<Experience> Experiences { get; set; } = new List<Experience>();
    }
}
