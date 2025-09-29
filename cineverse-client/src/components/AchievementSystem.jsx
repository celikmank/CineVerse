import React from 'react';

const ACHIEVEMENTS = [
  {
    id: 'first_favorite',
    title: '❤️ İlk Aşk',
    description: 'İlk filminizi favorilere eklediniz',
    condition: (stats) => stats.favoriteCount >= 1
  },
  {
    id: 'movie_buff',
    title: '🎬 Film Tutkunu',
    description: '50 film izlediniz',
    condition: (stats) => stats.watchedCount >= 50
  },
  {
    id: 'critic',
    title: '⭐ Eleştirmen',
    description: '10 film incelemesi yazdınız',
    condition: (stats) => stats.reviewCount >= 10
  }
];

export default function AchievementSystem({ userStats }) {
  const unlockedAchievements = ACHIEVEMENTS.filter(
    achievement => achievement.condition(userStats)
  );

  return (
    <div className="bg-dark-200 rounded-lg p-6">
      <h3 className="text-xl font-bold text-white mb-4">🏆 Başarımlar</h3>
      
      <div className="space-y-3">
        {ACHIEVEMENTS.map(achievement => (
          <div 
            key={achievement.id}
            className={`p-3 rounded-lg flex items-center space-x-3 ${
              unlockedAchievements.includes(achievement)
                ? 'bg-brand-600/20 border border-brand-600/50'
                : 'bg-dark-300/50 opacity-60'
            }`}
          >
            <div className="text-2xl">{achievement.title.split(' ')[0]}</div>
            <div>
              <div className="text-white font-medium">
                {achievement.title.substring(2)}
              </div>
              <div className="text-gray-400 text-sm">
                {achievement.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}