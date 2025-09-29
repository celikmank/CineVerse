import React, { useEffect, useState } from "react";
import { getReviews, addReview } from "../api/movieApi";
import { useToastStore } from "../store/useToastStore";

export default function ReviewsPanel({ tmdbId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(8);
  const [submitting, setSubmitting] = useState(false);
  const addToast = useToastStore((s) => s.addToast);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getReviews(tmdbId)
      .then((res) => active && setReviews(res.data ?? []))
      .catch(() => active && setReviews([]))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [tmdbId]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      addToast({ type: "warning", message: "Lütfen bir yorum yazın." });
      return;
    }
    setSubmitting(true);
    try {
      const res = await addReview(tmdbId, { content: content.trim(), rating });
      setReviews((prev) => [res.data, ...prev]);
      setContent("");
      setRating(8);
      addToast({ type: "success", message: "Yorum eklendi." });
    } catch {
      addToast({ type: "error", message: "Yorum eklenemedi." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="reviews" className="mt-8">
      <h2 className="text-xl font-semibold text-white mb-4">Yorumlar</h2>

      <form onSubmit={onSubmit} className="mb-6 p-4 bg-gray-800 rounded-lg">
        <label className="block text-sm text-gray-300 mb-2">
          Puan
          <select
            className="ml-2 bg-gray-900 text-white rounded px-2 py-1"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
          >
            {Array.from({ length: 10 }, (_, i) => i + 1).map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </label>
        <textarea
          className="w-full mt-2 bg-gray-900 text-white rounded p-3 min-h-24"
          placeholder="Düşüncelerini paylaş..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="mt-3 flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 rounded-md bg-brand-600 hover:bg-brand-700 text-white disabled:opacity-60"
          >
            {submitting ? "Gönderiliyor..." : "Gönder"}
          </button>
        </div>
      </form>

      {loading ? (
        <div className="text-gray-400">Yükleniyor...</div>
      ) : reviews.length === 0 ? (
        <div className="text-gray-400">Henüz yorum yok. İlk yorumu sen yaz!</div>
      ) : (
        <ul className="space-y-4">
          {reviews.map((r, idx) => (
            <li key={r.id ?? idx} className="p-4 bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">
                  {r.userName ?? "Kullanıcı"} • {r.rating}/10
                </span>
                <span className="text-xs text-gray-500">
                  {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ""}
                </span>
              </div>
              <p className="mt-2 text-gray-200 whitespace-pre-wrap">{r.content}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}