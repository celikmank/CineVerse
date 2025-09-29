import React, { useState, useEffect } from 'react';
import { Outlet, Link, NavLink } from 'react-router-dom';
import { useUserStore } from '../store/useUserStore';
import Toaster from './Toaster';

export default function Layout() {
  const { isLoggedIn, logout } = useUserStore();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-dark-100 text-white font-netflix">
      {/* Netflix Header */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled ? 'bg-dark-100/95 backdrop-blur-md' : 'bg-transparent'
      }`}>
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          {/* Logo */}
          <Link 
            to="/" 
            className="text-brand-600 text-2xl font-bold hover:text-brand-500 transition-colors duration-300"
          >
            🎬 CineVerse
          </Link>

          {/* Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink to="/" className="text-gray-300 hover:text-white transition-colors duration-300 font-medium">
              Ana Sayfa
            </NavLink>
            <NavLink to="/movies" className="text-gray-300 hover:text-white transition-colors duration-300 font-medium">
              Filmler
            </NavLink>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <NavLink
                  to="/favorites"
                  className={({ isActive }) =>
                    `p-2 rounded-full transition-all duration-300 ${
                      isActive ? 'bg-brand-600 text-white' : 'text-gray-300 hover:text-white hover:bg-dark-200'
                    }`
                  }
                  title="Favoriler"
                >
                  ❤️
                </NavLink>

                <NavLink
                  to="/watchlist"
                  className={({ isActive }) =>
                    `p-2 rounded-full transition-all duration-300 ${
                      isActive ? 'bg-accent-400 text-dark-100' : 'text-gray-300 hover:text-white hover:bg-dark-200'
                    }`
                  }
                  title="İzleme Listem"
                >
                  📋
                </NavLink>

                <button
                  onClick={logout}
                  className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:shadow-netflix"
                >
                  Çıkış
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-300 hover:text-white transition-colors">
                  Giriş
                </Link>
                <Link to="/register" className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300">
                  Kayıt Ol
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="pt-16">
        <Outlet />
      </main>

      {/* Toast Container */}
      <Toaster />
    </div>
  );
}