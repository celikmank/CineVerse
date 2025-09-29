using CineVerse.Application.DTOs;
using CineVerse.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CineVerse.Controllers
{
    [ApiController]
    [Route("api/movies/{tmdbId}/reviews")]
    public class ReviewsController : ControllerBase
    {
        private readonly IReviewService _reviewService;

        public ReviewsController(IReviewService reviewService)
        {
            _reviewService = reviewService;
        }

        [HttpGet]
        public async Task<IActionResult> GetReviews(int tmdbId)
        {
            var reviews = await _reviewService.GetReviewsByMovieAsync(tmdbId);
            return Ok(reviews);
        }

        [HttpPost]
        public async Task<IActionResult> AddReview(int tmdbId, AddReviewDto dto)
        {
            // Demo amaçlı: Kimlik doğrulama eklenene kadar sabit kullanıcı
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "1";

            var review = await _reviewService.AddReviewAsync(tmdbId, dto, userId);
            return Ok(review);
        }
    }
}
