using SeekMatch.Core.Enums;

namespace SeekMatch.Application.DTOs.Talent
{
    public class CreateExperienceDto
    {
        public string? CompanyName { get; set; }
        public string? JobTitle { get; set; }
        public int? StartYear { get; set; }
        public int? StartMonth { get; set; }
        public int? EndYear { get; set; }
        public int? EndMonth { get; set; }
        public bool CurrentlyWorking { get; set; }
        public string? Description { get; set; }
        public JobType Type { get; set; }
    }
}
