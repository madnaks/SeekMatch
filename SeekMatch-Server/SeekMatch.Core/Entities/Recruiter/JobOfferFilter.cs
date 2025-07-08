using SeekMatch.Core.Enums;

namespace SeekMatch.Core.Entities
{
    public class JobOfferFilter
    {
        public string? Title { get; set; }
        public string? CompanyName { get; set; }
        public JobType? Type { get; set; }
        public WorkplaceType? WorkplaceType { get; set; }

    }
}
