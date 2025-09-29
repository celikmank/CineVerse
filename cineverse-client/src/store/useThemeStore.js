import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useThemeStore = create(
  persist(
    (set, get) => ({
      // Theme options
      currentTheme: 'netflix', // netflix, disney, marvel, classic
      
      // User preferences
      preferences: {
        autoplayTrailers: true,
        showSpoilers: false,
        gridSize: 'medium', // small, medium, large
        language: 'tr-TR',
        adultContent: false,
      },

      // Theme configurations
      themes: {
        netflix: {
          primary: '#E50914',
          background: '#141414',
          surface: '#1a1a1a',
        },
        disney: {
          primary: '#0063d1',
          background: '#0f1419',
          surface: '#1a242e',
        },
        marvel: {
          primary: '#ed1d24',
          background: '#0c0c0c',
          surface: '#1a1a1a',
        }
      },

      setTheme: (theme) => set({ currentTheme: theme }),
      updatePreferences: (newPrefs) => 
        set(state => ({ 
          preferences: { ...state.preferences, ...newPrefs } 
        })),
    }),
    {
      name: 'cineverse-theme',
    }
  )
);