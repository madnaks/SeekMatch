namespace SeekMatch.Core.Entities
{
    public class Talent: BaseEntity
    {
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public required User User { get; set; }
    }
}
