namespace CineVerse.Domain.Entities
{
    public class WatchlistItem
    {
        public string UserId { get; set; } = null!;
        public int MovieId { get; set; }

        public DateTime AddedAt { get; set; } = DateTime.UtcNow;

        // Navigation Properties
        public User User { get; set; } = null!;
        public Movie Movie { get; set; } = null!;
    }
}
