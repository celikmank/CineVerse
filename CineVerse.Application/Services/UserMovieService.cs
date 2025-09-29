using CineVerse.Application.Interfaces;
using CineVerse.Domain.Entities;
using CineVerse.Infrastructure;
using Microsoft.Data.SqlClient; // SqlException için bu using ifadesi gerekli
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic; // KeyNotFoundException için
using System.Linq;
using System.Threading.Tasks;

namespace CineVerse.Application.Services
{
    public class UserMovieService : IUserMovieService
    {
        private readonly CineVerseDbContext _context;

        public UserMovieService(CineVerseDbContext context)
        {
            _context = context;
        }

        public async Task AddToWatchlistAsync(string userId, int tmdbId)
        {
            // İYİLEŞTİRME: Kullanıcı kontrolü, kod tekrarını önlemek için ayrı bir metoda taşınabilir
            // veya her metodun başında yapılabilir. Tutarlılık için burada kalması iyi.
            if (!await _context.Users.AnyAsync(u => u.Id == userId))
            {
                throw new KeyNotFoundException($"User with ID '{userId}' not found.");
            }

            var movie = await GetOrCreateMovie(tmdbId);
            if (!await _context.WatchlistItems.AnyAsync(w => w.UserId == userId && w.MovieId == movie.Id))
            {
                _context.WatchlistItems.Add(new WatchlistItem { UserId = userId, MovieId = movie.Id });

                // İYİLEŞTİRME: "Race Condition" (yarış durumu) hatasını yakalamak için try-catch bloğu eklendi.
                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateException ex) when (ex.InnerException is SqlException sqlEx && sqlEx.Number == 2627)
                {
                    // Hata Kodu 2627: Primary Key ihlali.
                    // Bu, başka bir isteğin bizden önce aynı kaydı eklediği anlamına gelir.
                    // Uygulamanın çökmesini engellemek için bu hatayı görmezden geliyoruz.
                }
            }
        }

        public async Task AddToFavoritesAsync(string userId, int tmdbId)
        {
            // YENİ: Kullanıcı kontrolü bu metoda da eklendi.
            if (!await _context.Users.AnyAsync(u => u.Id == userId))
            {
                throw new KeyNotFoundException($"User with ID '{userId}' not found.");
            }

            var movie = await GetOrCreateMovie(tmdbId);
            if (!await _context.FavoriteItems.AnyAsync(f => f.UserId == userId && f.MovieId == movie.Id))
            {
                _context.FavoriteItems.Add(new FavoriteItem { UserId = userId, MovieId = movie.Id });

                // İYİLEŞTİRME: "Race Condition" hatasını yakalamak için try-catch bloğu eklendi.
                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateException ex) when (ex.InnerException is SqlException sqlEx && sqlEx.Number == 2627)
                {
                    // Hata Kodu 2627: Primary Key ihlali.
                    // Aynı kaydı eklemeye çalışan ikinci isteğin hatasını yutuyoruz.
                }
            }
        }

        // --- BU METOTLARDA DEĞİŞİKLİK YOK, ZATEN DOĞRUYDU ---

        public async Task RemoveFromWatchlistAsync(string userId, int tmdbId)
        {
            var movie = await _context.Movies.FirstOrDefaultAsync(m => m.TmdbId == tmdbId);
            if (movie == null) return;

            var item = await _context.WatchlistItems
                .FirstOrDefaultAsync(w => w.UserId == userId && w.MovieId == movie.Id);
            if (item != null)
            {
                _context.WatchlistItems.Remove(item);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<List<int>> GetWatchlistAsync(string userId)
        {
            return await _context.WatchlistItems
                .Where(w => w.UserId == userId)
                .Select(w => w.Movie.TmdbId)
                .ToListAsync();
        }

        public async Task RemoveFromFavoritesAsync(string userId, int tmdbId)
        {
            var movie = await _context.Movies.FirstOrDefaultAsync(m => m.TmdbId == tmdbId);
            if (movie == null) return;

            var item = await _context.FavoriteItems
                .FirstOrDefaultAsync(f => f.UserId == userId && f.MovieId == movie.Id);
            if (item != null)
            {
                _context.FavoriteItems.Remove(item);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<List<int>> GetFavoritesAsync(string userId)
        {
            return await _context.FavoriteItems
                .Where(f => f.UserId == userId)
                .Select(f => f.Movie.TmdbId)
                .ToListAsync();
        }

        private async Task<Movie> GetOrCreateMovie(int tmdbId)
        {
            var movie = await _context.Movies.FirstOrDefaultAsync(m => m.TmdbId == tmdbId);
            if (movie == null)
            {
                movie = new Movie { TmdbId = tmdbId, Title = "Unknown" }; // Title daha sonra gerçek veriyle güncellenmeli
                _context.Movies.Add(movie);

                // İYİLEŞTİRME: Aynı anda iki isteğin aynı filmi oluşturmasını engellemek için
                // buraya da bir try-catch eklenebilir. (Veritabanında TmdbId'nin UNIQUE olması gerekir)
                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateException ex) when (ex.InnerException is SqlException sqlEx && sqlEx.Number == 2601)
                {
                    // Hata Kodu 2601: Unique constraint ihlali.
                    // Başka bir istek bu filmi bizden önce ekledi. Sorun değil, şimdi veritabanından tekrar çekelim.
                    movie = await _context.Movies.FirstAsync(m => m.TmdbId == tmdbId);
                }
            }
            return movie;
        }
    }
}