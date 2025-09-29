import React, { useState } from 'react';
import { useThemeStore } from '../store/useThemeStore';

export default function SettingsModal({ isOpen, onClose }) {
  const { currentTheme, preferences, setTheme, updatePreferences, themes } = useThemeStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-200 rounded-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">⚙️ Ayarlar</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            ✕
          </button>
        </div>

        {/* Theme Selection */}
        <div className="mb-6">
          <h3 className="text-white font-semibold mb-3">🎨 Tema</h3>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(themes).map(([themeKey, themeData]) => (
              <button
                key={themeKey}
                onClick={() => setTheme(themeKey)}
                className={`p-3 rounded-lg border-2 transition-colors ${
                  currentTheme === themeKey
                    ? 'border-brand-600 bg-brand-600/10'
                    : 'border-gray-600 hover:border-gray-500'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: themeData.primary }}
                  />
                  <span className="text-white capitalize">{themeKey}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Preferences */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-white">🎬 Otomatik Fragman</span>
            <input
              type="checkbox"
              checked={preferences.autoplayTrailers}
              onChange={(e) => updatePreferences({ autoplayTrailers: e.target.checked })}
              className="w-5 h-5"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-white">🔞 Yetişkin İçerik</span>
            <input
              type="checkbox"
              checked={preferences.adultContent}
              onChange={(e) => updatePreferences({ adultContent: e.target.checked })}
              className="w-5 h-5"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-white">📱 Grid Boyutu</span>
            <select
              value={preferences.gridSize}
              onChange={(e) => updatePreferences({ gridSize: e.target.value })}
              className="bg-dark-300 text-white rounded px-3 py-1"
            >
              <option value="small">Küçük</option>
              <option value="medium">Orta</option>
              <option value="large">Büyük</option>
            </select>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 bg-brand-600 hover:bg-brand-700 text-white py-3 rounded-lg transition-colors"
        >
          Kaydet
        </button>
      </div>
    </div>
  );
}