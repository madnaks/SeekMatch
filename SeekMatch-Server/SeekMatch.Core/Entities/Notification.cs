namespace SeekMatch.Core.Entities
{
    public class Notification : BaseEntity
    {
        public string Message { get; set; } = string.Empty;
        public bool IsRead { get; set; } = false;
        public required string userId { get; set; }
        public User? user { get; set; }
    }
}
