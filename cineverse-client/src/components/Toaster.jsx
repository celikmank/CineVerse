import React from 'react';
import { useToastStore } from '../store/useToastStore';

export default function Toaster() {
  const { toasts, remove } = useToastStore();
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(t => (
        <div key={t.id} className={`px-4 py-3 rounded-md shadow-lg text-sm ${
          t.type === 'success' ? 'bg-green-600 text-white' : t.type === 'error' ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-100'
        }`}>
          <div className="flex items-start gap-3">
            <span>{t.message}</span>
            <button onClick={() => remove(t.id)} className="ml-2 text-white/80 hover:text-white">×</button>
          </div>
        </div>
      ))}
    </div>
  );
}


