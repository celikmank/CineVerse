namespace CineVerse.Application.Interfaces
{
    public interface IUserMovieService
    {
        Task AddToWatchlistAsync(string userId, int tmdbId);
        Task RemoveFromWatchlistAsync(string userId, int tmdbId);
        Task<List<int>> GetWatchlistAsync(string userId);

        Task AddToFavoritesAsync(string userId, int tmdbId);
        Task RemoveFromFavoritesAsync(string userId, int tmdbId);
        Task<List<int>> GetFavoritesAsync(string userId);
    }
}
