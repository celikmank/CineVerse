import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getMovieDetails, getMovieCredits, getReviews, addReview, getSimilarMovies } from "../api/movieApi";
import placeholderImage from "../assets/placeholder.jpg";
import { useUserStore } from '../store/useUserStore';
import { useToastStore } from '../store/useToastStore';

export default function MovieDetails() {
  const { id } = useParams();
    const tmdbId = Number(id);

    const { favoriteIds, watchlistIds, toggleFavorite, toggleWatchlist } = useUserStore();
    const { show } = useToastStore();
    const isFavorite = favoriteIds.has(tmdbId);
    const isInWatchlist = watchlistIds.has(tmdbId);

  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
    const [cast, setCast] = useState([]);
    const [activeTab, setActiveTab] = useState("overview");
    const [reviews, setReviews] = useState([]);
    const [reviewContent, setReviewContent] = useState("");
    const [reviewRating, setReviewRating] = useState(8);
    const [similar, setSimilar] = useState([]);

  useEffect(() => {
        let active = true;
    const fetchMovie = async () => {
      try {
        setIsLoading(true);
        setError(null);
                const [detailsRes, creditsRes, reviewsRes, similarRes] = await Promise.all([
                    getMovieDetails(tmdbId),
                    getMovieCredits(tmdbId),
                    getReviews(tmdbId),
                    getSimilarMovies(tmdbId),
                ]);

                if (!active) return;

                setMovie(detailsRes.data);
                setCast(creditsRes.data.cast?.slice(0, 12) ?? []);
                setReviews(reviewsRes.data ?? []);
                setSimilar(similarRes.data.results?.slice(0, 10) ?? []);
      } catch (err) {
        console.error("Film detayları alınırken hata oluştu:", err);
                if (active) setError("Film detayları yüklenemedi. Lütfen daha sonra tekrar deneyin.");
      } finally {
                if (active) setIsLoading(false);
      }
    };

    fetchMovie();
        return () => {
            active = false;
        };
    }, [tmdbId]);

    const handleAddReview = async (e) => {
        e.preventDefault();
        try {
            await addReview(tmdbId, { content: reviewContent.trim(), rating: reviewRating });
            const res = await getReviews(tmdbId);
            setReviews(res.data ?? []);
            setReviewContent("");
            setReviewRating(8);
            show('Yorum gönderildi', 'success');
        } catch (err) {
            console.error("Yorum eklenemedi", err);
            show('Yorum gönderilemedi', 'error');
        }
    };

  if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-brand-500"></div>
            </div>
        );
  }

  if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <div className="text-red-500 text-xl mb-4">{error}</div>
                <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-brand-600 text-white rounded hover:bg-brand-700"
                >
                    Tekrar Dene
                </button>
            </div>
        );
  }

  if (!movie) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-gray-400 text-xl">Film bulunamadı.</div>
            </div>
        );
    }

    const posterUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w400${movie.poster_path}` : placeholderImage;

  return (
        <div className="min-h-screen bg-gray-900 text-white">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="md:w-1/3">
      <img
        src={posterUrl}
        alt={movie.title}
                            className="w-full rounded-lg shadow-lg"
                        />

                        {/* Favoriler ve İzleme Listesi butonları poster altında */}
                        <div className="flex gap-2 mt-4">
                            <button
                                onClick={() => { toggleFavorite(tmdbId); show(isFavorite ? 'Favorilerden çıkarıldı' : 'Favorilere eklendi', 'success'); }}
                                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${isFavorite
                                        ? 'bg-red-600 hover:bg-red-700 text-white'
                                        : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                                    }`}
                            >
                                <span className="mr-2">{isFavorite ? '❤️' : '🤍'}</span>
                                {isFavorite ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
                            </button>

                            <button
                                onClick={() => { toggleWatchlist(tmdbId); show(isInWatchlist ? 'Listeden çıkarıldı' : 'Listeye eklendi', 'success'); }}
                                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${isInWatchlist
                                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                        : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                                    }`}
                            >
                                <span className="mr-2">{isInWatchlist ? '📋' : '➕'}</span>
                                {isInWatchlist ? 'Listeden Çıkar' : 'Listeye Ekle'}
                            </button>
                        </div>
                    </div>

                    <div className="md:w-2/3">
                        <h1 className="text-4xl font-bold mb-2">
                            {movie.title}
                            {movie.release_date && (
                                <span className="text-2xl font-light text-gray-400 ml-2">
                                    ({new Date(movie.release_date).getFullYear()})
                                </span>
                            )}
                        </h1>

                        {typeof movie.vote_average === "number" && (
                            <div className="flex items-center mb-4">
                                <span className="text-yellow-400 text-xl font-bold mr-2">
                                    ★ {movie.vote_average.toFixed(1)}
                                </span>
                                <span className="text-gray-400">/10</span>
                            </div>
                        )}

                        {movie.genres && movie.genres.length > 0 && (
                            <div className="mb-4">
                                <div className="flex flex-wrap gap-2">
                                    {movie.genres.map((genre) => (
                                        <span
                                            key={genre.id}
                                            className="px-3 py-1 bg-gray-800 rounded-full text-sm"
                                        >
                                            {genre.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Güncellenmiş Tab Sistemi - İkonlar ve Mobil Responsive */}
                        <div className="mb-6">
                            <div className="flex overflow-x-auto bg-gray-800 p-1 rounded-lg">
                                {[
                                    { k: "overview", l: "Genel Bakış", icon: "📄" },
                                    { k: "cast", l: "Oyuncular", icon: "👥" },
                                    { k: "reviews", l: "Yorumlar", icon: "💬" }
                                ].map((tab) => (
                                    <button
                                        key={tab.k}
                                        onClick={() => setActiveTab(tab.k)}
                                        className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${activeTab === tab.k
                                                ? "bg-brand-600 text-white"
                                                : "text-gray-300 hover:text-white hover:bg-gray-700"
                                            }`}
                                    >
                                        <span className="mr-2 text-base">{tab.icon}</span>
                                        <span className="hidden sm:inline">{tab.l}</span>
                                        <span className="sm:hidden">{tab.l.split(' ')[0]}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="min-h-96">
                            {activeTab === "overview" && (
                                <div>
                                    <p className="text-lg leading-relaxed text-gray-300 mb-6">
                                        {movie.overview || "Bu film için özet bilgisi bulunmuyor."}
                                    </p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        {movie.release_date && (
                                            <div>
                                                <span className="text-gray-400">Çıkış Tarihi:</span>
                                                <span className="ml-2">{movie.release_date}</span>
                                            </div>
                                        )}
                                        {movie.runtime && (
                                            <div>
                                                <span className="text-gray-400">Süre:</span>
                                                <span className="ml-2">{movie.runtime} dakika</span>
                                            </div>
                                        )}
                                        {movie.budget > 0 && (
                                            <div>
                                                <span className="text-gray-400">Bütçe:</span>
                                                <span className="ml-2">${movie.budget.toLocaleString()}</span>
                                            </div>
                                        )}
                                        {movie.revenue > 0 && (
                                            <div>
                                                <span className="text-gray-400">Hasılat:</span>
                                                <span className="ml-2">${movie.revenue.toLocaleString()}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeTab === "cast" && (
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {cast.length > 0 ? cast.map((person) => (
                                        <div key={person.cast_id || person.credit_id} className="text-center">
                                            <img
                                                src={person.profile_path ? `https://image.tmdb.org/t/p/w185${person.profile_path}` : placeholderImage}
                                                alt={person.name}
                                                className="w-full h-48 object-cover rounded-lg mb-2"
                                            />
                                            <h3 className="font-semibold text-sm">{person.name}</h3>
                                            <p className="text-xs text-gray-400">{person.character}</p>
                                        </div>
                                    )) : (
                                        <div className="col-span-full text-center text-gray-400">
                                            Bu film için oyuncu bilgisi bulunmuyor.
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === "reviews" && (
                                <div>
                                    <form onSubmit={handleAddReview} className="mb-6 p-4 bg-gray-800 rounded-lg">
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium mb-2">
                                                Puanınız (1-10):
                                                <select
                                                    value={reviewRating}
                                                    onChange={(e) => setReviewRating(Number(e.target.value))}
                                                    className="ml-2 bg-gray-700 text-white rounded px-2 py-1"
                                                >
                                                    {[...Array(10)].map((_, i) => (
                                                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                                                    ))}
                                                </select>
                                            </label>
                                        </div>

                                        <textarea
                                            value={reviewContent}
                                            onChange={(e) => setReviewContent(e.target.value)}
                                            placeholder="Yorumunuzu yazın..."
                                            className="w-full p-3 bg-gray-700 text-white rounded-lg resize-none"
                                            rows="4"
                                        />

                                        <button
                                            type="submit"
                                            className="mt-3 px-6 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg transition-colors"
                                        >
                                            Yorum Gönder
                                        </button>
                                    </form>

                                    <div className="space-y-4">
                                        {reviews.length > 0 ? reviews.map((review, index) => (
                                            <div key={review.id || index} className="p-4 bg-gray-800 rounded-lg">
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="font-semibold">
                                                        {review.user?.username || "Kullanıcı"}
                                                    </span>
                                                    <span className="text-yellow-400 font-bold">
                                                        ★ {review.rating}/10
                                                    </span>
                                                </div>
                                                <p className="text-gray-300">{review.content}</p>
                                                {review.createdAt && (
                                                    <p className="text-xs text-gray-500 mt-2">
                                                        {new Date(review.createdAt).toLocaleDateString()}
                                                    </p>
                                                )}
                                            </div>
                                        )) : (
                                            <div className="text-center text-gray-400 py-8">
                                                Henüz yorum yok. İlk yorumu siz yapın!
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {similar.length > 0 && (
                    <div className="mt-12">
                        <h2 className="text-2xl font-bold mb-6">Benzer Filmler</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {similar.map((movie) => (
                                <Link key={movie.id} to={`/movie/${movie.id}`} className="group cursor-pointer">
                                    <img
                                        src={movie.poster_path ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` : placeholderImage}
                                        alt={movie.title}
                                        className="w-full rounded-lg group-hover:scale-105 transition-transform"
                                    />
                                    <h3 className="mt-2 text-sm font-medium group-hover:text-brand-400">
                                        {movie.title}
                                    </h3>
                                    {movie.release_date && (
                                        <p className="text-xs text-gray-400">
                                            {new Date(movie.release_date).getFullYear()}
                                        </p>
                                    )}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
      </div>
    </div>
  );
}