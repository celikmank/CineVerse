using CineVerse.Application.DTOs;
using CineVerse.Application.Interfaces;
using CineVerse.Domain.Entities;
using CineVerse.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace CineVerse.Application.Services
{
    public class ReviewService : IReviewService
    {
        private readonly CineVerseDbContext _context;

        public ReviewService(CineVerseDbContext context)
        {
            _context = context;
        }

        public async Task<List<Review>> GetReviewsByMovieAsync(int tmdbId)
        {
            return await _context.Reviews
                .Include(r => r.User)
                .Where(r => r.Movie.TmdbId == tmdbId)
                .ToListAsync();
        }

        public async Task<Review> AddReviewAsync(int tmdbId, AddReviewDto dto, string userId)
        {
            var movie = await _context.Movies.FirstOrDefaultAsync(m => m.TmdbId == tmdbId);
            if (movie == null)
            {
                movie = new Movie { TmdbId = tmdbId, Title = "Unknown" }; // placeholder, ileride TMDB’den çek
                _context.Movies.Add(movie);
                await _context.SaveChangesAsync();
            }

            var review = new Review
            {
                Content = dto.Content,
                Rating = dto.Rating,
                UserId = userId,
                MovieId = movie.Id,
                CreatedAt = DateTime.UtcNow
            };

            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();

            return review;
        }
    }
}
