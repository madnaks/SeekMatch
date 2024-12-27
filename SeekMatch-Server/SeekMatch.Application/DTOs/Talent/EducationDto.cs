namespace SeekMatch.Application.DTOs.Talent
{
    public class EducationDto
    {
        public string? Id { get; set; }
        public string? Institution { get; set; }
        public string? Diploma { get; set; }
        public string? Domain { get; set; }
        public int? StartYear { get; set; }
        public int? StartMonth { get; set; }
        public int? EndYear { get; set; }
        public int? EndMonth { get; set; }
        public bool CurrentlyStudying { get; set; }
    }
}
