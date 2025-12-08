namespace SeekMatch.Application.DTOs.Representative
{
    public class CompanyDto
    {
        public required string Name { get; set; }
        public required string Phone { get; set; }
        public required string Address { get; set; }
        public string? Country { get; set; }
        public int? Region { get; set; }
        public int? City { get; set; }
        public string? Description { get; set; }
        public string? Website { get; set; }
    }
}
