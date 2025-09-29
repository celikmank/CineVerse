import axios from "axios";
import { useToastStore } from "../store/useToastStore";

// --- TMDB API AYARLARI ---
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

// TMDB endpoints
export const getPopularMovies = (page = 1) =>
  axios.get(`${TMDB_BASE_URL}/movie/popular`, {
    params: { api_key: TMDB_API_KEY, language: "tr-TR", page },
  });

export const getMovieDetails = (tmdbId) =>
  axios.get(`${TMDB_BASE_URL}/movie/${tmdbId}`, {
    params: { api_key: TMDB_API_KEY, language: "tr-TR" },
  });

export const getMovieCredits = (tmdbId) =>
  axios.get(`${TMDB_BASE_URL}/movie/${tmdbId}/credits`, {
    params: { api_key: TMDB_API_KEY, language: "tr-TR" },
  });

export const searchMovies = (query, page = 1) =>
  axios.get(`${TMDB_BASE_URL}/search/movie`, {
    params: { api_key: TMDB_API_KEY, language: "tr-TR", query, page, include_adult: false },
  });

export const getTopRatedMovies = (page = 1) =>
  axios.get(`${TMDB_BASE_URL}/movie/top_rated`, {
    params: { api_key: TMDB_API_KEY, language: "tr-TR", page },
  });

export const getUpcomingMovies = (page = 1) =>
  axios.get(`${TMDB_BASE_URL}/movie/upcoming`, {
    params: { api_key: TMDB_API_KEY, language: "tr-TR", page },
  });

export const getNowPlayingMovies = (page = 1) =>
  axios.get(`${TMDB_BASE_URL}/movie/now_playing`, {
    params: { api_key: TMDB_API_KEY, language: "tr-TR", page },
  });

// --- BACKEND API AYARLARI ---
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5067/api";
const api = axios.create({ baseURL: apiBaseUrl });

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// 429 için kullanıcı dostu mesaj
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 429) {
      useToastStore.getState().addToast({
        type: "warning",
        message: "Çok hızlı işlem yaptınız. Lütfen birkaç saniye sonra tekrar deneyin.",
      });
    }
    return Promise.reject(error);
  }
);

// Favoriler
export const getFavorites = () => api.get("/favorites");
export const addToFavorites = (tmdbId) => api.post(`/favorites/${tmdbId}`);
export const removeFromFavorites = (tmdbId) => api.delete(`/favorites/${tmdbId}`);

// İzleme listesi
export const getWatchlist = () => api.get("/watchlist");
export const addToWatchlist = (tmdbId) => api.post(`/watchlist/${tmdbId}`);
export const removeFromWatchlist = (tmdbId) => api.delete(`/watchlist/${tmdbId}`);

// Reviews
export const getReviews = (tmdbId) => api.get(`/movies/${tmdbId}/reviews`);
export const addReview = (tmdbId, payload) => api.post(`/movies/${tmdbId}/reviews`, payload);

// Similar movies
export const getSimilarMovies = (tmdbId, page = 1) =>
  axios.get(`${TMDB_BASE_URL}/movie/${tmdbId}/similar`, {
    params: { api_key: TMDB_API_KEY, language: "tr-TR", page },
  });