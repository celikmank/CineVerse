import React, { useEffect, useState } from 'react';
import MovieCard from './MovieCard';
import { useUserStore } from '../store/useUserStore';
import { getRecommendations } from '../api/movieApi';

export default function RecommendationSection() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { favoriteIds, watchlistIds } = useUserStore();

  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        // Favorilerden bir film seç ve öneriler al
        const favoriteMovies = Array.from(favoriteIds);
        if (favoriteMovies.length > 0) {
          const randomFavorite = favoriteMovies[Math.floor(Math.random() * favoriteMovies.length)];
          const response = await getRecommendations(randomFavorite);
          setRecommendations(response.data.results?.slice(0, 10) || []);
        }
      } catch (error) {
        console.error('Öneriler yüklenemedi:', error);
      } finally {
        setLoading(false);
      }
    };

    if (favoriteIds.size > 0) {
      loadRecommendations();
    } else {
      setLoading(false);
    }
  }, [favoriteIds]);

  if (loading) return <div className="animate-pulse">Öneriler yükleniyor...</div>;
  if (recommendations.length === 0) return null;

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-white mb-6">🎯 Size Özel Öneriler</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4">
        {recommendations.map(movie => (
          <MovieCard 
            key={movie.id} 
            movie={movie}
            isFavorite={favoriteIds.has(movie.id)}
            isInWatchlist={watchlistIds.has(movie.id)}
          />
        ))}
      </div>
    </div>
  );
}