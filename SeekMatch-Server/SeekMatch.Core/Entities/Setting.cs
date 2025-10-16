namespace SeekMatch.Core.Entities
{
    public class Setting
    {
        public string UserId { get; set; } = null!;
        public required User User { get; set; }
        public string? Language { get; set; }
    }
}
