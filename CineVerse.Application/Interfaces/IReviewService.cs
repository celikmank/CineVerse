using CineVerse.Application.DTOs;
using CineVerse.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CineVerse.Application.Interfaces
{
    public interface IReviewService
    {
        Task<List<Review>> GetReviewsByMovieAsync(int tmdbId);
        Task<Review> AddReviewAsync(int tmdbId, AddReviewDto dto, string userId);
    }
}
