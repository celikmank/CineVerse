import React, { useState } from 'react';

export default function AdvancedSearch({ onSearch }) {
  const [filters, setFilters] = useState({
    query: '',
    genre: '',
    year: '',
    rating: 0,
    sortBy: 'popularity.desc'
  });

  const genres = [
    { id: 28, name: "Aksiyon" },
    { id: 35, name: "Komedi" },
    { id: 18, name: "Drama" },
    // ... diğer türler
  ];

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h3 className="text-xl font-bold mb-4">Gelişmiş Arama</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Film ara..."
          value={filters.query}
          onChange={(e) => setFilters({...filters, query: e.target.value})}
          className="px-3 py-2 bg-gray-700 rounded-lg"
        />
        
        <select
          value={filters.genre}
          onChange={(e) => setFilters({...filters, genre: e.target.value})}
          className="px-3 py-2 bg-gray-700 rounded-lg"
        >
          <option value="">Tüm Türler</option>
          {genres.map(genre => (
            <option key={genre.id} value={genre.id}>{genre.name}</option>
          ))}
        </select>
        
        <input
          type="number"
          placeholder="Yıl"
          value={filters.year}
          onChange={(e) => setFilters({...filters, year: e.target.value})}
          className="px-3 py-2 bg-gray-700 rounded-lg"
        />
        
        <button
          onClick={() => onSearch(filters)}
          className="px-6 py-2 bg-brand-600 hover:bg-brand-700 rounded-lg"
        >
          Ara
        </button>
      </div>
    </div>
  );
}