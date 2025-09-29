import React, { useState, useEffect } from 'react';
import TrailerModal from '../TrailerModal';
import { getMovieVideos } from '../../api/movieApi';

export default function TrailerButton({ movieId, className }) {
  const [trailerKey, setTrailerKey] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePlayTrailer = async () => {
    if (!trailerKey) {
      setLoading(true);
      try {
        const videos = await getMovieVideos(movieId);
        const trailer = videos.data.results?.find(
          video => video.type === 'Trailer' && video.site === 'YouTube'
        );
        if (trailer) {
          setTrailerKey(trailer.key);
          setIsModalOpen(true);
        }
      } catch (error) {
        console.error('Trailer yüklenemedi:', error);
      } finally {
        setLoading(false);
      }
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <button
        onClick={handlePlayTrailer}
        disabled={loading}
        className={`flex items-center space-x-2 ${className}`}
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
        </svg>
        <span>{loading ? 'Yükleniyor...' : 'Fragman İzle'}</span>
      </button>
      
      <TrailerModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        trailerKey={trailerKey}
      />
    </>
  );
}