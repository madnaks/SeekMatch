using SeekMatch.Core.Enums;

namespace SeekMatch.Core.Entities
{
    public class JobApplicationStep: BaseEntity
    {
        public JobApplicationStatus Status { get; set; } = JobApplicationStatus.Submitted;
        public string? Note { get; set; }
        public required string JobApplicationId { get; set; }
        public JobApplication? JobApplication { get; set; }
    }
}
