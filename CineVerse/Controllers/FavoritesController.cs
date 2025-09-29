using CineVerse.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace CineVerse.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FavoritesController : ControllerBase
    {
        private readonly IUserMovieService _userMovieService;

        public FavoritesController(IUserMovieService userMovieService)
        {
            _userMovieService = userMovieService;
        }

        [HttpGet]
        public async Task<IActionResult> GetFavorites()
        {
            var userId = "1";
            var favorites = await _userMovieService.GetFavoritesAsync(userId);
            return Ok(favorites);
        }

        [HttpPost("{tmdbId}")]
        [EnableRateLimiting("listWrites")] // güncellendi
        public async Task<IActionResult> AddToFavorites(int tmdbId)
        {
            var userId = "1";
            await _userMovieService.AddToFavoritesAsync(userId, tmdbId);
            return Ok();
        }

        [HttpDelete("{tmdbId}")]
        [EnableRateLimiting("listWrites")] // güncellendi
        public async Task<IActionResult> RemoveFromFavorites(int tmdbId)
        {
            var userId = "1";
            await _userMovieService.RemoveFromFavoritesAsync(userId, tmdbId);
            return NoContent();
        }
    }
}