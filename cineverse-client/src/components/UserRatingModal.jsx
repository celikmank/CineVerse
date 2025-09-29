import React, { useState } from 'react';

export default function UserRatingModal({ isOpen, onClose, onSubmit, currentRating = 0 }) {
  const [rating, setRating] = useState(currentRating);
  
  const handleSubmit = () => {
    onSubmit(rating);
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75">
      <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full shadow-lg transform transition-all">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-xl font-bold text-white">Filmi puanla</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="flex flex-col items-center mb-5">
          <div className="flex items-center space-x-1 mb-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
              <button
                key={star}
                type="button"
                className={`p-1 ${rating >= star ? 'text-yellow-400' : 'text-gray-600'}`}
                onClick={() => setRating(star)}
              >
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
            ))}
          </div>
          <p className="text-3xl font-bold text-white">{rating} / 10</p>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 px-4 rounded-md bg-gray-700 text-white hover:bg-gray-600 transition-colors"
          >
            İptal
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-2 px-4 rounded-md bg-brand-600 text-white hover:bg-brand-500 transition-colors"
            disabled={rating === 0}
          >
            Puan Ver
          </button>
        </div>
      </div>
    </div>
  );
}