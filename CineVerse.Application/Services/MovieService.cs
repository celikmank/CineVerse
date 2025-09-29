using CineVerse.Application.Interfaces;
using CineVerse.Domain.Entities;
using Microsoft.Extensions.Configuration;
using System.Text;
using System.Text.Json;


namespace CineVerse.Application.Services
{
    public class MovieService : IMovieService
    {
        private readonly IConfiguration _configuration;
        private readonly HttpClient _httpClient;

        public MovieService(IConfiguration configuration, HttpClient httpClient)
        {
            _configuration = configuration;
            _httpClient = httpClient;
        }

        public async Task<List<Movie>> GetPopularMoviesAsync()
        {
            var apiKey = _configuration["Tmdb:ApiKey"];
            var url = $"{_configuration["Tmdb:BaseUrl"]}movie/popular?api_key={apiKey}&language=en-US&page=1";

            var response = await _httpClient.GetStringAsync(url);
            using var doc = JsonDocument.Parse(response);
            var results = doc.RootElement.GetProperty("results");

            var movies = new List<Movie>();
            foreach (var item in results.EnumerateArray())
            {
                movies.Add(new Movie
                {
                    TmdbId = item.GetProperty("id").GetInt32(),
                    Title = item.GetProperty("title").GetString() ?? "",
                    PosterPath = item.GetProperty("poster_path").GetString() ?? "",
                    ReleaseDate = item.TryGetProperty("release_date", out var rd) ? DateTime.Parse(rd.GetString()!) : null
                });
            }
            return movies;
        }

        public async Task<Movie?> GetMovieDetailsAsync(int tmdbId)
        {
            var apiKey = _configuration["Tmdb:ApiKey"];
            var url = $"{_configuration["Tmdb:BaseUrl"]}movie/{tmdbId}?api_key={apiKey}&language=en-US";

            var response = await _httpClient.GetStringAsync(url);
            using var doc = JsonDocument.Parse(response);

            
            var root = doc.RootElement;

            return new Movie
            {
                TmdbId = root.GetProperty("id").GetInt32(),
                Title = root.GetProperty("title").GetString() ?? "",
                PosterPath = root.GetProperty("poster_path").GetString() ?? "",
                ReleaseDate = root.TryGetProperty("release_date", out var rd) && !string.IsNullOrEmpty(rd.GetString())
                              ? DateTime.Parse(rd.GetString()!)
                              : null
            };
        }
    }
}
