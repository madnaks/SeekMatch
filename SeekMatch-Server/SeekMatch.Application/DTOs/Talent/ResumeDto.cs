namespace SeekMatch.Application.DTOs.Talent
{
    public class ResumeDto
    {
        public string? Id { get; set; }
        public required string Title { get; set; }
        public bool IsPrimary { get; set; }
    }
}
