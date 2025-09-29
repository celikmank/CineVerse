using CineVerse.Application.Interfaces;
using CineVerse.Domain.Entities;
using CineVerse.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace CineVerse.Application.Services
{
    public class WatchlistService : IWatchlistService
    {
        private readonly CineVerseDbContext _context;

        public WatchlistService(CineVerseDbContext context)
        {
            _context = context;
        }

        public async Task AddToWatchlistAsync(string userId, int movieId)
        {
            var exists = await _context.WatchlistItems
                .AnyAsync(w => w.UserId == userId && w.MovieId == movieId);

            if (!exists)
            {
                var item = new WatchlistItem
                {
                    UserId = userId,
                    MovieId = movieId,
                    AddedAt = DateTime.UtcNow
                };

                _context.WatchlistItems.Add(item);
                await _context.SaveChangesAsync();
            }
        }

        public async Task RemoveFromWatchlistAsync(string userId, int movieId)
        {
            var item = await _context.WatchlistItems
                .FirstOrDefaultAsync(w => w.UserId == userId && w.MovieId == movieId);

            if (item != null)
            {
                _context.WatchlistItems.Remove(item);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<List<WatchlistItem>> GetUserWatchlistAsync(string userId)
        {
            return await _context.WatchlistItems
                .Where(w => w.UserId == userId)
                .Include(w => w.Movie) // Eğer navigation property eklediysen
                .ToListAsync();
        }
    }
}
