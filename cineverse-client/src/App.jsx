import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MovieList from "./pages/MovieList";
import MovieDetails from "./pages/MovieDetails";
import Layout from "./components/Layout";
import FavoritesPage from "./pages/FavoritesPage";
import WatchlistPage from "./pages/WatchlistPage";
import ToastContainer from "./components/common/ToastContainer";
import SettingsModal from "./components/SettingsModal";
import { useThemeStore } from "./store/useThemeStore";

function App() {
  const { currentTheme, themes } = useThemeStore();
  const currentThemeConfig = themes[currentTheme];

  return (
    <Router>
      <div
        className="min-h-screen"
        style={{
          "--brand-primary": currentThemeConfig.primary,
          "--bg-primary": currentThemeConfig.background,
          "--bg-surface": currentThemeConfig.surface,
          backgroundColor: currentThemeConfig.background,
        }}
      >
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<MovieList />} />
            <Route path="movie/:id" element={<MovieDetails />} />
            <Route path="favorites" element={<FavoritesPage />} />
            <Route path="watchlist" element={<WatchlistPage />} />
          </Route>
        </Routes>
        <ToastContainer />
      </div>
    </Router>
  );
}

export default App;