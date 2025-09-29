namespace CineVerse.Domain.Entities
{
    public class FavoriteItem
    {
        public string UserId { get; set; }
        public int MovieId { get; set; }

        // Navigation Properties
        public User User { get; set; } = null!;
        public Movie Movie { get; set; } = null!;
    }
}
