import { create } from 'zustand';
import { getFavorites, addToFavorites, removeFromFavorites, getWatchlist, addToWatchlist, removeFromWatchlist } from '../api/movieApi';
import { useToastStore } from './useToastStore';

export const useUserStore = create((set, get) => ({
  // --- STATE (Uygulamanın hafızası) ---
  favoriteIds: new Set(),
  watchlistIds: new Set(),
  isListsLoaded: false, // Listelerin ilk başta yüklenip yüklenmediğini kontrol etmek için
  // Basit auth durumu: token var mı?
  isLoggedIn: Boolean(localStorage.getItem('token')),

  // --- ACTIONS (Hafızayı değiştiren fonksiyonlar) ---

  // 1. Backend'den tüm listeleri çeken ana fonksiyon
  fetchUserLists: async () => {
    // Eğer listeler zaten yüklendiyse tekrar çekme
    if (get().isListsLoaded) return; 
    
    try {
      const [favoritesRes, watchlistRes] = await Promise.all([getFavorites(), getWatchlist()]);
      set({
        favoriteIds: new Set(favoritesRes.data),
        watchlistIds: new Set(watchlistRes.data),
        isListsLoaded: true,
      });
    } catch (error) {
      console.error("Kullanıcı listeleri yüklenirken hata oluştu:", error);
      // Burada login olup olmadığını kontrol edip login sayfasına yönlendirebiliriz
    }
  },

  // Basit çıkış fonksiyonu: token temizle ve state güncelle
  logout: () => {
    localStorage.removeItem('token');
    set({ isLoggedIn: false, favoriteIds: new Set(), watchlistIds: new Set(), isListsLoaded: false });
  },

  // 2. Bir filmin favori durumunu değiştiren fonksiyon
  toggleFavorite: async (tmdbId) => {
    const { favoriteIds } = get();
    const wasFavorite = favoriteIds.has(tmdbId);
    const toastStore = useToastStore.getState();
    
    // Optimistic UI güncellemeleri
    const newFavoriteIds = new Set(favoriteIds);
    if (wasFavorite) {
      newFavoriteIds.delete(tmdbId);
    } else {
      newFavoriteIds.add(tmdbId);
    }
    set({ favoriteIds: newFavoriteIds });

    try {
      if (wasFavorite) {
        await removeFromFavorites(tmdbId);
        toastStore.addToast({ 
          type: 'success', 
          message: 'Film favorilerden kaldırıldı' 
        });
      } else {
        await addToFavorites(tmdbId);
        toastStore.addToast({ 
          type: 'success', 
          message: 'Film favorilere eklendi' 
        });
      }
    } catch (error) {
      console.error("Favori durumu güncellenirken hata:", error);
      set({ favoriteIds }); // Hata olursa state'i eski haline döndür
      toastStore.addToast({ 
        type: 'error', 
        message: 'İşlem sırasında bir hata oluştu' 
      });
    }
  },
  
  // 3. Bir filmin izleme listesi durumunu değiştiren fonksiyon
  toggleWatchlist: async (tmdbId) => {
    const { watchlistIds } = get();
    const wasInWatchlist = watchlistIds.has(tmdbId);
    
    // Optimistic UI
    const newWatchlistIds = new Set(watchlistIds);
    if (wasInWatchlist) {
      newWatchlistIds.delete(tmdbId);
    } else {
      newWatchlistIds.add(tmdbId);
    }
    set({ watchlistIds: newWatchlistIds });

    // Backend'i güncelle
    try {
      if (wasInWatchlist) {
        await removeFromWatchlist(tmdbId);
      } else {
        await addToWatchlist(tmdbId);
      }
    } catch (error) {
      console.error("İzleme listesi durumu güncellenirken hata:", error);
      set({ watchlistIds }); // Hata durumunda geri al
    }
  },
}));