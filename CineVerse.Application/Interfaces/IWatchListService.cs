using CineVerse.Domain.Entities;

namespace CineVerse.Application.Interfaces
{
    public interface IWatchlistService
    {
        Task AddToWatchlistAsync(string userId, int movieId);
        Task RemoveFromWatchlistAsync(string userId, int movieId);
        Task<List<WatchlistItem>> GetUserWatchlistAsync(string userId);
    }
}