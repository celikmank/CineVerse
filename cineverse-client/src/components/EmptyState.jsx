import React from 'react';
import { Link } from 'react-router-dom';

export default function EmptyState({ 
  title = "Henüz içerik yok", 
  message = "Burada gösterilecek içerik bulamadık.",
  icon = "default",
  action = null,
  actionLink = "/"
}) {
  const icons = {
    default: (
      <svg className="w-16 h-16 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    favorites: (
      <svg className="w-16 h-16 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    watchlist: (
      <svg className="w-16 h-16 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
      </svg>
    ),
    search: (
      <svg className="w-16 h-16 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    error: (
      <svg className="w-16 h-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    )
  };
  
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="bg-gray-800 p-8 rounded-xl shadow-soft flex flex-col items-center max-w-lg">
        {icons[icon]}
        <h3 className="mt-6 text-xl font-semibold text-white">{title}</h3>
        <p className="mt-2 text-gray-400">{message}</p>
        
        {action && (
          <Link 
            to={actionLink}
            className="mt-6 px-5 py-2.5 rounded-md bg-brand-600 text-white hover:bg-brand-700 transition-colors"
          >
            {action}
          </Link>
        )}
      </div>
    </div>
  );
}

// Favorites with no content
<EmptyState 
  title="Henüz favorin yok"
  message="Beğendiğin filmleri favorilere ekleyerek burada görüntüleyebilirsin."
  icon="favorites"
  action="Popüler filmlere göz at"
  actionLink="/"
/>

// Search with no results
<EmptyState 
  title="Sonuç bulunamadı"
  message={`"${query}" için sonuç bulamadık. Farklı bir arama yapmayı deneyin.`}
  icon="search"
/>

// API error
<EmptyState 
  title="Bir şeyler ters gitti"
  message="Veriler yüklenirken bir hata oluştu. Lütfen tekrar deneyin."
  icon="error"
  action="Tekrar dene"
  actionLink={location.pathname}
/>