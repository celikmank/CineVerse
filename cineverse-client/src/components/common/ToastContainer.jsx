import React from 'react';
import { useToastStore } from '../../store/useToastStore';
import Toast from './Toast';

export default function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed bottom-6 right-6 z-50 space-y-3">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration || 4000}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}