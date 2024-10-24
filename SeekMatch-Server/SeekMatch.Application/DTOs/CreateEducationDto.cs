namespace SeekMatch.Application.DTOs
{
    public class CreateEducationDto
    {
        public string? Institution { get; set; }
        public string? Diploma { get; set; }
        public string? Domain { get; set; }
        public int? StartYear { get; set; }
        public int? StartMonth { get; set; }
        public int? FinishYear { get; set; }
        public int? FinishMonth { get; set; }
        public bool CurrentlyStudying { get; set; }
    }
}
