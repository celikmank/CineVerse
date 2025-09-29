import React from 'react';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { getPopularMovies } from '../api/movieApi';
import MovieCard from '../components/MovieCard';
import { useUserStore } from '../store/useUserStore';

export default function HomePage() {
  const { items: movies, loading, error, lastElementRef } = useInfiniteScroll(getPopularMovies);
  const { favoriteIds, watchlistIds } = useUserStore();
  
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold text-white mb-6">Popüler Filmler</h1>
      
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-white mb-6">
          <p>Filmler yüklenirken bir hata oluştu. Lütfen tekrar deneyin.</p>
        </div>
      )}
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {movies.map((movie, index) => {
          if (index === movies.length - 1) {
            return (
              <div ref={lastElementRef} key={movie.id}>
                <MovieCard 
                  movie={movie} 
                  isFavorite={favoriteIds.has(movie.id)}
                  isInWatchlist={watchlistIds.has(movie.id)}
                />
              </div>
            );
          } else {
            return (
              <MovieCard 
                key={movie.id} 
                movie={movie} 
                isFavorite={favoriteIds.has(movie.id)}
                isInWatchlist={watchlistIds.has(movie.id)}
              />
            );
          }
        })}
      </div>
      
      {loading && (
        <div className="flex justify-center my-8">
          <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}