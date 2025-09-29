import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useUserStore } from "../store/useUserStore";
import { useToastStore } from "../store/useToastStore";

export default function MovieCard({ movie, isFavorite, isInWatchlist }) {
  const { toggleFavorite, toggleWatchlist } = useUserStore();
  const { show } = useToastStore();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null;

  return (
    <div className="group relative cursor-pointer">
      {/* Card Container */}
      <div className="relative aspect-[16/9] bg-dark-200 rounded-lg overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:z-10">
        
        {/* Movie Poster */}
        <Link to={`/movie/${movie.id}`} className="block w-full h-full">
          {posterUrl && !imageError ? (
            <>
              {/* Loading Skeleton */}
              {!imageLoaded && (
                <div className="absolute inset-0 bg-dark-200 animate-pulse flex items-center justify-center">
                  <div className="w-12 h-12 text-gray-600">🎬</div>
                </div>
              )}
              
              <img
                src={posterUrl}
                alt={movie.title}
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
                loading="lazy"
              />
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-dark-300 to-dark-400 flex items-center justify-center p-4">
              <div className="text-center">
                <div className="text-4xl mb-2">🎬</div>
                <p className="text-xs text-gray-400 line-clamp-2">{movie.title}</p>
              </div>
            </div>
          )}

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300" />
        </Link>

        {/* Action Buttons */}
        <div className="absolute top-2 right-2 flex flex-col space-y-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite(movie.id);
              show(isFavorite ? 'Favorilerden çıkarıldı' : 'Favorilere eklendi', 'success');
            }}
            className={`p-2 rounded-full backdrop-blur-md transition-all duration-200 ${
              isFavorite
                ? 'bg-brand-600/90 text-white shadow-glow'
                : 'bg-black/70 text-gray-300 hover:bg-brand-600/90 hover:text-white'
            }`}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
          </button>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWatchlist(movie.id);
              show(isInWatchlist ? 'Listeden çıkarıldı' : 'Listeye eklendi', 'success');
            }}
            className={`p-2 rounded-full backdrop-blur-md transition-all duration-200 ${
              isInWatchlist
                ? 'bg-accent-400/90 text-dark-100'
                : 'bg-black/70 text-gray-300 hover:bg-accent-400/90 hover:text-dark-100'
            }`}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Rating Badge */}
        {movie.vote_average > 0 && (
          <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-sm rounded-full px-2 py-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="flex items-center space-x-1">
              <span className="text-accent-400">⭐</span>
              <span className="text-white text-xs font-medium">
                {movie.vote_average.toFixed(1)}
              </span>
            </div>
          </div>
        )}

        {/* Play Icon */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 transform scale-75 group-hover:scale-100 transition-transform duration-300">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>

      {/* Movie Info */}
      <div className="mt-2 px-1">
        <Link to={`/movie/${movie.id}`}>
          <h3 className="text-white text-sm font-medium line-clamp-1 hover:text-brand-400 transition-colors">
            {movie.title}
          </h3>
        </Link>
        <div className="flex items-center justify-between mt-1">
          <span className="text-gray-400 text-xs">
            {movie.release_date ? new Date(movie.release_date).getFullYear() : 'TBA'}
          </span>
        </div>
      </div>
    </div>
  );
}