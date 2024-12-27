namespace SeekMatch.Application.DTOs.Talent
{
    public class AboutYouDto
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
    }
}
