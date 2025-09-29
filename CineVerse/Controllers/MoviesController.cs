using CineVerse.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;

namespace CineVerse.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MoviesController : ControllerBase
    {
        private readonly IMovieService _movieService;
        public MoviesController(IMovieService movieService)
        {
            _movieService = movieService;
        }

        [HttpGet("popular")]
        [OutputCache(PolicyName = "Popular15m")]
        public async Task<IActionResult> GetPopular()
        {
            var movies = await _movieService.GetPopularMoviesAsync();
            return Ok(movies);
        }

        [HttpGet("{tmdbId}")]
        [OutputCache(PolicyName = "Movie5m")] // eklendi
        public async Task<IActionResult> GetMovie(int tmdbId)
        {
            var movie = await _movieService.GetMovieDetailsAsync(tmdbId);
            if (movie == null) return NotFound();
            return Ok(movie);
        }
    }
}
