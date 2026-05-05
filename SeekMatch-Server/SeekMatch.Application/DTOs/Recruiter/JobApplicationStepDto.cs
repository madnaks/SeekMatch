using SeekMatch.Core.Enums;

namespace SeekMatch.Application.DTOs.Recruiter
{
    public class JobApplicationStepDto
    {
        public string? Id { get; set; }
        public JobApplicationStatus Status { get; set; }
        public string? Note { get; set; }
        public string? JobApplicationId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
