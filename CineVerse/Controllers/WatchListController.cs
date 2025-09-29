using CineVerse.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using System.Threading.Tasks;

namespace CineVerse.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WatchlistController : ControllerBase
    {
        private readonly IUserMovieService _userMovieService;

        public WatchlistController(IUserMovieService userMovieService)
        {
            _userMovieService = userMovieService;
        }

        [HttpGet]
        public async Task<IActionResult> GetWatchlist()
        {
            var userId = "1";
            var watchlist = await _userMovieService.GetWatchlistAsync(userId);
            return Ok(watchlist);
        }

        [HttpPost("{tmdbId}")]
        [EnableRateLimiting("listWrites")] // güncellendi
        public async Task<IActionResult> AddToWatchlist(int tmdbId)
        {
            var userId = "1";
            await _userMovieService.AddToWatchlistAsync(userId, tmdbId);
            return Ok();
        }

        [HttpDelete("{tmdbId}")]
        [EnableRateLimiting("listWrites")] // güncellendi
        public async Task<IActionResult> RemoveFromWatchlist(int tmdbId)
        {
            var userId = "1";
            await _userMovieService.RemoveFromWatchlistAsync(userId, tmdbId);
            return NoContent();
        }
    }
}