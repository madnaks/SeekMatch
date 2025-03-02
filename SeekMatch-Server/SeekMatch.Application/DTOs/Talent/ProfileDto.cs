namespace SeekMatch.Application.DTOs.Talent
{
    public class ProfileDto
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
    }
}
