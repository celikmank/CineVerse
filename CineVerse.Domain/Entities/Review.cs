namespace CineVerse.Domain.Entities
{
    public class Review
    {
        public int Id { get; set; }
        public string Content { get; set; } = "";
        public int Rating { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public string UserId { get; set; }
        public User User { get; set; }

        public int MovieId { get; set; }
        public Movie Movie { get; set; }
    }
}
