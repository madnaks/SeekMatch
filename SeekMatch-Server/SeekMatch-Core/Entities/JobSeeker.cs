namespace SeekMatch_Core.Entities
{
    public class JobSeeker: BaseEntity
    {
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public required User User { get; set; }

    }
}
