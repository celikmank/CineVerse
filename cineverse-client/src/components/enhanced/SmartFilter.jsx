import React, { useState } from 'react';
import FilterDrawer from '../FilterDrawer';

export default function SmartFilter() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [quickFilters, setQuickFilters] = useState({
    trending: false,
    highRated: false,
    recent: false,
    upcoming: false
  });

  const applyQuickFilter = (filterType) => {
    setQuickFilters(prev => ({
      ...Object.keys(prev).reduce((acc, key) => ({ ...acc, [key]: false }), {}),
      [filterType]: !prev[filterType]
    }));
  };

  return (
    <div className="mb-8">
      {/* Quick Filters */}
      <div className="flex items-center space-x-4 mb-4">
        <h3 className="text-white font-semibold">🔍 Hızlı Filtreler:</h3>
        
        {[
          { key: 'trending', label: '🔥 Trend', color: 'orange' },
          { key: 'highRated', label: '⭐ Yüksek Puanlı', color: 'yellow' },
          { key: 'recent', label: '🆕 Yeni Çıkan', color: 'green' },
          { key: 'upcoming', label: '📅 Yakında', color: 'blue' }
        ].map(filter => (
          <button
            key={filter.key}
            onClick={() => applyQuickFilter(filter.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              quickFilters[filter.key]
                ? 'bg-brand-600 text-white shadow-glow'
                : 'bg-dark-200 text-gray-300 hover:bg-dark-300'
            }`}
          >
            {filter.label}
          </button>
        ))}

        <button
          onClick={() => setIsDrawerOpen(true)}
          className="px-6 py-2 bg-dark-200 hover:bg-dark-300 text-white rounded-full transition-colors flex items-center space-x-2"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
          </svg>
          <span>Gelişmiş Filtre</span>
        </button>
      </div>

      <FilterDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
      />
    </div>
  );
}