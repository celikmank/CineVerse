namespace CineVerse.Application.DTOs
{
    public class AddReviewDto
    {
        public string Content { get; set; } = "";
        public int Rating { get; set; } // 1-10 arası
    }
}
