namespace CineVerse.Domain.Entities
{
    public class Movie
    {
        public int Id { get; set; }
        public int TmdbId { get; set; }
        public string Title { get; set; } = "";
        public string PosterPath { get; set; } = "";
        public DateTime? ReleaseDate { get; set; }
    }
}
