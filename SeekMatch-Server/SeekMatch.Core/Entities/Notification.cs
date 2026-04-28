namespace SeekMatch.Core.Entities
{
    public class Notification : BaseEntity
    {
        public string Message { get; set; } = string.Empty;
        public bool IsRead { get; set; } = false;
        public required string UserId { get; set; }
        public User? User { get; set; }
    }
}
