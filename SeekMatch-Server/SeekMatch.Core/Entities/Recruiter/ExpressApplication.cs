namespace SeekMatch.Core.Entities
{
    public class ExpressApplication : BaseEntity
    {
        public required string LastName { get; set; }
        public required string FirstName { get; set; }
        public required string Email { get; set; }
        public string? Phone { get; set; }
        public string? FilePath { get; set; }
        public required string JobApplicationId { get; set; }
        public JobApplication? JobApplication { get; set; }
    }
}
