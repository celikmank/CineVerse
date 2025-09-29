import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const GENRES = [
  { id: 28, name: "Aksiyon" },
  { id: 12, name: "Macera" },
  { id: 16, name: "Animasyon" },
  { id: 35, name: "Komedi" },
  { id: 80, name: "Suç" },
  { id: 99, name: "Belgesel" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Aile" },
  { id: 14, name: "Fantastik" },
  { id: 36, name: "Tarih" },
  { id: 27, name: "Korku" },
  { id: 10402, name: "Müzik" },
  { id: 9648, name: "Gizem" },
  { id: 10749, name: "Romantik" },
  { id: 878, name: "Bilim-Kurgu" },
  { id: 10770, name: "TV Film" },
  { id: 53, name: "Gerilim" },
  { id: 10752, name: "Savaş" },
  { id: 37, name: "Batı" }
];

export default function FilterDrawer({ isOpen, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [yearRange, setYearRange] = useState({ min: 1900, max: new Date().getFullYear() });
  const [voteRange, setVoteRange] = useState({ min: 0, max: 10 });
  const [sortBy, setSortBy] = useState('popularity.desc');
  
  // Parse query params on mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    
    // Parse genres
    const genreParam = params.get('with_genres');
    if (genreParam) {
      setSelectedGenres(genreParam.split(',').map(id => parseInt(id)));
    }
    
    // Parse years
    const yearMinParam = params.get('primary_release_date.gte');
    const yearMaxParam = params.get('primary_release_date.lte');
    if (yearMinParam || yearMaxParam) {
      setYearRange({
        min: yearMinParam ? parseInt(yearMinParam.substring(0, 4)) : 1900,
        max: yearMaxParam ? parseInt(yearMaxParam.substring(0, 4)) : new Date().getFullYear()
      });
    }
    
    // Parse vote
    const voteMinParam = params.get('vote_average.gte');
    const voteMaxParam = params.get('vote_average.lte');
    if (voteMinParam || voteMaxParam) {
      setVoteRange({
        min: voteMinParam ? parseFloat(voteMinParam) : 0,
        max: voteMaxParam ? parseFloat(voteMaxParam) : 10
      });
    }
    
    // Parse sort
    const sortParam = params.get('sort_by');
    if (sortParam) {
      setSortBy(sortParam);
    }
  }, [location.search]);
  
  const toggleGenre = (genreId) => {
    setSelectedGenres(prev => 
      prev.includes(genreId) 
        ? prev.filter(id => id !== genreId)
        : [...prev, genreId]
    );
  };
  
  const handleApplyFilters = () => {
    const params = new URLSearchParams();
    
    // Add genres
    if (selectedGenres.length > 0) {
      params.set('with_genres', selectedGenres.join(','));
    }
    
    // Add years
    if (yearRange.min !== 1900) {
      params.set('primary_release_date.gte', `${yearRange.min}-01-01`);
    }
    if (yearRange.max !== new Date().getFullYear()) {
      params.set('primary_release_date.lte', `${yearRange.max}-12-31`);
    }
    
    // Add votes
    if (voteRange.min !== 0) {
      params.set('vote_average.gte', voteRange.min.toString());
    }
    if (voteRange.max !== 10) {
      params.set('vote_average.lte', voteRange.max.toString());
    }
    
    // Add sort
    params.set('sort_by', sortBy);
    
    // Navigate to discover with filters
    navigate(`/discover?${params.toString()}`);
    onClose();
  };
  
  const handleResetFilters = () => {
    setSelectedGenres([]);
    setYearRange({ min: 1900, max: new Date().getFullYear() });
    setVoteRange({ min: 0, max: 10 });
    setSortBy('popularity.desc');
  };

  return (
    <div className={`fixed inset-0 z-50 bg-black bg-opacity-50 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className={`fixed inset-y-0 right-0 w-full sm:w-96 bg-gray-900 transform transition-transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} overflow-auto`}>
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Filmleri Filtrele</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-800">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-4">
          <div className="mb-6">
            <h3 className="text-white font-semibold mb-2">Türler</h3>
            <div className="flex flex-wrap gap-2">
              {GENRES.map(genre => (
                <button
                  key={genre.id}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedGenres.includes(genre.id)
                      ? 'bg-brand-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                  onClick={() => toggleGenre(genre.id)}
                >
                  {genre.name}
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-white font-semibold mb-2">Yıl Aralığı</h3>
            <div className="flex items-center space-x-4">
              <input
                type="number"
                min="1900"
                max={yearRange.max}
                value={yearRange.min}
                onChange={(e) => setYearRange({...yearRange, min: parseInt(e.target.value)})}
                className="w-24 bg-gray-800 text-white border border-gray-700 rounded px-2 py-1"
              />
              <span className="text-gray-400">-</span>
              <input
                type="number"
                min={yearRange.min}
                max={new Date().getFullYear()}
                value={yearRange.max}
                onChange={(e) => setYearRange({...yearRange, max: parseInt(e.target.value)})}
                className="w-24 bg-gray-800 text-white border border-gray-700 rounded px-2 py-1"
              />
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-white font-semibold mb-2">Puanlama ({voteRange.min} - {voteRange.max})</h3>
            <input
              type="range"
              min="0"
              max="10"
              step="0.5"
              value={voteRange.min}
              onChange={(e) => setVoteRange({...voteRange, min: parseFloat(e.target.value)})}
              className="w-full mb-2"
            />
            <input
              type="range"
              min="0"
              max="10"
              step="0.5"
              value={voteRange.max}
              onChange={(e) => setVoteRange({...voteRange, max: parseFloat(e.target.value)})}
              className="w-full"
            />
          </div>
          
          <div className="mb-8">
            <h3 className="text-white font-semibold mb-2">Sıralama</h3>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-gray-800 text-white border border-gray-700 rounded px-2 py-2"
            >
              <option value="popularity.desc">Popülerlik (Azalan)</option>
              <option value="popularity.asc">Popülerlik (Artan)</option>
              <option value="vote_average.desc">Puan (Azalan)</option>
              <option value="vote_average.asc">Puan (Artan)</option>
              <option value="release_date.desc">Yayın Tarihi (Yeni)</option>
              <option value="release_date.asc">Yayın Tarihi (Eski)</option>
            </select>
          </div>
          
          <div className="flex space-x-4">
            <button
              onClick={handleResetFilters}
              className="flex-1 py-2 rounded-md bg-gray-800 text-white hover:bg-gray-700 transition-colors"
            >
              Sıfırla
            </button>
            <button
              onClick={handleApplyFilters}
              className="flex-1 py-2 rounded-md bg-brand-600 text-white hover:bg-brand-700 transition-colors"
            >
              Uygula
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}