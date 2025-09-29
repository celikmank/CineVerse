import React, { useState, useEffect } from 'react';
import { useUserStore } from '../store/useUserStore';

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const { watchlistIds } = useUserStore();

  useEffect(() => {
    // Check for new releases of watchlisted movies
    const checkWatchlistUpdates = async () => {
      // Implementation for checking new releases
    };
    
    checkWatchlistUpdates();
  }, [watchlistIds]);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full text-gray-300 hover:text-white hover:bg-dark-200 relative"
      >
        🔔
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-brand-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {notifications.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-dark-200 rounded-lg shadow-lg border border-dark-300 z-50">
          <div className="p-4">
            <h3 className="text-white font-bold mb-3">🔔 Bildirimler</h3>
            {notifications.length > 0 ? (
              notifications.map((notification, index) => (
                <div key={index} className="p-3 bg-dark-300 rounded-lg mb-2">
                  <p className="text-white text-sm">{notification.message}</p>
                  <span className="text-gray-400 text-xs">{notification.time}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-4">Yeni bildirim yok</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}