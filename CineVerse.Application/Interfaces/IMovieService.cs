using CineVerse.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CineVerse.Application.Interfaces
{
    public interface IMovieService
    {
        Task<List<Movie>> GetPopularMoviesAsync();
        Task<Movie?> GetMovieDetailsAsync(int tmdbId);
    }
}
