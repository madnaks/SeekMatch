namespace SeekMatch.Application.DTOs.Representative
{
    public class RepresentativeDto
    {
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public string? Position { get; set; }
        public string? Email { get; set; }
        public byte[]? ProfilePicture { get; set; }
        public required string CompanyId { get; set; }
        public required CompanyDto CompanyDto { get; set; }
    }
}
