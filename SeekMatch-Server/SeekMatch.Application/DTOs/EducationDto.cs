using SeekMatch.Core.Entities;

namespace SeekMatch.Application.DTOs
{
    public class EducationDto
    {
        public string? Id { get; set; }
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
