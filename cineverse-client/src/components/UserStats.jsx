import React, { useEffect, useState } from 'react';
import { useUserStore } from '../store/useUserStore';

export default function UserStats() {
  const { favoriteIds, watchlistIds } = useUserStore();
  const [stats, setStats] = useState({
    totalMoviesWatched: 0,
    favoriteGenres: [],
    watchTimeThisMonth: 0,
    streakDays: 0
  });

  return (
    <div className="bg-dark-200 rounded-lg p-6 mb-8">
      <h2 className="text-xl font-bold text-white mb-4">📊 İstatistikleriniz</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-brand-600">{favoriteIds.size}</div>
          <div className="text-gray-400 text-sm">Favori Film</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-accent-400">{watchlistIds.size}</div>
          <div className="text-gray-400 text-sm">İzleme Listesi</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-green-500">{stats.streakDays}</div>
          <div className="text-gray-400 text-sm">Gün Seriş</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-500">{stats.watchTimeThisMonth}h</div>
          <div className="text-gray-400 text-sm">Bu Ay</div>
        </div>
      </div>
    </div>
  );
}