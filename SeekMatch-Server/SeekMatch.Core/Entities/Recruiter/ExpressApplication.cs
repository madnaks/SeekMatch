namespace SeekMatch.Core.Entities
{
    public class ExpressApplication
    {
        public required string LastName { get; set; }
        public required string FirstName { get; set; }
        public required string Email { get; set; }
        public string? Phone { get; set; }
    }
}
