using SeekMatch.Core.Enums;

namespace SeekMatch.Application.DTOs.Recruiter
{
    public class JobOfferFilterDto
    {
        public string? Title { get; set; }
        public string? CompanyName { get; set; }
        public JobType Type { get; set; }
        public WorkplaceType WorkplaceType { get; set; }

    }
}
